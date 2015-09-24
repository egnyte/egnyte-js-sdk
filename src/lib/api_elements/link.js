var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");

var ENDPOINTS_links = require("../enum/endpoints").links;

function Links(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);
}

var linksProto = {};

linksProto.createLink = function (setup) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
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

            return requestEngine.promiseRequest(decorate({
                method: "POST",
                url: requestEngine.getEndpoint() + ENDPOINTS_links,
                json: setup
            }));
        }).then(function (result) { //result.response result.body
            return result.body;
        });
}


linksProto.removeLink = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return requestEngine.promiseRequest(decorate({
        method: "DELETE",
        url: requestEngine.getEndpoint() + ENDPOINTS_links + "/" + id
    })).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

linksProto.listLink = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return requestEngine.promiseRequest(decorate({
        method: "GET",
        url: requestEngine.getEndpoint() + ENDPOINTS_links + "/" + id
    })).then(function (result) { //result.response result.body
        return result.body;
    });
}


linksProto.listLinks = function (filters) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true)
        .then(function () {
            filters.path = filters.path && helpers.encodeNameSafe(filters.path);

            return requestEngine.promiseRequest(decorate({
                method: "get",
                url: requestEngine.getEndpoint() + ENDPOINTS_links,
                params: filters
            }));
        }).then(function (result) { //result.response result.body
            return result.body;
        });
}

linksProto.findOne = function (filters) {
    var self = this;
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
