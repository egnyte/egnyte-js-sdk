var RequestEngine = require("./api_elements/reqengine");
var AuthEngine = require("./api_elements/auth");
var StorageFacade = require("./api_elements/storage");
var streamsExtension = require("./api_elements/storage-streams-node");
var LinkFacade = require("./api_elements/link");


module.exports = function (options) {
    var auth = new AuthEngine(options);
    var requestEngine = new RequestEngine(auth, options);
    
    var storage = new (streamsExtension(StorageFacade))(requestEngine);
    var link = new LinkFacade(requestEngine);
    
    var api = {
        manual: requestEngine,
        auth: auth,
        storage: storage,
        link: link
    };

    return api;
};