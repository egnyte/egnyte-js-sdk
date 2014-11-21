var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("API auth", function () {



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

    describe("Token init", function () {
        //our main testsubject
        var eg = Egnyte.init(egnyteDomain, {
            token: APIToken,
            oldIEForwarder: true, //opt in for IE8/9 support
            QPS: 2
        });

        it('should accept an existing token', function () {
            //token was passed in beforeEach
            expect(eg.API.auth.isAuthorized()).toBe(true);
        });


        it("Should provide userinfo", function (done) {
            eg.API.auth.getUserInfo().then(function (info) {
                expect(info).toBeTruthy();
                expect(info.username).toBeDefined();
                expect(info.username.length).toBeGreaterThan(1);
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });



    });
    if (!ImInBrowser && typeof APIPassword !== "undefined" && typeof APIKey !== "undefined") {
        describe("Password grant", function () {
            var eg2 = Egnyte.init(egnyteDomain, {
                key: APIKey,
                QPS: 2
            });

            it('should be able to log in', function (done) {
                expect(eg2.API.auth.isAuthorized()).toBe(false);
                eg2.API.auth.requestTokenByPassword(APIUsername, APIPassword).then(function () {
                    console.log("token:",eg2.API.auth.getToken());
                    expect(eg2.API.auth.isAuthorized()).toBe(true);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
            });
        });
    }

    


});