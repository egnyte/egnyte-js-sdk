var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");
    require("./helpers/node-helpers/commonNode");

    process.setMaxListeners(0);
}

describe("Permissions API facade integration", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 2
    });


    function getTestBlob(txt) {
        var content = '<a id="a"><b id="b">' + txt + '</b></a>'; // the body of the new file...
        if (ImInBrowser) {
            // JavaScript file-like object...
            //PhanthomJS has a broken Blob
            try {
                var blob = new Blob([content], {
                    type: "text/xml"
                });
            } catch (e) {
                //napaeeee!
                var blob = content;
            }
            return blob;
        } else {
            var s = new stream.Readable();
            s.push(content);
            s.push(null);
            return s;
        }
    }



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

    it('should accept an existing token', function () {
        //token was passed in beforeEach
        expect(eg.API.auth.isAuthorized()).toBe(true);
    });

    var testpath;

    describe("Permissions methods", function () {

        it("Needs a folder to set permissions to", function (done) {
            eg.API.storage.path("/Shared").get()
                .then(function (e) {
                    expect(e["folders"]).toBeDefined();
                    //this test suite has unicorns and bacon, it can't get any better/
                    testpath = e.folders[0].path + "/bacon" + ~~(10000 * Math.random());
                    return eg.API.storage.path(testpath).createFolder()
                })
                .then(function (e) {
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });


        it("Can set basic permissions", function (done) {
            //would be nice to create the user first...
            eg.API.perms.users([OtherUsername, "banana"]).path(testpath).allowEdit()
                .then(function (e) {
                    expect(e.statusCode).toEqual(200); //actually checking if it exists
                    return eg.API.perms.users([OtherUsername]).path(testpath).getPerms();
                }).then(function (e) {
                    expect(e.users.length).toBeGreaterThan(0);
                    expect(e.users[0].subject).toBe(OtherUsername);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Can filter permissions", function (done) {
            eg.API.perms.users(["JohnnyIHardlyKnewYa"]).path(testpath).getPerms()
                .then(function (e) {
                    expect(e.users.length).toEqual(0);
                    return eg.API.perms.path(testpath).getPerms();
                }).then(function (e) {
                    expect(e.users.length).toBeGreaterThan(0);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        describe("Impersonated locking", function () {
            var token;

            it("Needs a file to lock", function (done) {
                var blob = getTestBlob("hey!");

                egnyteDelay(eg, null, 1000)
                    .then(function () {
                        return eg.API.storage.path(testpath + "/aaa").storeFile(blob)
                    })
                    .then(function (e) {
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("Can lock a file as other user", function (done) {
                eg.API.storage.impersonate({
                        username: OtherUsername
                    }).path(testpath + "/aaa").lock(null, 1800)
                    .then(function (result) {
                        token = result.lock_token;
                        expect(result.lock_token).toBeTruthy();
                        expect(result.timeout).toBeTruthy();
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("Can unlock a file as other user", function (done) {
                eg.API.storage.impersonate({
                        username: OtherUsername
                    }).path(testpath + "/aaa").unlock(token)
                    .then(function (result) {
                        //just getting here is ok.
                        expect(result).toBeDefined();
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

        });

        it("Needs to clean up the folder", function (done) {
            eg.API.storage.path(testpath).remove()
                .then(function (e) {
                    expect(true).toBeTruthy();
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });

    });
});
