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




    describe("notes", function () {

        var recentNoteId;
        var testpath = "/Shared/SDKTests" + "/bacon" + ~~(10000 * Math.random());


        it("Prepares a file", function (done) {
            egnyteDelay(eg, null, 1000)
                .then(function () {
                    return eg.API.storage.path(testpath).storeFile(getTestBlob("whatever content"))
                })
                .then(function () {
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });


        it("Can add a note to a file", function (done) {
            var words = "Tradition enforces enforcing tradition";
            eg.API.notes.path(testpath).addNote("1 " + words)
                .then(function (result) {
                    recentNoteId = result.id;
                    expect(result.id).toBeTruthy();
                    return eg.API.notes.path(testpath).addNote("2 " + words); //adding another one for funzies
                })
                .then(function () {
                    return eg.API.notes.getNote(recentNoteId);
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
            eg.API.notes.path(testpath).listNotes({
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
            eg.API.notes.removeNote(recentNoteId)
                .then(function (result) {
                    expect(result.response.statusCode).toEqual(200);
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });

        it("cleans up", function (done) {
            eg.API.storage.path(testpath).remove()
                .then(function () {
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });

    });


});