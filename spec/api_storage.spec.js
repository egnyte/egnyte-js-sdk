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

describe("Storage API facade integration", function () {

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


    var testpath;
    var testFolderId;
    var testpath2;
    var testpath3;


    describe("Storage methods", function () {


        var recentFileObject;
        var recentNoteId;
        testpath = "/Shared/SDKTests" + "/bacon" + ~~(10000 * Math.random());
        testpath2 = "/Shared/SDKTests" + "/unicorn" + ~~(10000 * Math.random());
        testpath3 = "/Shared/SDKTests" + "/candy" + ~~(10000 * Math.random());

        it("Should claim that root exists", function (done) {
            eg.API.storage.path("/Shared/SDKTests").exists().then(function (e) {
                expect(e).toBe(true);
                done();
            }, function () {
                return eg.API.storage.path("/Shared/SDKTests").createFolder();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });
        it("Should claim that jiberish doesn't exists", function (done) {
            eg.API.storage.path("/jiberish").exists().then(function (e) {
                expect(e).toBe(false);
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("Can create a folder", function (done) {
            eg.API.storage.path(testpath).createFolder()
                .then(function (e) {
                    expect(e.path).toEqual(testpath);
                })
                .then(function () {
                    return eg.API.storage.path(testpath).exists();
                })
                .then(function (e) {
                    expect(e).toBe(true);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });
        it("Can list a folder", function (done) {
            eg.API.storage.path(testpath).get()
                .then(function (e) {
                    expect(e.path).toEqual(testpath);
                    expect(e.is_folder).toBeTruthy();
                    expect(e.folder_id).toBeTruthy();
                    testFolderId = e.folder_id;
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Can list folder ancestors", function (done) {
            //undocumented, will bo official in v3
            eg.API.storage.folderId(testFolderId).parents()
                .then(function (e) {
                    expect(e.self).toBeTruthy()
                    expect(e.self.folder_id).toEqual(testFolderId)
                    expect(e.parents).toBeTruthy()
                    expect(e.parents[0].path).toEqual("/")
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Forbids creating folder in root", function (done) {
            eg.API.storage.path("/foo").createFolder()
                .then(function (e) {
                    expect(this).toAutoFail("was created");
                })
                .fail(function (e) {
                    expect(e.response.statusCode).toEqual(409);
                    done();
                });

        });
        if (!ImInBrowser) {
            it("Gets a 596 on weird mess in paths", function (done) {
                eg.API.storage.path(" foo").exists()
                    .then(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    })
                    .fail(function (e) {
                        expect(e.response.statusCode).toEqual(596);
                        done();
                    });

            });
        }
        it("Can move a folder", function (done) {
            eg.API.storage.path(testpath).move(testpath2)
                .then(function (e) {
                    expect(e.oldPath).toEqual(testpath);
                    expect(e.path).toEqual(testpath2);
                })
                .then(function () {
                    return eg.API.storage.path(testpath).exists();
                })
                .then(function (e) {
                    expect(e).toBe(false);

                    eg.API.storage.path(testpath2).exists()
                        .then(function (e) {
                            expect(e).toBe(true);
                            done();
                        });
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Can remove a folder", function (done) {
            eg.API.storage.path(testpath2).remove()
                .then(function () {
                    return eg.API.storage.path(testpath2).exists();
                })
                .then(function (e) {
                    expect(e).toBe(false);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Can store a file", function (done) {
            var blob = getTestBlob("hey!");

            var fileID;

            egnyteDelay(eg, null, 1000)
                .then(function () {
                    return eg.API.storage.path(testpath).storeFile(blob)
                })
                .then(function (e) {
                    fileID = e.id;
                    expect(e.id).toBeTruthy();
                    expect(e.path).toEqual(testpath);
                })
                .then(function () {
                    return eg.API.storage.path(testpath).get();
                })
                .then(function (e) {
                    expect(e["entry_id"]).toEqual(fileID);
                    expect(e["is_folder"]).toBeFalsy();
                    expect(+e["size"]).toBeGreaterThan(0);

                    recentFileObject = e;
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Can download a file and use content", function (done) {
            eg.API.storage.path(testpath).download(null, false /*non binary*/ ).then(function (xhr) {
                expect(xhr.body).toMatch(/^<a id="a"><b id="b">/);
                done();
            });
        });

        if (!ImInBrowser) {
            it("Can get a file stream", function (done) {
                eg.API.storage.path(testpath).getFileStream()
                    .then(function (readable) {

                        expect(readable.pipe).toBeDefined();
                        expect(readable.on).toBeDefined();

                        var writeSink = concat(function (data) {
                            expect(data).toMatch(/^<a id="a"><b id="b">/);
                            done();
                        });
                        readable.pipe(writeSink);
                        readable.resume();

                    });

            });
        }


        it("Can store another version of a file", function (done) {
            var blob = getTestBlob("hey again!");

            eg.API.storage.path(testpath).storeFile(blob)
                .then(function (e) {
                    expect(e.id).toBeTruthy();
                    expect(e.group_id).toEqual(recentFileObject.group_id);
                    expect(e.path).toEqual(testpath);
                })
                .then(function () {
                    return eg.API.storage.path(testpath).get();
                })
                .then(function (e) {
                    expect(e["entry_id"]).not.toEqual(recentFileObject["entry_id"]);
                    expect(e["versions"]).toBeTruthy();

                    recentFileObject = e;
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Can delete a version of a file", function (done) {

            eg.API.storage.path(testpath).removeFileVersion(recentFileObject.versions[0]["entry_id"])
                .then(function () {
                    return eg.API.storage.path(testpath).get();
                })
                .then(function (e) {
                    expect(e["versions"]).not.toBeDefined();

                    recentFileObject = e;
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        xdescribe("locks", function () { // TODO remove skipping this tests after replacing testrunner
            var token;

            it("Can lock a file", function (done) {
                eg.API.storage.path(testpath).lock(null, 1800)
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


            it("Can't unlock a file with an incorrect token", function (done) {
                eg.API.storage.path(testpath).unlock("foo")
                    .then(function (result) {
                        //just getting here is ok.
                        expect(this).toAutoFail("unlocked");
                        done();
                    }).fail(function (e) {
                        expect(e.response.statusCode).toEqual(404);
                        expect(e.response.body.errorMessage).toBeTruthy();
                        done();
                    });

            });


            it("Can unlock a file", function (done) {
                eg.API.storage.path(testpath).unlock()
                    .then(function (result) {
                        //just getting here is ok.
                        expect(result).toBeDefined();
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("Can lock a file - the other function signature", function (done) {
                eg.API.storage.path(testpath).lock({
                    lock_token: "1234567890",
                    lock_timeout: 1800
                })
                    .then(function (result) {
                        token = result.lock_token;
                        expect(result.lock_token).toEqual("1234567890");
                        expect(result.timeout).toBeTruthy();
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("Can unlock a file again", function (done) {
                eg.API.storage.path(testpath).unlock()
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

        it("Can remove a stored file", function (done) {
            eg.API.storage.path(testpath).remove()
                .then(function () {
                    return eg.API.storage.path(testpath).exists();
                })
                .then(function (e) {
                    expect(e).toBe(false);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

    });


});
