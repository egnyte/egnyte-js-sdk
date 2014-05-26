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
            token: APIToken
        });

        node = document.createElement('div');
        document.body.appendChild(node);
        
    });

    afterEach(function () {
        document.body.removeChild(node);
    });

    it('should initialize a view', function (done) {
        var callback = function () {};

        var picker = eg.filePicker(node, {
            ready: function () {
                expect(node.querySelectorAll(".eg-filepicker").length).toEqual(1);
                expect(node.querySelectorAll(".eg-filepicker ul li").length).toBeGreaterThan(1);
                picker.close();
                expect(node.querySelectorAll(".eg-filepicker").length).toEqual(0);
                done();
            }
        });


    });

    it('should handle cancel on manual close', function (done) {
        var callback = function () {};

        var picker = eg.filePicker(node, {
            cancel: function () {
                expect(node.querySelectorAll(".eg-filepicker").length).toEqual(1);
                setTimeout(function () {
                    expect(node.querySelectorAll(".eg-filepicker").length).toEqual(0);
                    done();
                }, 1);
                    
            },
            ready: function () {
                var close = node.querySelectorAll(".eg-filepicker-close")[0];
                expect(close).toBeTruthy();
                close.click();
            }
        });
    });


    it('should handle selection', function (done) {
        var callback = function () {};

        var picker = eg.filePicker(node, {
            selection: function (elements) {
                expect(elements.length).toEqual(2);
                done();
            },
            ready: function () {
                var list = node.querySelectorAll(".eg-filepicker ul li");
                list[0].click();
                list[1].click();
                node.querySelectorAll(".eg-filepicker-ok")[0].click();
            }
        });
    });


    it('should handle single selection', function (done) {
        var callback = function () {};

        var picker = eg.filePicker(node, {
            selection: function (elements) {
                expect(elements.length).toEqual(1);
                done();
            },
            ready: function () {
                var list = node.querySelectorAll(".eg-filepicker ul li");
                list[0].click();
                list[1].click();
                node.querySelectorAll(".eg-filepicker-ok")[0].click();
            },
            select: {
                multiple: false
            }
        });
    });
    
    
    it('can forbid selection', function (done) {
        var callback = function () {};

        var picker = eg.filePicker(node, {
            selection: function (elements) {
                expect(elements.length).toEqual(0);
                done();
            },
            ready: function () {
                var list = node.querySelectorAll(".eg-filepicker ul li");
                list[0].click();
                node.querySelectorAll(".eg-filepicker-ok")[0].click();
            },
            select: {
                folder:false,
                file:false,
                multiple: false
            }
        });
    });


});