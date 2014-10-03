var helpers = require('../reusables/helpers');

var decorators = {

    "impersonate": function (opts, data) {
        if (!opts.headers) {
            opts.headers = {}
        }
        opts.headers["X-Egnyte-Act-As"] = data;
        return opts;
    }

}

module.exports = {
    decorate: function (self) {
        self._decorations = {};
        helpers.each(decorators, function (decor, name) {
            self[name] = function (data) {
                self._decorations[name] = data;
                return self;
            }
        });
        self.getDecorator = function () {
            var decorations = self._decorations;
            self._decorations = {};
            return function (opts) {
                helpers.each(decorators, function (decor, name) {
                    opts = decor(opts, decorations[name]);
                });
                return opts;
            }
        }



    }
}