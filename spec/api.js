describe("API to JS (integration test)", function () {

    var eg;

    function getTestBlob(txt) {
        // JavaScript file-like object...
        var content = '<a id="a"><b id="b">' + txt + '</b></a>'; // the body of the new file...
        //PhanthomJS has a broken Blob
        try {
            var blob = new Blob([content], {
                type: "text/xml"
            });
        } catch (e) {
            var builder = new WebKitBlobBuilder();
            builder.append(content);
            var blob = builder.getBlob();
        }
        return blob;
    }


    if (!window.egnyteDomain || !window.APIToken) {
        throw new Error("spec/conf/apiaccess.js is missing");
    }

    beforeEach(function () {
        jasmine.addMatchers({
            toAutoFail: function () {
                return {
                    compare: function (actual, expected) {
                        return {
                            pass: false,
                            message: 'this not to happen. ' + expected
                        };
                    }
                };
            }
        });

        eg = EgnyteWidget.init(egnyteDomain, {
            token: APIToken
        });
    });

    it('should accept an existing token', function () {
        //token was passed in beforeEach
        expect(eg.API.auth.isAuthenticated()).toBe(true);
    });

    describe("Storage", function () {
        //this test suite has unicorns and bacon, it can't get any better/
        var testpath = "/Private/hackathon1/bacon" + ~~(10000 * Math.random());
        var testpath2 = "/Private/hackathon1/unicorn" + ~~(10000 * Math.random());
        var recentFileObject;

        it("Should claim that root exists", function (done) {
            eg.API.storage.exists("/Private").then(function (e) {
                expect(e).toBe(true);
                done();
            }).error(function (e) {
                expect(this).toAutoFail(e);
            });

        });
        it("Should claim that jiberish doesn't exists", function (done) {
            eg.API.storage.exists("/jiberish").then(function (e) {
                expect(e).toBe(false);
                done();
            }).error(function (e) {
                expect(this).toAutoFail(e);
            });

        });
        it("Can create a folder", function (done) {
            eg.API.storage.createFolder(testpath)
                .then(function (e) {
                    expect(e.path).toEqual(testpath);
                })
                .then(function () {
                    return eg.API.storage.exists(testpath);
                })
                .then(function (e) {
                    expect(e).toBe(true);
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });

        });

        it("Can move a folder", function (done) {
            eg.API.storage.move(testpath, testpath2)
                .then(function (e) {
                    expect(e.oldPath).toEqual(testpath);
                    expect(e.path).toEqual(testpath2);
                })
                .then(function () {
                    return eg.API.storage.exists(testpath);
                })
                .then(function (e) {
                    expect(e).toBe(false);

                    setTimeout(function () { //delay to stay in QPS
                        eg.API.storage.exists(testpath2)
                            .then(function (e) {
                                expect(e).toBe(true);
                                setTimeout(done, 400); //delay to stay in QPS
                            });
                    }, 400);
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });

        });
        it("Can remove a folder", function (done) {
            eg.API.storage.remove(testpath2)
                .then(function () {
                    return eg.API.storage.exists(testpath2);
                })
                .then(function (e) {
                    expect(e).toBe(false);
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });

        });

        it("Can store a file", function (done) {
            var blob = getTestBlob("hey!");

            var fileID;

            eg.API.storage.storeFile(testpath, blob)
                .then(function (e) {
                    fileID = e.id;
                    expect(e.id).toBeTruthy();
                    expect(e.path).toEqual(testpath);
                })
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["entry_id"]).toEqual(fileID);
                    expect(e["is_folder"]).toBeFalsy();
                    expect(e["size"] > 0).toBeTruthy();

                    recentFileObject = e;
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });

        });

        it("Can store another version of a file", function (done) {
            var blob = getTestBlob("hey again!");

            eg.API.storage.storeFile(testpath, blob)
                .then(function (e) {
                    expect(e.id).toBeTruthy();
                    expect(e.path).toEqual(testpath);
                })
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["entry_id"]).not.toEqual(recentFileObject["entry_id"]);
                    expect(e["versions"]).toBeTruthy();

                    recentFileObject = e;
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });

        });

        it("Can delete a version of a file", function (done) {

            eg.API.storage.removeFileVersion(testpath, recentFileObject.versions[0]["entry_id"])
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["versions"]).not.toBeDefined();

                    recentFileObject = e;
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });

        });

        it("Can remove a stored file", function (done) {
            eg.API.storage.remove(testpath)
                .then(function () {
                    return eg.API.storage.exists(testpath);
                })
                .then(function (e) {
                    expect(e).toBe(false);
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });

        });

    });

    describe("Link", function () {
        var testpath = "/Private/hackathon1/cow_and_chicken" + ~~(10000 * Math.random());
        var recentFile;
        var recentLink;

        it("Needs a file to link to", function (done) {
            var blob = getTestBlob("hey!");

            eg.API.storage.storeFile(testpath, blob)
                .then(function (e) {
                    recentFile = e;
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
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
                setTimeout(done, 400); //delay to stay in QPS
            }).error(function (e) {
                expect(this).toAutoFail(e);
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
                        setTimeout(done, 400); //delay to stay in QPS
                    });
                } else {
                    setTimeout(done, 400); //delay to stay in QPS
                }
            }).error(function (e) {
                expect(this).toAutoFail(e);
            });

        });

        it("Can destroy a link to file", function (done) {

            eg.API.link.removeLink(recentLink.links[0].id).then(function (e) {
                expect(e).toBeUndefined();
            }).then(function () {
                return eg.API.link.listLink(recentLink.links[0].id);
            }).then(function () {
                //Should not succeed
                expect(this).toAutoFail("Link still exists");
            }, function (e) {
                //I expect a 404 instead
                expect(e).toEqual(404);
                setTimeout(done, 400); //delay to stay in QPS
            });

        });


        it("Needs to clean up the file", function (done) {
            eg.API.storage.remove(testpath)
                .then(function (e) {
                    setTimeout(done, 400); //delay to stay in QPS
                }).error(function (e) {
                    expect(this).toAutoFail(e);
                });
        });

    });
});