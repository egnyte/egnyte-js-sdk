var authHelper = require("./api_elements/auth");
var storageFacade = require("./api_elements/storage");


module.exports = function (options) {
    var auth = authHelper(options);
    var storage = storageFacade(auth, options);

    return {
        auth: auth,
        storage: storage
    };
};