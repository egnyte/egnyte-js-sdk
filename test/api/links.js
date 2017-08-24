    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    // TODO: rewrite all assertions to shouldjs or to chai.expect
    //   both have syntax different from the expect in jasmine unfortunately.
    // var expect = require('chai').expect

    // TODO: rewrite test cases to return promises to mocha
    // TODO: consider introducing nicer test configurataion loading

    // DON'T try to fix the logic and cross-dependency of tests for now
    // DON'T introduce assertions library yet

    process.setMaxListeners(0);

describe("Link API facade integration", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        QPS: 2
    });



    function getTestBlob(txt) {
        var content = '<a id="a"><b id="b">' + txt + '</b></a>'; // the body of the new file...
            var s = new stream.Readable();
            s.push(content);
            s.push(null);
            return s;
    }

        if (!egnyteDomain || !APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }

    this.timeout = 20000  //QA API can be laggy

    it('should accept an existing token', function () {
        //token was passed in beforeEach
        expect(eg.API.auth.isAuthorized()).toBe(true);
    });

    var testpath;

    describe("Link methods", function () {
        var recentFile;
        var recentLink;

        it("Needs a file to link to", function (done) {
            eg.API.storage.get({path:"/Private"})
                .then(function (e) {
                    expect(e["folders"]).toBeDefined();
                    //this test suite has unicorns and bacon, it can't get any better/
                    testpath = e.folders[0].path + "/bacon" + ~~(10000 * Math.random());
                    var blob = getTestBlob("hey!");
                    return eg.API.storage.storeFile({path:testpath, file:blob})
                })
                .then(function (e) {
                    console.log(e)
                    recentFile = e;
                    recentFile.path = testpath
                    done();
                }).catch(function (e) {
                    console.log(e.stack)
                    expect(this).toAutoFail(e);
                    done();
                });
        });


        it("Can create a link to file", function (done) {

            eg.API.link.createLink({
                path: recentFile.path,
                linkSetup:{
                    type: "file",
                    accessibility: "password",
                    expiry_clicks: 2
                }
            }).then(function (e) {
                console.log(e)
                expect(e["path"]).toEqual(recentFile.path);
                expect(e["type"]).toEqual("file");
                expect(e.links[0].id).toBeTruthy();
                expect(e.links[0].url).toMatch(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i);
                expect(e["password"]).toBeTruthy();
                recentLink = e;
            }).then(function () {
                return eg.API.link.listLink({id:recentLink.links[0].id});
            }).then(function (e) {
                expect(e["path"]).toEqual(recentFile.path); //actually checking if it exists
                done();
            }).catch(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("Can list links and filter the list", function (done) {

            eg.API.link.listLinks({
                filters:{
                    path: recentFile.path
                }
            }).then(function (e) {
                expect(e.ids.filter(function (id) {
                    return (id === recentLink.links[0].id);
                }).length).toEqual(1);

                var other = e.ids.filter(function (id) {
                    return (id !== recentLink.links[0].id);
                });
                if (other.length) {
                    eg.API.link.listLink({id:other[0]}).then(function (e) {
                        expect(e["path"]).toEqual(recentFile.path); //actually checking if it exists
                        done();
                    }).catch(function (e) {
                        throw new Error("Link from the list doesn't seem to exist at all");
                    });
                } else {
                    done();
                }
            }).catch(function (e) {
                console.log(e.stack)
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("Can find one link matching filter", function (done) {

            eg.API.link.findOne({
                filters:{
                    path: recentFile.path
                }
            }).then(function (e) {
                expect(e["path"]).toEqual(recentFile.path);
                done();
            }).catch(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("Can destroy a link to file", function (done) {

            eg.API.link.removeLink({id:recentLink.links[0].id}).then(function (e) {
                expect(e).toEqual(200);
            }).then(function () {
                return eg.API.link.listLink({id:recentLink.links[0].id});
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
            eg.API.storage.remove({path:testpath})
                .then(function () {
                    expect(true).toBeTruthy();
                    done();
                }).catch(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });

    });
});
