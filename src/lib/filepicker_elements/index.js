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
        var close, openPath, fpView, fpModel,
            defaults = {
                folder: true,
                file: true,
                multiple: true,
                forbidden: []
            };
        var selectOpts = helpers.extend(defaults, setup.select);

        close = function () {
            fpView.destroy();
            fpView = null;
            fpModel = null;
        };

        openPath = function (path) {
            fpModel.fetch(path || "/");
        }

        fpModel = new Model(API, {
            select: selectOpts,
            filterExtensions: (typeof setup.filterExtensions === "undefined") ? noGoog : setup.filterExtensions,
            handlers: {
                navigation: function (currentFolder) {
                    setup.navigation && setup.navigation(currentFolder);
                }
            }
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

        openPath(setup.path || "/");

        return {
            getCurrentFolder: function() {
              return {
                  path: fpModel.path,
                  folder_id: fpModel.itemSelf.folder_id,
                  forbidSelection: fpModel.forbidSelection
              };
            },
            openPath: openPath,
            close: close,
        };
    };

    return filePicker;

}

module.exports = init;