var promises = require("q");
var helpers = require('../reusables/helpers');

var ENDPOINTS_notes = require("../enum/endpoints").notes;

exports.addNote = function (pathFromRoot, body) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + ENDPOINTS_notes,
            json:{
                "path": pathFromRoot,
                "body": body,
            }
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function (result) { //result.response result.body
        return {
            id: result.body.id
        };
    });

}
exports.listNotes = function (pathFromRoot, params) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS_notes
        };

        //xhr and request differ here
        opts.params = helpers.extend({
            "file": encodeURI(pathFromRoot)
        }, params);

        return requestEngine.promiseRequest(decorate(opts)).then(function(result){
            return result.body;
        });
    });

}

exports.getNote = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS_notes + "/" + encodeURI(id)
        };
        return requestEngine.promiseRequest(decorate(opts)).then(function (result) {
            return result.body;
        });
    });

}
exports.removeNote = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var opts = {
            method: "DELETE",
            url: requestEngine.getEndpoint() + ENDPOINTS_notes + "/" + encodeURI(id)
        };
        return requestEngine.promiseRequest(decorate(opts));
    });

}



