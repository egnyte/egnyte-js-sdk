var helpers = require('../reusables/helpers');

function makeId(isFolder, theId) {
    return (isFolder ? "/ids/folder/" : "/ids/file/") + theId;
}

function createMethod(implementation, self, pathOrId) {
    if (Function.prototype.bind) {
        return implementation.bind(self, pathOrId);
    } else {
        return function (something, somethingElse) {
            //no need to handle more than path+2 arguments, ever.
            return implementation.call(self, pathOrId, something, somethingElse);
        }
    }
}

function wrap(self, pathOrId, APIPrototype) {
    var api = {};
    helpers.each(APIPrototype, function (implementation, name) {
        api[name] = createMethod(implementation, self, pathOrId)

    })
    return api;
}


module.exports = function (APIPrototype, opts) {
    return {
        fileId: function (groupId) {
            return wrap(this, makeId(false, groupId), APIPrototype)
        },
        folderId: function (folderId) {
            return wrap(this, makeId(true, folderId), APIPrototype)
        },
        path: function (path) {
            if (opts && opts.pathPrefix) {
                path = opts.pathPrefix + path;
            }
            return wrap(this, path, APIPrototype)
        },
        internals: APIPrototype
    }

}