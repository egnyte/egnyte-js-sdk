var helpers = require("../reusables/helpers");

var defaultDecorators = {

    "impersonate": function (opts, data) {
        if (!opts.headers) {
            opts.headers = {}
        }
        if (data.username) {
            opts.headers["X-Egnyte-Act-As"] = data.username;
        }
        if (data.email) {
            opts.headers["X-Egnyte-Act-As-Email"] = data.email;
        }
        return opts;
    },
    "customizeRequest": function (opts, transformation) {
        return transformation(opts);
    }

}



function getDecorator() {
    var self = this;
    return function (opts) {
        helpers.each(self._decorators, function (decor, name) {
            if (self._decorations[name] !== undefined) {
                opts = decor(opts, self._decorations[name]);
            }
        });
        return opts;
    }
}

module.exports = {
    install: function (self) {

        function exposeDecorators(that) {
            helpers.each(that._decorators, function (decor, name) {
                that[name] = function (data) {
                    var Decorated = function () {};
                    Decorated.prototype = this;
                    var instance = new Decorated();
                    instance.getDecorator = getDecorator;
                    instance._decorations = helpers.extend({}, this._decorations)
                    instance._decorations[name] = data || null;
                    exposeDecorators(instance);
                    return instance;
                }
            });
        }

        self._decorators = helpers.extend({}, defaultDecorators);
        exposeDecorators(self);

        self.addDecorator = function (name, action) {
            this._decorators[name] = action;
            exposeDecorators(this);
        };
        self.getDecorator = function () {
            return helpers.id;
        }



    }
}
