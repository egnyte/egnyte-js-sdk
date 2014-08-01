var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var Egnyte = require("../src/slim");

require("../spec/conf/apiaccess");



describe("API to JS (integration test)", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        QPS: 2
    });


    function getTestBlob(txt) {
        // JavaScript file-like object...
        var content = '<a id="a"><b id="b">' + txt + '</b></a>'; // the body of the new file...
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
    }

    if (typeof window !=="undefined") {
        if (!window.egnyteDomain || !window.APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    } else {
        if (!egnyteDomain || !APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    }

    beforeEach(function () {

    });

   
    it('should accept an existing token', function () {
        //token was passed in beforeEach
        expect(eg.API.auth.isAuthorized()).to.be.true;
    });


    describe("Auth", function () {

        var recentFileObject;

        it("Should provide userinfo", function (done) { this.timeout(5000);
            eg.API.auth.getUserInfo().then(function (info) {
                expect(info).to.be.ok;
                expect(info.username).to.exist;
                expect(info.username.length).to.be.above(1);
                done();
            }).fail(function (e) {
                assert(false,e)
                done();
            });

        });

    });


    var testpath;
    var testpath2;
    var testpath3;


    describe("Storage", function () {


        var recentFileObject;

        it("Should claim that root exists", function (done) { this.timeout(5000);
            eg.API.storage.exists("/Private").then(function (e) {
                expect(e).to.be.true;
                done();
            }).fail(function (e) {
                assert(false,e)
                done();
            });

        });
        it("Should claim that jiberish doesn't exists", function (done) { this.timeout(5000);
            eg.API.storage.exists("/jiberish").then(function (e) {
                expect(e).to.be.false;
                done();
            }).fail(function (e) {
                assert(false,e)
                done();
            });

        });
        it("Should be able to fetch a private folder", function (done) { this.timeout(5000);
            eg.API.storage.get("/Private").then(function (e) {
                expect(e["folders"]).to.exist;
                //this test suite has unicorns and bacon, it can't get any better/
                testpath = e.folders[0].path + "/bacon" + ~~(10000 * Math.random());
                testpath2 = e.folders[0].path + "/unicorn" + ~~(10000 * Math.random());
                testpath3 = e.folders[0].path + "/candy" + ~~(10000 * Math.random());
                done();
            }).fail(function (e) {
                assert(false,e)
                done();
            });

        });
        it("Can create a folder", function (done) { this.timeout(5000);
            eg.API.storage.createFolder(testpath)
                .then(function (e) {
                    expect(e.path).to.equal(testpath);
                })
                .then(function () {
                    return eg.API.storage.exists(testpath);
                })
                .then(function (e) {
                    expect(e).to.be.true;
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });

        });

        it("Forbids creating folder in root", function (done) { this.timeout(5000);
            eg.API.storage.createFolder("/foo")
                .then(function (e) {
                    assert(false,"was created");
                    done();
                })
                .fail(function (e) {
                    expect(e.response.statusCode).to.equal(409);
                    done();
                });

        });

        it("Gets a 596 on weird mess in paths", function (done) { this.timeout(5000);
            eg.API.storage.exists(" foo")
                .then(function (e) {
                    assert(false,e)
                    done();
                })
                .fail(function (e) {
                    console.log(e);
                    expect(e.response.statusCode).to.equal(596);
                    done();
                });

        });

        it("Can move a folder", function (done) { this.timeout(5000);
            eg.API.storage.move(testpath, testpath2)
                .then(function (e) {
                    expect(e.oldPath).to.equal(testpath);
                    expect(e.path).to.equal(testpath2);
                })
                .then(function () {
                    return eg.API.storage.exists(testpath);
                })
                .then(function (e) {
                    expect(e).to.be.false;

                    eg.API.storage.exists(testpath2)
                        .then(function (e) {
                            expect(e).to.be.true;
                            done();
                        });
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });

        });

        it("Can remove a folder", function (done) { this.timeout(5000);
            eg.API.storage.remove(testpath2)
                .then(function () {
                    return eg.API.storage.exists(testpath2);
                })
                .then(function (e) {
                    expect(e).to.be.false;
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });

        });

        it("Can store a file", function (done) { this.timeout(5000);
            var blob = getTestBlob("hey!");

            var fileID;

            eg.API.storage.storeFile(testpath, blob)
                .then(function (e) {
                    fileID = e.id;
                    expect(e.id).to.be.ok;
                    expect(e.path).to.equal(testpath);
                })
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["entry_id"]).to.equal(fileID);
                    expect(e["is_folder"]).to.not.be.ok;
                    expect(e["size"] > 0).to.be.ok;

                    recentFileObject = e;
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });

        });

        it("Can download a file and use content", function (done) { this.timeout(5000);
            eg.API.storage.download(testpath, false /*non binary*/ ).then(function (xhr) {

                expect(xhr.body).to.match(/^<a id="a"><b id="b">/);

                done();
            });
        });

        it("Can store another version of a file", function (done) { this.timeout(5000);
            var blob = getTestBlob("hey again!");

            eg.API.storage.storeFile(testpath, blob)
                .then(function (e) {
                    expect(e.id).to.be.ok;
                    expect(e.path).to.equal(testpath);
                })
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["entry_id"]).not.to.equal(recentFileObject["entry_id"]);
                    expect(e["versions"]).to.be.ok;

                    recentFileObject = e;
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });

        });

        it("Can delete a version of a file", function (done) { this.timeout(5000);

            eg.API.storage.removeFileVersion(testpath, recentFileObject.versions[0]["entry_id"])
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["versions"]).not.to.exist;

                    recentFileObject = e;
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });

        });

        it("Can remove a stored file", function (done) { this.timeout(5000);
            eg.API.storage.remove(testpath)
                .then(function () {
                    return eg.API.storage.exists(testpath);
                })
                .then(function (e) {
                    expect(e).to.be.false;
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });

        });

    });

    describe("Link", function () {
        var recentFile;
        var recentLink;

        it("Needs a file to link to", function (done) { this.timeout(5000);
            var blob = getTestBlob("hey!");

            eg.API.storage.storeFile(testpath3, blob)
                .then(function (e) {
                    recentFile = e;
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });
        });


        it("Can create a link to file", function (done) { this.timeout(5000);

            eg.API.link.createLink({
                path: recentFile.path,
                type: "file",
                accessibility: "password"
            }).then(function (e) {
                expect(e["path"]).to.equal(recentFile.path);
                expect(e["type"]).to.equal("file");
                expect(e.links[0].id).to.be.ok;
                expect(e.links[0].url).to.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i);
                expect(e["password"]).to.be.ok;
                recentLink = e;
            }).then(function () {
                return eg.API.link.listLink(recentLink.links[0].id);
            }).then(function (e) {
                expect(e["path"]).to.equal(recentFile.path); //actually checking if it exists
                done();
            }).fail(function (e) {
                assert(false,e)
                done();
            });

        });

        it("Can list links and filter the list", function (done) { this.timeout(5000);

            eg.API.link.listLinks({
                path: recentFile.path
            }).then(function (e) {
                expect(e.ids.filter(function (id) {
                    return (id === recentLink.links[0].id);
                }).length).to.equal(1);

                var other = e.ids.filter(function (id) {
                    return (id !== recentLink.links[0].id);
                });
                if (other.length) {
                    eg.API.link.listLink(other[0]).then(function (e) {
                        expect(e["path"]).to.equal(recentFile.path); //actually checking if it exists
                        done();
                    }).fail(function (e) {
                        throw new Error("Link from the list doesn't seem to exist at all");
                    });
                } else {
                    done();
                }
            }).fail(function (e) {
                assert(false,e)
                done();
            });

        });

        it("Can find one link matching filter", function (done) { this.timeout(5000);

            eg.API.link.findOne({
                path: recentFile.path
            }).then(function (e) {
                expect(e["path"]).to.equal(recentFile.path);
                done();
            }).fail(function (e) {
                assert(false,e)
                done();
            });

        });

        it("Can destroy a link to file", function (done) { this.timeout(5000);

            eg.API.link.removeLink(recentLink.links[0].id).then(function (e) {
                expect(e).to.equal(200);
            }).then(function () {
                return eg.API.link.listLink(recentLink.links[0].id);
            }).then(function () {
                //Should not succeed
                assert(false,"Link still exists");
            }, function (result) {
                //I expect a 404 instead
                expect(result.response.statusCode).to.equal(404);
                done();
            });

        });


        it("Needs to clean up the file", function (done) { this.timeout(5000);
            eg.API.storage.remove(testpath3)
                .then(function (e) {
                    done();
                }).fail(function (e) {
                    assert(false,e)
                    done();
                });
        });

    });
});