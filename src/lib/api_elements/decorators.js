var helpers = require('../reusables/helpers');

var defaultDecorators = {

    "impersonate": function (opts, data) {
        if (!opts.headers) {
            opts.headers = {}
        }
        opts.headers["X-Egnyte-Act-As"] = data;
        return opts;
    }

}

module.exports = {
    install: function (self) {

        function exposeDecorators() {
            helpers.each(self._decorators, function (decor, name) {
                self[name] = function (data) {
                    self._decorations[name] = data;
                    return self;
                }
            });
        }

        self._decorations = {};
        self._decorators = helpers.extend({}, defaultDecorators);
        exposeDecorators();

        self.addDecorator = function (name, action) {
            self._decorators[name] = action;
            exposeDecorators();
        };
        self.getDecorator = function () {
            var decorations = self._decorations;
            self._decorations = {};
            return function (opts) {
                helpers.each(self._decorators, function (decor, name) {
                    if (decorations[name] !== undefined) {
                        opts = decor(opts, decorations[name]);
                    }
                });
                return opts;
            }
        }



    }
}