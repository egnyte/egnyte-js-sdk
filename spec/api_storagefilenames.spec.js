var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("Item names / ", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 1
    });

    it('BTW. The test should have a working matcher for errors', function () {
        //token was passed in beforeEach
        expect(expect(this).toAutoFail).toBeDefined();
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

    var goodTestNames = [
        "sdfghjwertasdfgwerftasfgasdfggsdfgh",
        "&yet",
        "_foo",
        "zażółćGęśląJaźń",
        "Русские Буквы",
        "download(1)",
        "download(1).foo",
        "brs{}",
        "fifty%",
        "z;z",
        "#bang#bang",
        "allAtOnce-. _~!$&'(),;=@^][`+#"
    ];

    var badFolders = [
        "wind\\s",
        " space ",
        "notAllowed:|*?",
        "fish><>",
        "quote\"quote"
    ];

    var badFiles = [
        "danglingdot.",
        "spam.tmp",
        "Thumbs.db"
    ];

    var basePath;





    describe("Good names:", function () {
        it("BTW. basePath needs to be known at this point", function (done) {
            if (!basePath) {
                eg.API.storage.path("/Private").get().then(function (e) {
                    basePath = e.folders[0].path;
                    expect(basePath).toBeTruthy();
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
            } else {
                done();
            }
        });



        goodTestNames.forEach(function (fname) {

            it("BTW. file leftovers from previous tests need to be destroyed", function (done) {
                expect(fname).toBeDefined();
                eg.API.storage.path(basePath + "/" + fname).remove().then(done, done);
            });



            it("should create a folder called " + fname, function (done) {
                eg.API.storage.path(basePath + "/" + fname).createFolder()
                    .then(function (e) {
                        expect(e.path).toEqual(basePath + "/" + fname);
                        return eg.API.storage.path(e.path).get();
                    })
                    .then(function (e) {
                        expect(e.path).toEqual(basePath + "/" + fname);
                        expect(e.name).toEqual(fname);
                        return eg.API.storage.path(basePath + "/" + fname).remove();
                    })
                    .then(function (e) {
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

            it("should store a file called " + fname, function (done) {
                var blob = getTestBlob("foo");
                eg.API.storage.path(basePath + "/" + fname).storeFile(blob)
                    .then(function (e) {
                        expect(e.path).toEqual(basePath + "/" + fname);
                        return eg.API.storage.path(e.path).get();
                    })
                    .then(function (e) {
                        expect(e.path).toEqual(basePath + "/" + fname);
                        expect(e.name).toEqual(fname);
                        return eg.API.storage.path(basePath + "/" + fname).remove();
                    })
                    .then(function (e) {
                        done();
                    }).fail(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    });

            });

        });

    });

    describe("Bad folder names: ", function () {
        it("BTW. basePath needs to be known at this point", function (done) {
            if (!basePath) {
                eg.API.storage.path("/Private").get().then(function (e) {
                    basePath = e.folders[0].path;
                    expect(basePath).toBeTruthy();
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
            } else {
                done();
            }
        });

        badFolders.forEach(function (fname) {

            it("should NOT create a folder called " + fname, function (done) {
                eg.API.storage.path(basePath + "/" + fname).createFolder()
                    .then(function (e) {
                        return eg.API.storage.path(basePath + "/" + fname).remove();
                    })
                    .then(function (e) {
                        expect(this).toAutoFail(e);
                        done();
                    }).fail(function (e) {
                        expect(true).toBeTruthy();
                        done();
                    });

            });

        });
    });

    describe("Bad file names: ", function () {
        it("BTW. basePath needs to be known at this point", function (done) {
            if (!basePath) {
                eg.API.storage.path("/Private").get().then(function (e) {
                    basePath = e.folders[0].path;
                    expect(basePath).toBeTruthy();
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
            } else {
                done();
            }
        });

        badFiles.forEach(function (fname) {

            it("sould NOT store a file called " + fname, function (done) {
                var blob = getTestBlob("foo");

                eg.API.storage.path(basePath + "/" + fname).storeFile(blob)
                    .then(function (e) {
                        eg.API.storage.path(basePath + "/" + fname).remove();
                        expect(this).toAutoFail(e);
                        done();
                    }).fail(function (e) {
                        expect(true).toBeTruthy();
                        done();
                    });

            });

        });


    });





});
