var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("Storage API facade integration", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 2
    });


    if (ImInBrowser) {
        if (!window.egnyteDomain || !window.APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    } else {
        if (!egnyteDomain || !APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    }

    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });



    var testpath;


    describe("Chunked file upload", function () {
        it("Needs a location to upload to", function (done) {
            eg.API.storage.get("/Private")
                .then(function (e) {
                    expect(e["folders"]).toBeDefined();
                    //this test suite has unicorns and bacon, it can't get any better/
                    testpath = e.folders[0].path + "/bacon" + ~~(10000 * Math.random());
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });



        it("Can store a file", function (done) {

            eg.API.storage.startChunkedUpload(testpath, "[chunk 1 content]")
                .then(function (chunked) {

                    chunked.sendChunk("[chunk 2 content]", 2); //number is optional
                    chunked.sendChunk("[chunk 3 content]", 3);

                    return chunked.sendLastChunk("[chunk 4 content]").then(function (result) {
                        //success
                    })

                })
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["entry_id"]).toBeTruthy();
                    expect(e["size"] > 0).toBeTruthy();

                    eg.API.storage.remove(testpath).then(function () {
                        done();
                    })
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });


        if (!ImInBrowser) {
            it("Can store a file stream", function (done) {
                //TODO spec this out
                done();

            });
        }



    });


});