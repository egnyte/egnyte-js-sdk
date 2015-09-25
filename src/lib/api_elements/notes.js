var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");

var ENDPOINTS_notes = require("../enum/endpoints").notes;


function Notes(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);
}


var notesProto = {};
notesProto.path = function (pathFromRoot) {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var self = this;
    return {
        addNote: function (body) {
            var requestEngine = self.requestEngine;
            var decorate = self.getDecorator();
            return promises(true).then(function () {

                var opts = {
                    method: "POST",
                    url: requestEngine.getEndpoint() + ENDPOINTS_notes,
                    json: {
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

        },
        listNotes: function (params) {
            var requestEngine = self.requestEngine;
            var decorate = self.getDecorator();
            return promises(true).then(function () {
                pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
                var opts = {
                    method: "GET",
                    url: requestEngine.getEndpoint() + ENDPOINTS_notes
                };

                //xhr and request differ here
                opts.params = helpers.extend({
                    "file": helpers.encodeURIPath(pathFromRoot)
                }, params);

                return requestEngine.promiseRequest(decorate(opts)).then(function (result) {
                    return result.body;
                });
            });

        }
    };
};

notesProto.getNote = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS_notes + "/" + helpers.encodeURIPath(id)
        };
        return requestEngine.promiseRequest(decorate(opts)).then(function (result) {
            return result.body;
        });
    });

};
notesProto.removeNote = function (id) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
        var opts = {
            method: "DELETE",
            url: requestEngine.getEndpoint() + ENDPOINTS_notes + "/" + helpers.encodeURIPath(id)
        };
        return requestEngine.promiseRequest(decorate(opts));
    });

};


Notes.prototype = notesProto;

module.exports = Notes;