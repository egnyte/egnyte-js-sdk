(function () {

    var helpers = require("../reusables/helpers");
    var dom = require("../reusables/dom");
    var View = require("../filepicker_elements/view");

    var defaults = {};

    function controllerFactory(view) {
        return function (path) {
            view.loading();
            eg.API.storage.get(path).then(function (m) {
                if(view.els.list) return;
                view.model = m;
                view.render();
            }).error(function () {
                console.error(arguments);
            });
        }
    }

    function init(options) {
        var filePicker;
        options = helpers.extend(defaults, options);

        filePicker = function (node, callback, cancelCallback) {
            var controller, close, fpView;
            close = function () {
                fpView.destroy();
            };

            fpView = new View({
                el: node,
                model: {},
                handlers: {
                    file: function (item) {
                        callback(item);
                        close();
                    },
                    folder: function (item) {
                        controller(item.path);
                    },
                    back: function () {
                        var path = this.model.path.replace(/\/[^\/]+\/?$/i, "");
                        controller(path);
                    },
                    close: function(){
                        cancelCallback();
                        close();
                    }
                }
            });

            controller = controllerFactory(fpView)

            controller("/Private/hackathon1");

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();