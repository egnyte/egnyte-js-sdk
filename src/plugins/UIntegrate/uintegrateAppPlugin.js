var Egnyte = require("../../egnyte.js");
var core = require("./core.js");

//resources = {
//    API: API,
//    ENDPOINTS: ENDPOINTS,
//    promises: promises,
//    helpers: helpers,
//    decorators: decorators
//}
Egnyte.appInit = function appInit(callback) {


    Egnyte.plugin("uintegrate", function pluginClosure(root, resources) {
        var messages = resources.reusables.messages;
        var dom = resources.reusables.dom;
        var promises = resources.promises;

        return core(promises, dom, messages, callback);

    });

}

module.exports = Egnyte;