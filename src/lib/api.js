var RequestEngine = require("./api_elements/reqengine");
var AuthEngine = require("./api_elements/auth");
var StorageFacade = require("./api_elements/storage");
var Notes = require("./api_elements/notes");
var streamsExtension = require("./api_elements/storageStreamsNode");
var LinkFacade = require("./api_elements/link");
var PermFacade = require("./api_elements/permissions");
var Events = require("./api_elements/events");
var helpers = require("./reusables/helpers");
var UserPerms = require("./api_elements/userperms");

module.exports = function (options) {
    var auth = new AuthEngine(options);
    var requestEngine = new RequestEngine(auth, options);

    helpers.extend(StorageFacade.prototype.internals, streamsExtension);

    var storage = new StorageFacade(requestEngine);
    var notes = new Notes(requestEngine);
    var link = new LinkFacade(requestEngine);
    var perms = new PermFacade(requestEngine);
    var events = new Events(requestEngine);
    var userPerms = new UserPerms(requestEngine);

    var api = {
        manual: requestEngine,
        auth: auth,
        storage: storage,
        notes: notes,
        link: link,
        events: events,
        perms: perms,
        userPerms: userPerms
    };

    return api;
};