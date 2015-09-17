var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("Search API facade", function() {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 2
    });

    function getFileContent(content) {
        if (ImInBrowser) {
            return content;
        } else {
            var s = new stream.Readable();
            s.push(content);
            s.push(null);
            return s;
        }
    }


    if (!egnyteDomain || !APIToken) {
        throw new Error("spec/conf/apiaccess.js is missing");
    }


    beforeEach(function() {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });

    var testpath = "/Shared/SDKTests/haystack" + ~~(Math.random() * 99999);
    var needlename = "needle" + Math.random().toFixed(15);

    describe("Searching for a file", function() {

        var fileId;

        it("Needs items to look for", function(done) {
            eg.API.storage.path(testpath).exists().then(function(exists) {
                if (exists) {
                    return eg.API.storage.path(testpath).remove()
                }
            }).then(function() {
                return eg.API.storage.path(testpath).createFolder()
                    .then(function(e) {
                        return eg.API.storage.path(testpath + "/" + needlename).storeFile(getFileContent("needle in a haystack!"))
                    }).then(function(result) {
                        fileId = result.id;
                        done();
                    });
            }).fail(function(e) {
                console.error(e.stack);
            });
        });


        it("Should get results", function(done) {
            var filePath = testpath + "/candy.txt";
            var events = 0;

            eg.API.search.query(needlename).then(function(body) {
                expect(body.results[0].entry_id).toBe(fileId);
                done();
            }).fail(function(e) {
                expect(this).toAutoFail(e);
                done();
            });
        });

        it("Needs to clean up after itself", function(done) {
            eg.API.storage.path(testpath).exists().then(function(exists) {
                if (exists) {
                    return eg.API.storage.path(testpath).remove()
                }
            }).then(function() {
                done();
            }).fail(function(e) {
                console.error(e.stack);
                done()
            });
        })



    });
});
