(function () {

    var helpers = require('../reusables/helpers');
    var dom = require('../reusables/dom');
    var shaven = require('shaven');

    var defaults = {
    };


    function init(options) {
        var filePicker;
        options = helpers.extend(defaults, options);

        filePicker = function (node, callback, cancelCallback) {
           
            var close = function () {
            };
            

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();