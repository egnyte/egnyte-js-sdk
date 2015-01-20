var promises = require("q");
var helpers = require('./reusables/helpers');
var dom = require('./reusables/dom');
var messages = require('./reusables/messages');
var decorators = require("./api_elements/decorators");
var ENDPOINTS = require("./enum/endpoints");

var plugins = {};
module.exports = {
    define: function (name, pluginClosure) {
        if (plugins[name]) {
            throw new Error("Plugin conflict. " + name + " already exists");
        } else {
            plugins[name] = pluginClosure;
        }
    },
    install: function (root) {
        helpers.each(plugins, function (pluginClosure, name) {
            pluginClosure(root, {
                API: root.API,
                ENDPOINTS: ENDPOINTS,
                promises: promises,
                decorators: decorators,
                reusables: {
                    helpers: helpers,
                    dom: dom,
                    messages: messages
                }
            });
        });
    }
};