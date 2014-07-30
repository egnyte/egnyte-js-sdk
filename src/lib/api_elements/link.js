var promises = require("q");
var helpers = require('../reusables/helpers');



var linksEndpoint = "/links";

function Links(requestEngine) {
    this.requestEngine = requestEngine;
}

var linksProto = {};

linksProto.createLink = function(setup) {
    var requestEngine = this.requestEngine;
    var defaults = {
        path: null,
        type: "file",
        accessibility: "domain"
    };
    return promises(true)
        .then(function () {
            setup = helpers.extend(defaults, setup);
            setup.path = helpers.encodeNameSafe(setup.path);

            if (!setup.path) {
                throw new Error("Path attribute missing or incorrect");
            }

            return requestEngine.promiseRequest({
                method: "POST",
                url: requestEngine.getEndpoint() + linksEndpoint,
                json: setup
            });
        }).then(function (result) { //result.response result.body
            return result.body;
        });
}


linksProto.removeLink = function(id) {
    var requestEngine = this.requestEngine;
    return requestEngine.promiseRequest({
        method: "DELETE",
        url: requestEngine.getEndpoint() + linksEndpoint + "/" + id
    }).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

linksProto.listLink = function(id) {
    var requestEngine = this.requestEngine;
    return requestEngine.promiseRequest({
        method: "GET",
        url: requestEngine.getEndpoint() + linksEndpoint + "/" + id
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}


linksProto.listLinks = function(filters) {
    var requestEngine = this.requestEngine;
    return promises(true)
        .then(function () {
            filters.path = filters.path && helpers.encodeNameSafe(filters.path);

            return requestEngine.promiseRequest({
                method: "get",
                url: requestEngine.getEndpoint() + linksEndpoint,
                params: filters
            });
        }).then(function (result) { //result.response result.body
            return result.body;
        });
}

linksProto.findOne = function(filters) {
    var self=this;
    return self.listLinks(filters).then(function (list) {
        if (list.ids && list.ids.length > 0) {
            return self.listLink(list.ids[0]);
        } else {
            return null;
        }
    });
}

Links.prototype = linksProto;

module.exports = Links;