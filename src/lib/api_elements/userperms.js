var promises = require("q");
var decorators = require("./decorators");

var ENDPOINTS_perms = require("../enum/endpoints").perms;

function UserPerms(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);

    this.addDecorator("path", pointFolder("folder"));
    this.addDecorator("folderId", pointFolder("folder_id"));

}

function pointFolder(what) {
    return function (opts, data) {
        opts.params || (opts.params = {});
        opts.params[what] = data;
        return opts;
    };
}

var userPermsProto = {};

userPermsProto.get = function (user) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    return promises(true)
        .then(function () {
            var opts = {
                method: "GET",
                url: requestEngine.getEndpoint() + ENDPOINTS_perms + "/user" + (user ? "/" + user : "")
            };
            return requestEngine.promiseRequest(decorate(opts));
        }).then(function (result) { //result.response result.body
            return result.body;
        });
};

UserPerms.prototype = userPermsProto;

module.exports = UserPerms;
