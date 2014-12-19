var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("Link API facade integration", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 2
    });




    if (!egnyteDomain || !APIToken) {
        throw new Error("spec/conf/apiaccess.js is missing");
    }


    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });

    var testpath = "/Shared/SDKTests";

    describe("Events fetcher", function () {

        var scheduler;

        afterEach(function () {
            if (scheduler) {
                scheduler.stop();
            }
        })

        it("Needs a folder to work with", function (done) {
            eg.API.storage.exists(testpath).then(function (exists) {
                if (exists) {
                    return eg.API.storage.remove(testpath)
                }
            }).then(function () {
                return eg.API.storage.createFolder(testpath)
                    .then(function (e) {
                        if (OtherUsername) {
                            return eg.API.perms.users([OtherUsername]).allowFullAccess()
                        }
                    }).then(function() {
                        done();
                    });
            });
        });

        
        //Following tests are sponsored by sour candy producers.
        
        
        it("Should get events", function (done) {
            var filePath = testpath + "/candy.txt";
            var events = 0;

            eg.API.events.notMy().filter({
                folder: testpath
            }).listen({
                //start: purposefully not provided
                interval: 2000,
                emit: function () {
                    events++;
                },
                current: function (a) {
                    //should get an event id
                    expect(a).toBeGreaterThan(0);
                }
            }).then(function (sch) {
                scheduler = sch;
                return eg.API.storage.storeFile(filePath, "sour")
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
                return eg.API.storage.storeFile(filePath, "sour")
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


        it("Should not get app's own events", function (done) {
            var filePath = testpath + "/candy.txt";

            eg.API.events.notMy().filter({
                folder: testpath
            }).listen({
                //start: purposefully not provided
                interval: 2000,
                emit: function (e) {
                    expect(e.data.target_path).not.toEqual(filePath);
                }
            }).then(function (sch) {
                scheduler = sch;
                return eg.API.storage.storeFile(filePath, "sour")
                    .then(function (e) {
                        expect(e.id).toBeTruthy();
                        expect(e.path).toEqual(filePath);

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

                eg.API.events.notMy('user').filter({
                    folder: testpath
                }).listen({
                    //start: purposefully not provided
                    count: 10,
                    interval: 2000,
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
                }).then(function (sch) {
                    scheduler = sch;
                    return eg.API.storage.storeFile(filePath, "sour")
                        .then(function (e) {
                            expect(e.id).toBeTruthy();
                            expect(e.path).toEqual(filePath);


                            return eg.API.storage.impersonate({
                                username: OtherUsername
                            }).storeFile(otherFilePath, "sour as ...much as possible");
                        })
                        .then(function (e) {
                            expect(e.id).toBeTruthy();
                            expect(e.path).toEqual(filePath);

                            //give it time to get the events
                            setTimeout(function () {
                                scheduler.stop();
                                expect(otherPathFound).toBeFalsy();
                                done();
                            }, 5000)

                        });

                }).fail(function (e) {
                    console.error(e.stack);
                });

            });

        }



    });
});