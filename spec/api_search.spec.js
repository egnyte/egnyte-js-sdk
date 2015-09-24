var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("Search API facade", function () {

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


    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });


    describe("Searching for a folder we know exists", function () {

        if (typeof existingFile !== "undefined") {

            it("Should get results", function (done) {
                var query = existingFile.match(/[^/]*$/)[0];
                console.log(query)
                eg.API.search.query(query).then(function (body) {
console.log(JSON.stringify(body.results,null,2))
                    expect(body.results[0].path).toBe(existingFile);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
            });
        }


    });
});
