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

describe("Events API facade", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 2
    });

    function getFileContent(content) {
        if (ImInBrowser) {
            return content;
        } else {
            var s = new stream.Readable();
            s.push(content);
            s.push(null);
            return s;
        }
    }


    if (!egnyteDomain || !APIToken) {
        throw new Error("spec/conf/apiaccess.js is missing");
    }


    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });

    var testpath = "/Shared/SDKTests/t" + ~~(Math.random() * 99999);

    describe("Events fetcher", function () {

        var scheduler;


        afterEach(function () {
            if (scheduler) {
                scheduler.stop();
            }
        })

        it("Needs a folder to work with", function (done) {
            eg.API.storage.path(testpath).exists().then(function (exists) {
                if (exists) {
                    return eg.API.storage.path(testpath).remove()
                }
            }).then(function () {
                return eg.API.storage.path(testpath).createFolder()
                    .then(function (e) {
                        if (typeof OtherUsername !== "undefined") {
                            return eg.API.perms.users([OtherUsername]).path(testpath).allowFullAccess()
                        }
                    }).then(function () {
                        done();
                    });
            }).fail(function (e) {
                console.error(e.stack);
            });
        });


        //Following tests are sponsored by sour candy producers.


        it("Should get events", function (done) {
            var filePath = testpath + "/candy.txt";
            var events = 0;

            eg.API.events.filter({
                folder: testpath
            }).listen({
                //start: purposefully not provided
                interval: 2000,
                emit: function (e) {
                    events++;
                },
                current: function (a) {
                    //should get an event id
                    expect(a).toBeGreaterThan(0);
                }
            }).then(function (sch) {
                scheduler = sch;
                return egnyteDelay(eg, null, 1000)
                    .then(function (e) {
                        return eg.API.storage.path(filePath).storeFile(getFileContent("sour"))
                    })
                    .then(function (e) {
                        //give it time to get the events
                        setTimeout(function () {
                            scheduler.stop();
                            expect(events).toBeGreaterThan(0);
                            done();
                        }, 5000)

                    });
            }).fail(function (e) {
                console.error(e.stack);
            });



        });

        it("Should shutdown properly", function (done) {
            var filePath = testpath + "/candy.txt";
            eg.API.events.notMy().filter({
                folder: testpath
            }).listen({
                //start: purposefully not provided
                interval: 2000,
                emit: function () {
                    //an event came in
                    //we didn't expect an event
                    expect(this).toAutoFail('An unwanted event came in');
                },
                current: function (a) {
                    //should get an event id
                    expect(a).toBeGreaterThan(0);
                }
            }).then(function (sch) {
                scheduler = sch;
                scheduler.stop();

                return egnyteDelay(eg, null, 1000)
                    .then(function () {
                        return eg.API.storage.path(filePath).storeFile(getFileContent("sour"))
                    })
                    .then(function (e) {
                        //give it time to get the events it shouldn't get
                        setTimeout(function () {
                            done();
                        }, 5000)

                    });
            }).fail(function (e) {
                console.error(e.stack);
            });

        });


        it("Should not get app's own file events", function (done) {
            var filePath = testpath + "/candy.txt";

            eg.API.events.getCursor().then(function (latestId) {
                return egnyteDelay(eg, null, 1000)
                    .then(function () {
                        return eg.API.storage.path(filePath).storeFile(getFileContent("sour"))
                    })
                    .then(function () {
                        return eg.API.events.notMy().filter({
                            folder: testpath
                        }).getUpdate({
                            start: latestId,
                            emit: function (e) {
                                expect(e.data.target_path).not.toEqual(filePath);
                            }
                        }).then(function (resp) {
                            expect(resp.body).toBeDefined();
                            if (resp.body && resp.body.events) {
                                for (var i = 0; i < resp.body.events.length; i++) {
                                    expect(resp.body.events[i].data.target_path).not.toEqual(filePath);
                                }
                            }
                            done();
                        });

                    });
            }).fail(function (e) {
                console.error(e.stack);
            });

        });

        it("Should not get app's own file copy events", function (done) {
            var filePath = testpath + "/candy.txt";
            var filePath2 = testpath + "/stick.txt";
            
            egnyteDelay(eg, null, 1000)
                .then(function () {
                    return eg.API.storage.path(filePath).storeFile(getFileContent("sour"))
                })
                .then(function (e) {
                    return eg.API.events.notMy().filter({
                        folder: testpath
                    }).listen({
                        //start: purposefully not provided
                        interval: 2000,
                        emit: function (e) {
                            expect(e.data.source_path).not.toEqual(filePath);
                        }
                    })
                }).then(function (sch) {
                    scheduler = sch;
                    return eg.API.storage.path(filePath).copy(filePath2)
                        .then(function (e) {
                            //give it time to get the events
                            setTimeout(function () {
                                scheduler.stop();
                                done();
                            }, 5000)

                        });
                }).fail(function (e) {
                    console.error(e.stack);
                });

        });

        it("Should not get app's own folder events", function (done) {
            var folderPath = testpath + "/sourcandy";

            eg.API.events.notMy().filter({
                folder: testpath
            }).listen({
                //start: purposefully not provided
                interval: 2000,
                emit: function (e) {
                    expect(e.data.target_path).not.toEqual(folderPath);
                }
            }).then(function (sch) {
                scheduler = sch;
                return eg.API.storage.path(folderPath).createFolder()
                    .then(function (e) {
                        //give it time to get the events
                        setTimeout(function () {
                            scheduler.stop();
                            done();
                        }, 5000)

                    });
            }).fail(function (e) {
                console.error(e.stack);
            });

        });

        it("Should not get app's own note events", function (done) {
            var filePath = testpath + "/candy.txt";
            var noteId;

            eg.API.events.notMy().filter({
                folder: testpath
            }).listen({
                //start: purposefully not provided
                interval: 2000,
                emit: function (e) {
                    expect(e.data.note_id).not.toEqual(noteId);
                }
            }).then(function (sch) {
                scheduler = sch;
                return eg.API.notes.path(filePath).addNote("oh, that one is sour")
                    .then(function (e) {
                        noteId = e.id;
                        //give it time to get the events
                        setTimeout(function () {
                            scheduler.stop();
                            done();
                        }, 5000)

                    });
            }).fail(function (e) {
                console.error(e.stack);
            });

        });

        if (typeof OtherUsername !== "undefined") {

            it("Should not get user's own events", function (done) {
                var filePath = testpath + "/candy1.txt";
                var otherFilePath = testpath + "/candy2.txt";
                var otherPathFound = false;

                var filteredEventsSource = eg.API.events.notMy('user').filter({
                    folder: testpath
                });

                filteredEventsSource.getCursor().then(function (startEventId) {
                    return egnyteDelay(eg, null, 1000)
                        .then(function () {
                            return eg.API.storage.path(filePath).storeFile(getFileContent("sour"))
                        })
                        .then(function (e) {
                            return egnyteDelay(eg, e, 1000)
                                .then(function () {
                                    return eg.API.storage.impersonate({
                                        username: OtherUsername
                                    }).path(otherFilePath).storeFile(getFileContent("sour as ...much as possible"));
                                })
                        })
                        .then(function (e) {
                            return filteredEventsSource.listen({
                                start: startEventId,
                                count: 10,
                                interval: 2000, //can't be less
                                emit: function (e) {
                                    expect(e.data.target_path).not.toEqual(filePath);
                                    if (e.data.target_path === otherFilePath) {
                                        otherPathFound = true;
                                    }
                                },
                                current: function (a) {
                                    //should get an event id
                                    expect(a).toBeGreaterThan(0);
                                }
                            })
                        }).then(function (sch) {
                            scheduler = sch;
                            //give it time to get the events
                            setTimeout(function () {
                                scheduler.stop();
                                expect(otherPathFound).toBeTruthy();
                                done();
                            }, 5000)
                        })

                }).fail(function (e) {
                    console.error(e.stack);
                });

            });

        }

        it("Needs to clean up after itself", function (done) {
            eg.API.storage.path(testpath).exists().then(function (exists) {
                if (exists) {
                    return eg.API.storage.path(testpath).remove()
                }
            }).then(function () {
                done();
            }).fail(function (e) {
                console.error(e.stack);
                done()
            });
        })



    });
});
