var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

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
    var testpath2;
    var testpath3;


    describe("Storage methods", function () {


        var recentFileObject;
        var recentNoteId;
        testpath = "/Shared/SDKTests" + "/bacon" + ~~(10000 * Math.random());
        testpath2 = "/Shared/SDKTests" + "/unicorn" + ~~(10000 * Math.random());
        testpath3 = "/Shared/SDKTests" + "/candy" + ~~(10000 * Math.random());

        it("Should claim that root exists", function (done) {
            eg.API.storage.exists("/Shared/SDKTests").then(function (e) {
                expect(e).toBe(true);
                done();
            }, function () {
                return eg.API.storage.createFolder("/Shared/SDKTests");
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });
        it("Should claim that jiberish doesn't exists", function (done) {
            eg.API.storage.exists("/jiberish").then(function (e) {
                expect(e).toBe(false);
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
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
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Forbids creating folder in root", function (done) {
            eg.API.storage.createFolder("/foo")
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
                eg.API.storage.exists(" foo")
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

                    eg.API.storage.exists(testpath2)
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
            eg.API.storage.remove(testpath2)
                .then(function () {
                    return eg.API.storage.exists(testpath2);
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
                    expect(+e["size"]).toBeGreaterThan(0);

                    recentFileObject = e;
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("Can download a file and use content", function (done) {
            eg.API.storage.download(testpath, null, false /*non binary*/ ).then(function (xhr) {
                expect(xhr.body).toMatch(/^<a id="a"><b id="b">/);
                done();
            });
        });

        if (!ImInBrowser) {
            it("Can get a file stream", function (done) {
                eg.API.storage.getFileStream(testpath)
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
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
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
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        describe("locks", function () {
            var token;

            it("Can lock a file", function (done) {
                eg.API.storage.lock(testpath, null, 1800)
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

            it("tmp", function (done) {
                eg.API.storage.impersonate({
                        username: "dude"
                    }).remove(testpath)
                    .then(function (result) {
                        //just getting here is ok.
                        expect(this).toAutoFail("moved");
                        done();
                    }).fail(function (e) {
                        console.log(JSON.stringify(e.response.body))
                        expect(e.response.statusCode).toEqual(423);
                        done();
                    });

            });

            it("Can't unlock a file with an incorrect token", function (done) {
                eg.API.storage.unlock(testpath, "foo")
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
                eg.API.storage.unlock(testpath)
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
        describe("notes", function () {
            it("Can add a note to a file", function (done) {
                var words = "Tradition enforces enforcing tradition";
                eg.API.storage.addNote(testpath, "1 " + words)
                    .then(function (result) {
                        recentNoteId = result.id;
                        expect(result.id).toBeTruthy();
                        return eg.API.storage.addNote(testpath, "2 " + words); //adding another one for funzies
                    })
                    .then(function () {
                        return eg.API.storage.getNote(recentNoteId);
                    })
                    .then(function (noteObj) {
                        expect(noteObj.message).toBe("1 " + words);
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("Can list notes", function (done) {
                eg.API.storage.listNotes(testpath, {
                        count: 1,
                        offset: 1
                    })
                    .then(function (result) {
                        expect(result.notes.length).toBe(1);
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("Can delete the note", function (done) {
                eg.API.storage.removeNote(recentNoteId)
                    .then(function (result) {
                        expect(result.response.statusCode).toEqual(200);
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("Can remove a stored file", function (done) {
                eg.API.storage.remove(testpath)
                    .then(function () {
                        return eg.API.storage.exists(testpath);
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


});