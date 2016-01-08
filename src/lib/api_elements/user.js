var promises = require("q");
var decorators = require("./decorators");

var ENDPOINTS_users = require("../enum/endpoints").users;

function User(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);
}

var userProto = {};

userProto.getById = function (userId) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    return promises(true)
        .then(function () {
            var opts = {
                method: "GET",
                url: requestEngine.getEndpoint() + ENDPOINTS_users + userId
            };
            return requestEngine.promiseRequest(decorate(opts));
        }).then(function (result) { //result.response result.body
            return result.body;
        });
};
userProto.getByName = function (username) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    return promises(true)
        .then(function () {
            var opts = {
                method: "GET",
                url: requestEngine.getEndpoint() + ENDPOINTS_users,
                params: {
                    filter: "userName eq \"" + username + "\""
                }
            };
            return requestEngine.promiseRequest(decorate(opts));
        }).then(function (result) { //result.response result.body
            return result.body.resources[0];
        });
};

User.prototype = userProto;

module.exports = User;
