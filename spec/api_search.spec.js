var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
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
                var query = existingFile.match(/[^/]*$/)[0]; //extracts the filename
                eg.API.search.query(query).then(function (body) {
                    console.log("body",body)
                    expect(body.results).toContain(jasmine.objectContaining({
                        path: existingFile
                    }));
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
            });
        }


    });
});
