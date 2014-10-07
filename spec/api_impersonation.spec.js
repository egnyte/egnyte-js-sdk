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

    it("Should maintain impersonation scope", function (done) {
        var impersonatedStorageAPI = eg.API.storage.impersonate({
            username: "inexistentdude"
        });
        expect(impersonatedStorageAPI._decorations["impersonate"]).toEqual({
            username: "inexistentdude"
        });
        expect(eg.API.storage._decorations).not.toBeDefined();
        var after = function () {
            expect(impersonatedStorageAPI._decorations["impersonate"]).toEqual({
                username: "inexistentdude"
            });
            expect(eg.API.storage._decorations).not.toBeDefined();
            done();
        }
        impersonatedStorageAPI.exists("/Private").then(after, after);

    });

    it("Should extend impersonation scope correctly", function (done) {
        var impersonatedStorageAPI = eg.API.storage.impersonate({
            username: "inexistentdude"
        });
        var reImpersonatedStorageAPI = impersonatedStorageAPI.impersonate({
            username: "someotherdude"
        });
        expect(impersonatedStorageAPI._decorations["impersonate"]).toEqual({
            username: "inexistentdude"
        });
        expect(reImpersonatedStorageAPI._decorations["impersonate"]).toEqual({
            username: "someotherdude"
        });
        expect(eg.API.storage._decorations).not.toBeDefined();
        var after = function () {
            expect(impersonatedStorageAPI._decorations["impersonate"]).toEqual({
                username: "inexistentdude"
            });
            expect(reImpersonatedStorageAPI._decorations["impersonate"]).toEqual({
                username: "someotherdude"
            });
            expect(eg.API.storage._decorations).not.toBeDefined();
            done();
        }
        impersonatedStorageAPI.exists("/Private").then(after, after);

    });

    //this actually tests decorators
    it("Should not collide with other decorators", function (done) {
        eg.API.storage.addDecorator("fooD", function (opts, data) {
            expect(data).toBe('barD');
            return opts;
        })

        var fooDedStorageAPI = eg.API.storage.fooD("barD");
        var impersonatedStorageAPI = fooDedStorageAPI.impersonate({
            username: "inexistentdude"
        });
        var anotherLayerOhNo = impersonatedStorageAPI.fooD("bazD");
        expect(impersonatedStorageAPI._decorations["impersonate"]).toEqual({
            username: "inexistentdude"
        });
        expect(impersonatedStorageAPI._decorations["fooD"]).toBe('barD');
        expect(fooDedStorageAPI._decorations["impersonate"]).not.toEqual({
            username: "inexistentdude"
        });
        expect(fooDedStorageAPI._decorations["fooD"]).toBe('barD');

        done();

    });

    it("Should add a header to the call", function (done) {
        eg.API.storage.impersonate({
            username: "inexistentdude"
        }).exists("/Private")
            .fail(function (e) {
                expect(e.statusCode).toEqual(400);
                done();
            });

    });


});