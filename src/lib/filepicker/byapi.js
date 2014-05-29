(function () {

    var helpers = require("../reusables/helpers");
    var dom = require("../reusables/dom");
    var View = require("../filepicker_elements/view");
    var Model = require("../filepicker_elements/model");

    var defaults = {};

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
                select: selectOpts
            });

            fpView = new View({
                el: node,
                model: fpModel,
                barAlign: setup.barAlign,
                handlers: {
                    ready: setup.ready,
                    selection: function (item) {
                        setup.selection(item);
                        close();
                    },
                    close: function () {
                        setup.cancel();
                        close();
                    },
                    error: setup.error
                }
            },setup.texts);

            fpModel.fetch(setup.path || "/");

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();