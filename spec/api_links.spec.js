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

describe("Link API facade integration", function () {

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

    describe("Link methods", function () {
        var recentFile;
        var recentLink;

        it("Needs a file to link to", function (done) {
            eg.API.storage.path("/Private").get()
                .then(function (e) {
                    return egnyteDelay(eg, e, 1000)
                })
                .then(function (e) {
                    expect(e["folders"]).toBeDefined();
                    //this test suite has unicorns and bacon, it can't get any better/
                    testpath = e.folders[0].path + "/bacon" + ~~(10000 * Math.random());
                    var blob = getTestBlob("hey!");
                    return eg.API.storage.path(testpath).storeFile(blob)
                })
                .then(function (e) {
                    recentFile = e;
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });


        it("Can create a link to file", function (done) {

            eg.API.link.createLink({
                path: recentFile.path,
                type: "file",
                accessibility: "password"
            }).then(function (e) {
                expect(e["path"]).toEqual(recentFile.path);
                expect(e["type"]).toEqual("file");
                expect(e.links[0].id).toBeTruthy();
                expect(e.links[0].url).toMatch(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i);
                expect(e["password"]).toBeTruthy();
                recentLink = e;
            }).then(function () {
                return eg.API.link.listLink(recentLink.links[0].id);
            }).then(function (e) {
                expect(e["path"]).toEqual(recentFile.path); //actually checking if it exists
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("Can list links and filter the list", function (done) {

            eg.API.link.listLinks({
                path: recentFile.path
            }).then(function (e) {
                expect(e.ids.filter(function (id) {
                    return (id === recentLink.links[0].id);
                }).length).toEqual(1);

                var other = e.ids.filter(function (id) {
                    return (id !== recentLink.links[0].id);
                });
                if (other.length) {
                    eg.API.link.listLink(other[0]).then(function (e) {
                        expect(e["path"]).toEqual(recentFile.path); //actually checking if it exists
                        done();
                    }).fail(function (e) {
                        throw new Error("Link from the list doesn't seem to exist at all");
                    });
                } else {
                    done();
                }
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("Can find one link matching filter", function (done) {

            eg.API.link.findOne({
                path: recentFile.path
            }).then(function (e) {
                expect(e["path"]).toEqual(recentFile.path);
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("Can destroy a link to file", function (done) {

            eg.API.link.removeLink(recentLink.links[0].id).then(function (e) {
                expect(e).toEqual(200);
            }).then(function () {
                return eg.API.link.listLink(recentLink.links[0].id);
            }).then(function () {
                //Should not succeed
                expect(this).toAutoFail("Link still exists");
            }, function (result) {
                //I expect a 404 instead
                expect(result.response.statusCode).toEqual(404);
                done();
            });

        });


        it("Needs to clean up the file", function (done) {
            eg.API.storage.path(testpath).remove()
                .then(function () {
                    expect(true).toBeTruthy();
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });

    });
});