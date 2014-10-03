var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}


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



describe("Impersonation", function () {

    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });
    var recentFileObject;

    it("Should store impersonation for just one call", function (done) {
        var storageAPI = eg.API.storage.impersonate("dude");
        expect(storageAPI._decorations["impersonate"]).toBe('dude');
        storageAPI.exists("/Private").then(done,done);
        setTimeout(function(){
        expect(storageAPI._decorations["impersonate"]).not.toBeTruthy();
        },1);

    });

    it("Should add a header to the call", function (done) {
        eg.API.storage.impersonate("dude").exists("/Private")
            .then(function (resp) {
                console.log(resp);
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

    });

    
});