(function () {

    var helpers = require("../reusables/helpers");
    var dom = require("../reusables/dom");
    var View = require("../filepicker_elements/view");
    var Model = require("../filepicker_elements/model");

    function noGoog(ext, mime) {
        return mime !== "goog";
    }

    function init(API) {
        var filePicker;

        filePicker = function (node, setup) {
            if (!setup) {
                throw new Error("Setup required as a second argument");
            }
            var close, fpView, fpModel,
                defaults = {
                    folder: true,
                    file: true,
                    multiple: true
                };
            var selectOpts = helpers.extend(defaults, setup.select);

            close = function () {
                fpView.destroy();
                fpView = null;
                fpModel = null;
            };

            fpModel = new Model(API, {
                select: selectOpts,
                filterExtensions: (typeof setup.filterExtensions === "undefined") ? noGoog : setup.filterExtensions
            });

            fpView = new View({
                el: node,
                model: fpModel,
                barAlign: setup.barAlign,
                handlers: {
                    ready: setup.ready,
                    selection: function (items) {
                        close();
                        setup.selection && setup.selection(items);
                    },
                    close: function (e) {
                        close();
                        setup.cancel && setup.cancel(e);
                    },
                    error: setup.error
                },
                keys: setup.keys
            }, setup.texts);

            fpModel.fetch(setup.path || "/");

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();