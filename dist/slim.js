(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(target) {
	var undef;

	function isFunction(f) {
		return typeof f == 'function';
	}
	function isObject(f) {
		return typeof f == 'object';
	}
	function defer(callback) {
		if (typeof setImmediate != 'undefined')
			setImmediate(callback);
		else if (typeof process != 'undefined' && process['nextTick'])
			process['nextTick'](callback);
		else
			setTimeout(callback, 0);
	}

	target[0][target[1]] = function pinkySwear() {
		var state;           // undefined/null = pending, true = fulfilled, false = rejected
		var values = [];     // an array of values as arguments for the then() handlers
		var deferred = [];   // functions to call when set() is invoked

		var set = function(newState, newValues) {
			if (state == null && newState != null) {
				state = newState;
				values = newValues;
				if (deferred.length)
					defer(function() {
						for (var i = 0; i < deferred.length; i++)
							deferred[i]();
					});
			}
			return state;
		};

		set['then'] = function (onFulfilled, onRejected) {
			var promise2 = pinkySwear();
			var callCallbacks = function() {
	    		try {
	    			var f = (state ? onFulfilled : onRejected);
	    			if (isFunction(f)) {
		   				function resolve(x) {
						    var then, cbCalled = 0;
		   					try {
				   				if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
										if (x === promise2)
											throw new TypeError();
										then['call'](x,
											function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
											function(value){ if (!cbCalled++) promise2(false,[value]);});
				   				}
				   				else
				   					promise2(true, arguments);
		   					}
		   					catch(e) {
		   						if (!cbCalled++)
		   							promise2(false, [e]);
		   					}
		   				}
		   				resolve(f.apply(undef, values || []));
		   			}
		   			else
		   				promise2(state, values);
				}
				catch (e) {
					promise2(false, [e]);
				}
			};
			if (state != null)
				defer(callCallbacks);
			else
				deferred.push(callCallbacks);
			return promise2;
		};

		// always(func) is the same as then(func, func)
		set['always'] = function(func) { return set['then'](func, func); };

		// error(func) is the same as then(0, func)
		set['error'] = function(func) { return set['then'](0, func); };
		return set;
	};
})(typeof module == 'undefined' ? [window, 'pinkySwear'] : [module, 'exports']);
},{}],2:[function(require,module,exports){
var window = require(1)
var once = require(2)

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ?
        window.XMLHttpRequest : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr && options.cors) {
        xhr = new XDR()
    } else if (!xhr) {
        xhr = new XHR()
    }

    var uri = xhr.url = options.uri || options.url;
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var key

    if ("json" in options) {
        isJson = true
        if (method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    // hate IE
    xhr.ontimeout = noop
    xhr.open(method, uri, !sync)
    if (options.cors) {
        xhr.withCredentials = true
    }
    // Cannot set timeout with sync request
    if (!sync) {
        xhr.timeout = "timeout" in options ? options.timeout : 5000
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function load() {
        var error = null
        var status = xhr.statusCode = xhr.status
        var body = xhr.body = xhr.response ||
            xhr.responseText || xhr.responseXML

        if (status === 1223) {
            status = 204
        }

        if (status === 0 || (status >= 400 && status < 600)) {
            var message;
            try{
            message = xhr.responseText;
            }catch(e){
                // accessing xhr.responseText can throw errors when xhr.responseType is changed
            }
            message = message || messages[String(xhr.status).charAt(0)];
            error = new Error(message)

            error.statusCode = xhr.status
        }

        if (isJson) {
            try {
                body = xhr.body = JSON.parse(body)
            } catch (e) {}
        }

        callback(error, xhr, body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}
},{"1":3,"2":4}],3:[function(require,module,exports){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}
},{}],4:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}
},{}],5:[function(require,module,exports){
module.exports = {
    handleQuota: true,
    QPS: 2,
    filepickerViewAddress: "folderExplorer.do",
    channelMarker: "'E"
    
}

},{}],6:[function(require,module,exports){
var APIMain = require(2);
var storageFacade = require(3);
var linkFacade = require(1);


module.exports = function (options) {
    var main = APIMain(options);
    var storage = storageFacade(main, options);
    var link = linkFacade(main, options);

    return {
        auth: main,
        storage: storage,
        link: link
    };
};
},{"1":7,"2":8,"3":9}],7:[function(require,module,exports){
var promises = require(1);
var helpers = require(2);


var api;
var options;


var linksEndpoint = "/links";


function createLink(setup) {
    var defaults = {
        path: null,
        type: "file",
        accessibility: "domain"
    };
    return promises.start(true)
        .then(function () {
            setup = helpers.extend(defaults, setup);
            setup.path = helpers.encodeNameSafe(setup.path);

            if (!setup.path) {
                throw new Error("Path attribute missing or incorrect");
            }

            return api.promiseRequest({
                method: "POST",
                url: api.getEndpoint() + linksEndpoint,
                json: setup
            });
        }).then(function (result) { //result.response result.body
            return result.body;
        });
}


function removeLink(id) {
    return api.promiseRequest({
        method: "DELETE",
        url: api.getEndpoint() + linksEndpoint + "/" + id
    }).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

function listLink(id) {
    return api.promiseRequest({
        method: "GET",
        url: api.getEndpoint() + linksEndpoint + "/" + id
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}


function listLinks(filters) {
    return promises.start(true)
        .then(function () {
            filters.path = filters.path && helpers.encodeNameSafe(filters.path);

            return api.promiseRequest({
                method: "get",
                url: api.getEndpoint() + linksEndpoint,
                params: filters
            });
        }).then(function (result) { //result.response result.body
            return result.body;
        });
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
},{"1":10,"2":11}],8:[function(require,module,exports){
var oauthRegex = /access_token=([^&]+)/;
var quotaRegex = /^<h1>Developer Over Qps/i;


var promises = require(1);
var helpers = require(2);
var xhr = require(3);


function Engine(options) {
    this.options = options;
    this.quota = {
        startOfTheSecond: 0,
        calls: 0,
        retrying: 0
    }
    this.queue = [];

    if (this.options.token) {
        this.token = this.options.token;
    }
    
    this.queueHandler = helpers.bindThis(this, _rollQueue);

}

var enginePrototypeMethods = {};

enginePrototypeMethods.reloadForToken = function () {
    window.location.href = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + window.location.href;
}

enginePrototypeMethods.checkTokenResponse = function (success, notoken) {
    if (!this.token) {
        var access = oauthRegex.exec(window.location.hash);
        if (access) {
            if (access.length > 1) {
                this.token = access[1];
                window.location.hash="";
                success && success();
            } else {
                //what now?
            }
        } else {
            notoken && notoken();
        }
    } else {
        success && success();
    }
}

enginePrototypeMethods.requestToken = function (callback) {
    this.checkTokenResponse(callback, helpers.bindThis(this,this.reloadForToken));
}

enginePrototypeMethods.onTokenReady = function (callback) {
    this.checkTokenResponse(callback, function () {});
}

//TODO: implement popup flow
enginePrototypeMethods.requestTokenWindow = function (callback, pingbackURL) {
    //    if (!this.token) {
    //        var dialog = window.open(this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + pingbackURL);
    //
    //        //listen for a postmessage from window that gives you a token 
    //    } else {
    //        callback();
    //    }

}

enginePrototypeMethods.authorizeXHR = function (xhr) {
    //assuming token_type was bearer, no use for XHR otherwise, right?
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
}

enginePrototypeMethods.getHeaders = function () {
    return {
        "Authorization": "Bearer " + this.token
    };
}

enginePrototypeMethods.getEndpoint = function () {
    return this.options.egnyteDomainURL + "/pubapi/v1";
}

enginePrototypeMethods.isAuthorized = function () {
    return !!this.token;
}

enginePrototypeMethods.getToken = function () {
    return this.token;
}

enginePrototypeMethods.setToken = function (externalToken) {
    this.token = externalToken;
}


enginePrototypeMethods.dropToken = function (externalToken) {
    this.token = null;
}

function params(obj) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
}



enginePrototypeMethods.sendRequest = function (opts, callback) {
    var self = this;
    var originalOpts = helpers.extend({}, opts);
    if (this.isAuthorized()) {
        if (opts.params) {
            opts.url += "?" + params(opts.params);
        }
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = "Bearer " + this.getToken();
        return xhr(opts, function (error, response, body) {
            try {
                //this shouldn't be required, but server sometimes responds with content-type text/plain
                body = JSON.parse(body);
            } catch (e) {}
            if (
                self.options.handleQuota &&
                response.statusCode === 403 &&
                response.getResponseHeader("Retry-After")
            ) {
                //retry
                console && console.warn("develoer over QPS, retrying");
                self.quota.retrying = 1000 * ~~(response.getResponseHeader("Retry-After"));
                setTimeout(function () {
                    self.quota.retrying = 0;
                    self.sendRequest(originalOpts, callback);
                }, self.quota.retrying);

            } else {
                callback.call(this, error, response, body);
            }
        });
    } else {
        callback.call(this, new Error("Not authorized"), {
            statusCode: 0
        }, null);
    }

}

enginePrototypeMethods.promiseRequest = function (opts) {
    var defer = promises.defer();
    var self = this;
    var performRequest = function () {
        try {
            self.sendRequest(opts, function (error, response, body) {
                if (error) {
                    defer.reject({
                        error: error,
                        response: response,
                        body: body
                    });
                } else {
                    defer.resolve({
                        response: response,
                        body: body
                    });
                }
            });
        } catch (error) {
            defer.reject({
                error: error
            });
        }
    }
    this.addToQueue(performRequest);
    return defer.promise;
}

enginePrototypeMethods.addToQueue = function (requestFunction) {
    if (!this.options.handleQuota) {
        requestFunction();
    } else {
        this.queue.push(requestFunction);
        //stop previous queue processing if any
        clearTimeout(this.quota.to);
        //start queue processing
        this.queueHandler();
    }
}

//gets bound to this in the constructor and saved as this.queueHandler
function _rollQueue() {
    if (this.queue.length) {
        var currentWait = this.quotaWaitTime();
        if (currentWait === 0) {
            var requestFunction = this.queue.shift();
            requestFunction();
            this.quota.calls++;
        }
        this.quota.to = setTimeout(this.queueHandler, currentWait);
    }

}

enginePrototypeMethods.quotaWaitTime = function () {
    var now = +new Date();
    var diff = now - this.quota.startOfTheSecond;
    //in the middle of retrying a denied call
    if (this.quota.retrying) {
        this.quota.startOfTheSecond = now + this.quota.retrying;
        return this.quota.retrying + 1;
    }
    //last call was over a second ago, can start
    if (diff > 1000) {
        this.quota.startOfTheSecond = now;
        this.quota.calls = 0;
        return 0;
    }
    //calls limit not reached
    if (this.quota.calls < this.options.QPS) {
        return 0;
    }
    //calls limit reached, delay to the next second
    return 1001 - diff;
}


Engine.prototype = enginePrototypeMethods;

module.exports = function (opts) {
    return new Engine(opts);
};
},{"1":10,"2":11,"3":2}],9:[function(require,module,exports){
var promises = require(1);
var helpers = require(2);

var api;
var options;

var fsmeta = "/fs";
var fscontent = "/fs-content";


function exists(pathFromRoot) {
    return promises.start(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        return api.promiseRequest({
            method: "GET",
            url: api.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 200) {
            return true;
        } else {
            return false;
        }
    }, function (result) { //result.error result.response, result.body
        if (result.response && result.response.statusCode == 404) {
            return false;
        } else {
            throw result.error;
        }
    });
}

function get(pathFromRoot) {
    return promises.start(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        return api.promiseRequest({
            method: "GET",
            url: api.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        });
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}

function download(pathFromRoot, isBinary) {
    return promises.start(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        var opts = {
            method: "GET",
            url: api.getEndpoint() + fscontent + encodeURI(pathFromRoot),
        }

        if (isBinary) {
            opts.responseType = "arraybuffer";
        }

        return api.promiseRequest(opts);
    }).then(function (result) { //result.response result.body
        return result.response;
    });
}

function createFolder(pathFromRoot) {
    return promises.start(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        return api.promiseRequest({
            method: "POST",
            url: api.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": "add_folder"
            }
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 201) {
            return {
                path: pathFromRoot
            };
        }
    });
}

function move(pathFromRoot, newPath) {
    return promises.start(true).then(function () {
        if (!newPath) {
            throw new Error("Cannot move to empty path");
        }
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        newPath = helpers.encodeNameSafe(newPath);
        return api.promiseRequest({
            method: "POST",
            url: api.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": "move",
                "destination": "/" + newPath,
            }
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 200) {
            return {
                oldPath: pathFromRoot,
                path: newPath
            };
        }
    });
}


function storeFile(pathFromRoot, fileOrBlob) {
    return promises.start(true).then(function () {
        if (!window.FormData) {
            throw new Error("Unsupported browser");
        }
        var file = fileOrBlob;
        var formData = new window.FormData();
        formData.append('file', file);
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

        return api.promiseRequest({
            method: "POST",
            url: api.getEndpoint() + fscontent + encodeURI(pathFromRoot),
            body: formData,
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode === 200 || result.response.statusCode === 201) {
            return ({
                id: result.response.getResponseHeader("etag"),
                path: pathFromRoot
            });
        } else {
            throw new Error(result.response.statusCode);
        }
    });
}

function remove(pathFromRoot, versionEntryId) {
    return promises.start(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
        var opts = {
            method: "DELETE",
            url: api.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        };
        if (versionEntryId) {
            opts.params = {
                "entry_id": versionEntryId
            };
        }
        return api.promiseRequest(opts);

    }).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

function removeFileVersion(pathFromRoot, versionEntryId) {
    return promises.start(true).then(function () {
        if (!versionEntryId) {
            throw new Error("Version ID (second argument) is missing");
        }
        return remove(pathFromRoot, versionEntryId)
    });
}


function removeEntry(pathFromRoot) {
    return remove(pathFromRoot);
}

module.exports = function (apihelper, opts) {
    options = opts;
    api = apihelper;
    return {
        exists: exists,
        get: get,
        download: download,
        createFolder: createFolder,
        move: move,
        rename: move,
        remove: removeEntry,

        storeFile: storeFile,
        removeFileVersion: removeFileVersion
    };
};
},{"1":10,"2":11}],10:[function(require,module,exports){
var pinkySwear = require(1);

module.exports = {
    "defer": function () {
        var promise = pinkySwear();
        return {
            promise: promise,
            resolve: function (a) {
                promise(true, [a]);
            },
            reject: function (a) {
                promise(false, [a]);
            }
        };
    },
    "start": function (value) {
        var promise = pinkySwear();
        promise(value);
        return promise;
    }

}

},{"1":1}],11:[function(require,module,exports){
function each(collection, fun) {
    if (collection) {
        if (collection.length === +collection.length) {
            for (var i = 0; i < collection.length; i++) {
                fun.call(null, collection[i], i, collection);
            }
        } else {
            for (var i in collection) {
                if (collection.hasOwnProperty(i)) {
                    fun.call(null, collection[i], i, collection);
                }
            }
        }
    }
}

module.exports = {
    //simple extend function
    extend: function extend(target) {
        var i, k;
        for (i = 1; i < arguments.length; i++) {
            if (arguments[i]) {
                for (k in arguments[i]) {
                    if (arguments[i].hasOwnProperty(k) && (typeof arguments[i][k] !== "undefined")) {
                        target[k] = arguments[i][k];
                    }
                }
            }
        }
        return target;
    },
    noop: function () {},
    bindThis: function(that,func){
        return function(){
            return func.apply(that,arguments);
        }
    },
    each: each,
    normalizeURL: function (url) {
        return (url).replace(/\/*$/, "");
    },
    encodeNameSafe: function (name) {
        if (!name) {
            throw new Error("No name given");
        }
        var name2 = [];
        each(name.split("/"), function (e) {
            name2.push(e.replace(/[?*&#%<>]*/gi, ""));
        });
        name2 = name2.join("/").replace(/^\/\//, "/");

        return (name2);
    }
};
},{}],12:[function(require,module,exports){
(function () {
    "use strict";

    var helpers = require(3);
    var options = require(1);

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            API:  require(2)(options)
        }

    }

    window.Egnyte = {
        init: init
    }

})();
},{"1":5,"2":6,"3":11}]},{},[12])