var ImInBrowser = (typeof window !== "undefined");
if (ImInBrowser) {
    describe("API Filepicker", function () {

        var eg;
        var node;

        if (!window.egnyteDomain || !window.APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }

        beforeEach(function () {
            jasmine.getEnv().defaultTimeoutInterval = 5000; //QA API can be laggy
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

            eg = Egnyte.init(egnyteDomain, {
                token: APIToken,
                oldIEForwarder: true //opt in for IE8/9 support
            });

            node = document.createElement('div');
            document.body.appendChild(node);

        });

        afterEach(function () {
            document.body.removeChild(node);
        });

        it('should initialize a view', function (done) {

            var picker = eg.filePicker(node, {
                ready: function () {
                    expect(node.querySelectorAll(".eg-picker").length).toEqual(1);
                    expect(node.querySelectorAll(".eg-picker ul li").length).toBeGreaterThan(1);
                    picker.close();
                    expect(node.querySelectorAll(".eg-picker").length).toEqual(0);
                    done();
                }
            });


        });

        it('should accept text replacements', function (done) {
            var text = "Set my hair on fire";

            var picker = eg.filePicker(node, {
                ready: function () {
                    expect(node.querySelectorAll(".eg-picker-ok")[0].innerHTML.trim()).toEqual(text);
                    expect(node.querySelectorAll(".eg-picker-close")[0].innerHTML.trim()).toEqual("Cancel");

                    picker.close();

                    done();
                },
                texts: {
                    "ok": text
                }
            });


        });

        it('should handle cancel on manual close', function (done) {

            var picker = eg.filePicker(node, {
                cancel: function () {
                    expect(node.querySelectorAll(".eg-picker").length).toEqual(0);
                    done();

                },
                ready: function () {
                    var close = node.querySelectorAll(".eg-picker-close")[0];
                    expect(close).toBeTruthy();
                    close.click();
                }
            });
        });

        it('should return current folder data on getCurrentFolder', function (done) {

            var picker = eg.filePicker(node, {
                ready: function () {
                    expect(picker.getCurrentFolder()).toEqual(jasmine.objectContaining({
                        path: "/",
                        forbidSelection: false
                    }));
                    done();
                }
            });
        });

        it('should handle selection', function (done) {

            var picker = eg.filePicker(node, {
                selection: function (elements) {
                    expect(elements.length).toEqual(2);
                    done();
                },
                ready: function () {
                    var list = node.querySelectorAll(".eg-picker ul li");
                    list[0].click();
                    list[1].click();
                    node.querySelectorAll(".eg-picker-ok")[0].click();
                }
            });
        });


        it('should handle single selection', function (done) {

            var picker = eg.filePicker(node, {
                selection: function (elements) {
                    expect(elements.length).toEqual(1);
                    done();
                },
                ready: function () {
                    expect(node.querySelectorAll(".eg-bar input[type=checkbox]").length).toEqual(0);
                    var list = node.querySelectorAll(".eg-picker ul li");
                    list[0].click();
                    list[1].click();
                    node.querySelectorAll(".eg-picker-ok")[0].click();
                },
                select: {
                    multiple: false
                }
            });
        });

        it('should handle select all', function (done) {

            var picker = eg.filePicker(node, {
                selection: function (elements) {
                    expect(elements.length).toBeGreaterThan(1);
                    done();
                },
                ready: function () {
                    node.querySelectorAll(".eg-bar input[type=checkbox]")[0].click();
                    node.querySelectorAll(".eg-picker-ok")[0].click();
                },
                select: {
                    multiple: true
                }
            });
        });

        it('can forbid selection', function (done) {

            var picker = eg.filePicker(node, {
                ready: function () {
                    var list = node.querySelectorAll(".eg-picker ul li");
                    list[0].click();
                    setTimeout(function () {
                        expect(node.querySelectorAll("input:checked").length).toEqual(0);
                        done();
                    }, 0);
                },
                select: {
                    folder: false,
                    file: false,
                    multiple: false
                }
            });
        });

        it('should handle keyboard selection', function (done) {

            var picker = eg.filePicker(node, {
                ready: function () {
                    //pretend some keyboard
                    keyvent.up('down');
                    keyvent.up('space');
                    keyvent.up('down');
                    keyvent.up('space');
                    expect(node.querySelectorAll("input:checked").length).toEqual(2);
                    done();
                }
            });
        });

        it('should allow disabling keyboard selection', function (done) {

            var picker = eg.filePicker(node, {
                keys: false,
                ready: function () {
                    //pretend some keyboard
                    keyvent.up('down');
                    keyvent.up('space');
                    keyvent.up('down');
                    keyvent.up('space');
                    expect(node.querySelectorAll("input:checked").length).toEqual(0);
                    done();
                }
            });
        });


        it('should handle keyboard on focused picker', function (done) {

            var node2 = document.createElement('div');
            document.body.appendChild(node2);

            var picker2;
            var picker = eg.filePicker(node, {
                keys: {
                    "confirm": "<enter>",
                },
                ready: function () {
                    picker2 = eg.filePicker(node2, {
                        keys: {
                            "confirm": "<enter>",
                        },
                        ready: function () {
                            node.click();
                            //pretend some keyboard
                            keyvent.up('down');
                            keyvent.up('space');
                            keyvent.up('enter');
                        },
                        selection: function (elements) {
                            expect(this).toAutoFail("wrong picker");
                        }
                    });
                },
                selection: function (elements) {
                    expect(elements).toBeTruthy();
                    picker2.close();
                    done();
                }
            });
        });


    });

}
