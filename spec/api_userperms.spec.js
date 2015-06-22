var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("User Effective Permissions API", function () {

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




    it("Can check user permissions", function (done) {
        //would be nice to create the user first...
        eg.API.userPerms.path("/Shared").get()
            .then(function (res) {
                expect(res.permission).toMatch(/Owner|Full|Editor|Viewer|None/);
                console.log(JSON.stringify(res));
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

    });
    
    

});