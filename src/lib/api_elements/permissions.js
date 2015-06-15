var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");

var ENDPOINTS_perms = require("../enum/endpoints").perms;

function Perms(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);

    this.addDecorator("users", enlist("users"))
    this.addDecorator("groups", enlist("groups"))

}

function enlist(what) {
    return function (opts, data) {
        switch (opts.method) {
        case 'GET':
            opts.params || (opts.params = {});
            opts.params[what] = data.join("|");
            break;
        case 'POST':
            opts.json[what] = data;
            break;
        }
        return opts;
    }
}


var permsProto = {};

permsProto.disallow = function (fullPathOrId) {
    return this.allow(fullPathOrId, "None");
}
permsProto.allowView = function (fullPathOrId) {
    return this.allow(fullPathOrId, "Viewer");
}
permsProto.allowEdit = function (fullPathOrId) {
    return this.allow(fullPathOrId, "Editor");
}
permsProto.allowFullAccess = function (fullPathOrId) {
    return this.allow(fullPathOrId, "Full");
}
permsProto.allowOwnership = function (fullPathOrId) {
    return this.allow(fullPathOrId, "Owner");
}

permsProto.allow = function (fullPathOrId, permission) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    return promises(true)
        .then(function () {
            fullPathOrId = helpers.encodeNameSafe(fullPathOrId) || "";
            var opts = {
                method: "POST",
                url: requestEngine.getEndpoint() + ENDPOINTS_perms + fullPathOrId,
                json: {
                    "permission": permission
                }
            };
            return requestEngine.promiseRequest(decorate(opts));
        }).then(function (result) { //result.response result.body
            return result.response;
        });
};

permsProto.getPerms = function (fullPathOrId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    return promises(true)
        .then(function () {
            fullPathOrId = helpers.encodeNameSafe(fullPathOrId) || "";
            var opts = {
                method: "GET",
                url: requestEngine.getEndpoint() + ENDPOINTS_perms + fullPathOrId
            };
            return requestEngine.promiseRequest(decorate(opts));
        }).then(function (result) { //result.response result.body
            return result.body;
        });
};


Perms.prototype = permsProto;

module.exports = Perms;