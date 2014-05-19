var promises = require('../promises');
var helpers = require('../reusables/helpers');


var api;
var options;


var linksEndpoint = "/links";


function createLink(setup) {
    var defaults = {
        path: null,
        type: "file",
        accessibility: "domain"
    };
    var defer = promises.defer();
    setup = helpers.extend(defaults, setup);
    setup.path = helpers.encodeNameSafe(setup.path);

    if (!setup.path) {
        throw new Error("Path attribute missing or incorrect");
    }

    api.sendRequest({
        method: "POST",
        url: api.getEndpoint() + linksEndpoint,
        json: setup
    }, function (error, response, body) {
        if (response.statusCode == 200) {
            defer.resolve(body);
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}


function removeLink(id) {
    var defer = promises.defer();
    api.sendRequest({
        method: "DELETE",
        url: api.getEndpoint() + linksEndpoint + "/" + id
    }, function (error, response, body) {
        if (response.statusCode == 200) {
            defer.resolve();
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function listLink(id) {
    var defer = promises.defer();
    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + linksEndpoint + "/" + id
    }, function (error, response, body) {
        if (response.statusCode == 200) {
            defer.resolve(body);
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}


function listLinks(filters) {
    var defer = promises.defer();
    filters.path = filters.path && helpers.encodeNameSafe(filters.path);

    api.sendRequest({
        method: "get",
        url: api.getEndpoint() + linksEndpoint,
        params: filters
    }, function (error, response, body) {
        if (response.statusCode == 200) {
            defer.resolve(body);
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}



module.exports = function (apihelper, opts) {
    options = opts;
    api = apihelper;
    return {
        createLink: createLink,
        removeLink: removeLink,
        listLink: listLink,
        listLinks: listLinks
    };
};