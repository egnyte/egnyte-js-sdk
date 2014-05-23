var APIMain = require("./api_elements/main");
var storageFacade = require("./api_elements/storage");
var linkFacade = require("./api_elements/link");


module.exports = function (options) {
    var main = APIMain(options);
    var storage = storageFacade(main, options);
    var link = linkFacade(main, options);

    return {
        auth: main,
        storage: storage,
        link: link
    };
};