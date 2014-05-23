(function () {

    var helpers = require("../reusables/helpers");
    var dom = require("../reusables/dom");
    var View = require("../filepicker_elements/view");
    var Model = require("../filepicker_elements/model");

    var defaults = {};

    function init(options, API) {
        var filePicker;
        options = helpers.extend(defaults, options);

        filePicker = function (node, callback, cancelCallback, selectOpts) {
            var close, fpView, fpModel,
                defaults={
                    folder: true,
                    file: true,
                    multiple: true
                };
            selectOpts = helpers.extend(defaults,selectOpts);
            
            close = function () {
                fpView.destroy();
                fpView=null;
                fpModel=null;
            };
            
            fpModel = new Model(API,{
                select: selectOpts
            });

            fpView = new View({
                el: node,
                model: fpModel,
                handlers: {
                    selection: function (item) {
                        callback(item);
                        close();
                    },
                    close: function () {
                        cancelCallback();
                        close();
                    }
                }
            });
            
            fpModel.fetch("/");

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();