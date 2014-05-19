var authHelper = require("./api_elements/auth");
var storageFacade = require("./api_elements/storage");
var linkFacade = require("./api_elements/link");


module.exports = function (options) {
    var auth = authHelper(options);
    var storage = storageFacade(auth, options);
    var link = linkFacade(auth, options);

    return {
        auth: auth,
        storage: storage,
        link: link
    };
};