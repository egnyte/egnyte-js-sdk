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
var ua = typeof window !== 'undefined' ? window.navigator.userAgent : ''
  , isOSX = /OS X/.test(ua)
  , isOpera = /Opera/.test(ua)
  , maybeFirefox = !/like Gecko/.test(ua) && !isOpera

var i, output = module.exports = {
  0:  isOSX ? '<menu>' : '<UNK>'
, 1:  '<mouse 1>'
, 2:  '<mouse 2>'
, 3:  '<break>'
, 4:  '<mouse 3>'
, 5:  '<mouse 4>'
, 6:  '<mouse 5>'
, 8:  '<backspace>'
, 9:  '<tab>'
, 12: '<clear>'
, 13: '<enter>'
, 16: '<shift>'
, 17: '<control>'
, 18: '<alt>'
, 19: '<pause>'
, 20: '<caps-lock>'
, 21: '<ime-hangul>'
, 23: '<ime-junja>'
, 24: '<ime-final>'
, 25: '<ime-kanji>'
, 27: '<escape>'
, 28: '<ime-convert>'
, 29: '<ime-nonconvert>'
, 30: '<ime-accept>'
, 31: '<ime-mode-change>'
, 27: '<escape>'
, 32: '<space>'
, 33: '<page-up>'
, 34: '<page-down>'
, 35: '<end>'
, 36: '<home>'
, 37: '<left>'
, 38: '<up>'
, 39: '<right>'
, 40: '<down>'
, 41: '<select>'
, 42: '<print>'
, 43: '<execute>'
, 44: '<snapshot>'
, 45: '<insert>'
, 46: '<delete>'
, 47: '<help>'
, 91: '<meta>'  // meta-left -- no one handles left and right properly, so we coerce into one.
, 92: '<meta>'  // meta-right
, 93: isOSX ? '<meta>' : '<menu>'      // chrome,opera,safari all report this for meta-right (osx mbp).
, 95: '<sleep>'
, 106: '<num-*>'
, 107: '<num-+>'
, 108: '<num-enter>'
, 109: '<num-->'
, 110: '<num-.>'
, 111: '<num-/>'
, 144: '<num-lock>'
, 145: '<scroll-lock>'
, 160: '<shift-left>'
, 161: '<shift-right>'
, 162: '<control-left>'
, 163: '<control-right>'
, 164: '<alt-left>'
, 165: '<alt-right>'
, 166: '<browser-back>'
, 167: '<browser-forward>'
, 168: '<browser-refresh>'
, 169: '<browser-stop>'
, 170: '<browser-search>'
, 171: '<browser-favorites>'
, 172: '<browser-home>'

  // ff/osx reports '<volume-mute>' for '-'
, 173: isOSX && maybeFirefox ? '-' : '<volume-mute>'
, 174: '<volume-down>'
, 175: '<volume-up>'
, 176: '<next-track>'
, 177: '<prev-track>'
, 178: '<stop>'
, 179: '<play-pause>'
, 180: '<launch-mail>'
, 181: '<launch-media-select>'
, 182: '<launch-app 1>'
, 183: '<launch-app 2>'
, 186: ';'
, 187: '='
, 188: ','
, 189: '-'
, 190: '.'
, 191: '/'
, 192: '`'
, 219: '['
, 220: '\\'
, 221: ']'
, 222: "'"
, 223: '<meta>'
, 224: '<meta>'       // firefox reports meta here.
, 226: '<alt-gr>'
, 229: '<ime-process>'
, 231: isOpera ? '`' : '<unicode>'
, 246: '<attention>'
, 247: '<crsel>'
, 248: '<exsel>'
, 249: '<erase-eof>'
, 250: '<play>'
, 251: '<zoom>'
, 252: '<no-name>'
, 253: '<pa-1>'
, 254: '<clear>'
}

for(i = 58; i < 65; ++i) {
  output[i] = String.fromCharCode(i)
}

// 0-9
for(i = 48; i < 58; ++i) {
  output[i] = (i - 48)+''
}

// A-Z
for(i = 65; i < 91; ++i) {
  output[i] = String.fromCharCode(i)
}

// num0-9
for(i = 96; i < 106; ++i) {
  output[i] = '<num-'+(i - 96)+'>'
}

// F1-F24
for(i = 112; i < 136; ++i) {
  output[i] = 'F'+(i-111)
}
},{}],3:[function(require,module,exports){
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
},{"1":4,"2":5}],4:[function(require,module,exports){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
module.exports = {
    handleQuota: true,
    QPS: 2,
    filepickerViewAddress: "folderExplorer.do",
    channelMarker: "'E"
    
}

},{}],7:[function(require,module,exports){
(function () {
    "use strict";

    var helpers = require(5);
    var options = require(1);

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        var api = require(2)(options);

        return {
            domain: options.egnyteDomainURL,
            filePicker: require(3)(api),
            filePickerRemote: require(4)(options),
            API: api
        }

    }

    window.Egnyte = {
        init: init
    }

})();
},{"1":6,"2":8,"3":12,"4":13,"5":20}],8:[function(require,module,exports){
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
},{"1":9,"2":10,"3":11}],9:[function(require,module,exports){
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
},{"1":18,"2":20}],10:[function(require,module,exports){
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

enginePrototypeMethods.checkTokenResponse = function (success, none) {
    if (!this.token) {
        var access = oauthRegex.exec(window.location.hash);
        if (access) {
            if (access.length > 1) {
                this.token = access[1];
                success && success();
            } else {
                //what now?
            }
        } else {
            none && none();
        }
    } else {
        success && success();
    }
}

enginePrototypeMethods.requestToken = function (callback) {
    this.checkTokenResponse(callback, this.reloadForToken);
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
},{"1":18,"2":20,"3":3}],11:[function(require,module,exports){
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
},{"1":18,"2":20}],12:[function(require,module,exports){
(function () {

    var helpers = require(4);
    var dom = require(3);
    var View = require(2);
    var Model = require(1);

    function init(API) {
        var filePicker;

        filePicker = function (node, setup) {
            if (!setup) {
                throw new Error("Setup required as a second argument");
            }
            var close, fpView, fpModel,
                defaults = {
                    folder: true,
                    file: true,
                    multiple: true
                };
            var selectOpts = helpers.extend(defaults, setup.select);

            close = function () {
                fpView.destroy();
                fpView = null;
                fpModel = null;
            };

            fpModel = new Model(API, {
                select: selectOpts
            });

            fpView = new View({
                el: node,
                model: fpModel,
                barAlign: setup.barAlign,
                handlers: {
                    ready: setup.ready,
                    selection: function (items) {
                        close();
                        setup.selection && setup.selection(items);
                    },
                    close: function (e) {
                        close();
                        setup.cancel && setup.cancel(e);
                    },
                    error: setup.error
                }
            },setup.texts);

            fpModel.fetch(setup.path || "/");

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();
},{"1":15,"2":16,"3":19,"4":20}],13:[function(require,module,exports){
(function () {

    var helpers = require(2);
    var dom = require(1);
    var messages = require(3);


    function listen(channel, callback) {
        channel.handler = messages.createMessageHandler(channel.sourceOrigin, channel.marker, callback);
        channel._evListener = dom.addListener(window, "message", channel.handler);
    }

    function destroy(channel, iframe) {
        channel._evListener.destroy();
        if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    }


    function actionsHandler(close, actions) {
        return function (message) {
            var actionResult;
            if (message.action) {

                if (actions.hasOwnProperty(message.action) && actions[message.action] && actions[message.action].call) {
                    actionResult = actions[message.action](message.data);
                }

                switch (message.action) {
                case "selection":
                    if (actionResult !== false) {
                        close();
                    }
                    break;
                case "cancel":
                    close();
                    break;
                }

            }
        };
    }

    function init(options) {
        var filePicker;
        var ready = false;

        filePicker = function (node, setup) {
            if (!setup) {
                throw new Error("Setup required as a second argument");
            }
            var iframe;
            var channel = {
                marker: options.channelMarker,
                sourceOrigin: options.egnyteDomainURL
            };
            //informs the view to open a certain location
            var sendOpenAt = function () {
                if (setup.path) {
                    messages.sendMessage(iframe.contentWindow, channel, "openAt", setup.path);
                }
            }
            var close = function () {
                destroy(channel, iframe);
            };


            iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.filepickerViewAddress);

            listen(channel,
                actionsHandler(close, {
                    "selection": setup.selection || helpers.noop,
                    "cancel": setup.cancel || helpers.noop,
                    "ready": function () {
                        ready = true;
                        sendOpenAt();
                        setup.ready || setup.ready();
                    }
                })
            );

            node.appendChild(iframe);

            return {
                close: close
            };
        };

        return filePicker;

    }

    module.exports = init;


})();
},{"1":19,"2":20,"3":21}],14:[function(require,module,exports){
var helpers = require(1);
var mapping = {};
helpers.each({
    "audio": ["mp3", "wav", "wma", "aiff", "mid", "midi", "mp2"],
    "video": ["wmv", "avi", "mpg", "mpeg", "mp4", "webm", "ogv", "flv", "mov"],
    "pdf": ["pdf"],
    "word_processing": ["doc", "dot", "docx", "dotx", "docm", "dotm", "odt ", "ott", "oth", "odm", "sxw", "stw", "sxg", "sdw", "sgl", "rtf", "hwp", "uot", "wpd", "wps"],
    "spreadsheet": ["123", "xls", "xlt", "xla", "xlsx", "xltx", "xlsm", "xltm", "xlam", "xlsb", "ods", "fods", "ots", "sxc", "stc", "sdc", "csv", "uos"],
    "presentation": ["ppt", "pot", "pps", "ppa", "pptx", "potx", "ppsx", "ppam", "pptm", "potm", "ppsm", "odp", "fodp", "otp", "sxi", "sti", "sdd", "sdp"],
    "cad": ["dwg", "dwf", "dxf", "sldprt", "sldasm", "slddrw"],
    "text": ["txt", "log"],
    "image": ["odg", "otg", "odi", "sxd", "std", "sda", "svm", "jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "psd", "eps", "tga", "wmf", "ai", "cgm", "fodg", "jfif", "pbm", "pcd", "pct", "pcx", "pgm", "ppm", "ras", "sgf", "svg"],
    "code": ["html", "htm", "sql", "xml", "java", "cpp", "c", "perl", "py", "rb", "php", "js", "css", "applescript", "as3", "as", "bash", "shell", "sh", "cfm", "cfml", "cs", "pas", "dcu", "diff", "patch", "ez", "erl", "groovy", "gvy", "gy", "gsh", "javafx", "jfx", "pl", "pm", "ps1", "ruby", "sass", "scss", "scala", "vb", "vbscript", "xhtml", "xslt"],
    "archive": ["zip", "rar", "tar", "gz", "7z", "bz2", "z", "xz", "ace", "sit", "sitx", "tgz", "apk"],
    "goog": ["gdoc","gsheet","gslides","gdraw"]
//    "email": ["msg", "olk14message", "pst", "emlx", "olk14event", "eml", "olk14msgattach", "olk14msgsource"],
}, function (list,mime) {
    helpers.each(list, function (ex) {
        mapping[ex] = mime;
    });
});

var fileext = /.*\.([a-z0-9]*)$/i;

function getExt(name) {
    if (fileext.test(name)) {
        return name.replace(fileext, "$1");
    } else {
        return "";
    }
}

module.exports = {
    getMime: function (name) {
        return mapping[getExt(name)] || "unknown";
    },
    getExt: getExt
}

},{"1":20}],15:[function(require,module,exports){
var helpers = require(1);
var exts = require(2);




//Item model
function Item(data, parent) {
    this.data = data;
    if (!this.data.is_folder) {
        this.ext = exts.getExt(data.name).substr(0, 3);
        this.mime = exts.getMime(data.name);
    } else {
        this.ext = "";
        this.mime = "unknown"
    }
    this.isSelectable = ((parent.opts.select.folder && data.is_folder) || (parent.opts.select.file && !data.is_folder));
    this.parent = parent;
    this.isCurrent = false;
}

Item.prototype.defaultAction = function () {
    if (this.data.is_folder) {
        this.parent.fetch(this.data.path);
    } else {
        this.toggleSelect();
    }
};

Item.prototype.toggleSelect = function () {
    if (this.isSelectable) {
        if (!this.parent.opts.select.multiple) {
            this.parent.deselect();
        }
        this.selected = !this.selected;
        this.onchange();
        this.parent.onchange();
    }
};

//Collection
function Model(API, opts) {
    this.opts = opts;
    this.API = API;
    this.page = 1;
    this.pageSize = 200;
    // no defaults needed
    //    this.rawItems = [];
    //    this.hasPages = false;
}


Model.prototype.onloading = helpers.noop;
Model.prototype.onupdate = helpers.noop;
Model.prototype.onerror = helpers.noop;

Model.prototype._set = function (m) {
    var self = this;
    this.path = m.path;
    this.page = 1;

    this.rawItems = [];
    helpers.each(m.folders, function (f) {
        self.rawItems.push(f);
    });
    //ignore files if they're not selectable
    if (this.opts.select.file) {
        helpers.each(m.files, function (f) {
            self.rawItems.push(f);
        });
    }
    this.totalPages = ~~ (this.rawItems.length / this.pageSize) + 1;
    this.isMultiselectable = (this.opts.select.multiple);
    this._buildItems();

};

Model.prototype._buildItems = function () {
    var self = this;
    this.currentItem = -1;
    this.items = [];
    this.hasPages = (this.rawItems.length > this.pageSize);
    if (this.rawItems.length === 0) {
        this.isEmpty = true;
    } else {
        this.isEmpty = false;
        var pageArr = this.rawItems.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
        helpers.each(pageArr, function (item) {
            self.items.push(new Item(item, self));
        });
    }

    this.onupdate();
    this.onchange();
}

Model.prototype.fetch = function (path) {
    var self = this;
    if (path) {
        this.path = path;
    }
    self.onloading();
    self.API.storage.get(this.path).then(function (m) {
        self._set(m);
    }).error(function (e) {
        self.onerror(e.error || e);
    });
}

Model.prototype.switchPage = function (offset) {
    var newPage = this.page + offset;
    if (newPage <= this.totalPages && newPage > 0) {
        this.page = newPage;
        this._buildItems();
    }
}


Model.prototype.goUp = function () {
    var path = this.path.replace(/\/[^\/]+\/?$/i, "") || "/";

    if (path !== this.path) {
        this.fetch(path);
    }
}

Model.prototype.getSelected = function () {
    var selected = [];
    helpers.each(this.items, function (item) {
        if (item.selected) {
            selected.push(item.data);
        }
    });
    return selected;
}

Model.prototype.deselect = function () {
    helpers.each(this.items, function (item) {
        if (item.selected) {
            item.selected = false;
            item.onchange();
        }
    });
}
Model.prototype.setAllSelection = function (selected) {
    helpers.each(this.items, function (item) {
        item.selected = selected;
        item.onchange();
    });
    this.onchange();
}

Model.prototype.mvCurrent = function (offset) {
    if (this.currentItem + offset < this.items.length && this.currentItem + offset >= 0) {
        if (this.items[this.currentItem]) {
            this.items[this.currentItem].isCurrent = false;
            this.items[this.currentItem].onchange();
        }
        this.currentItem += offset;
        this.items[this.currentItem].isCurrent = true;
        this.items[this.currentItem].onchange();
    }
}

Model.prototype.getCurrent = function () {
    return this.items[this.currentItem];
}

module.exports = Model;
},{"1":20,"2":14}],16:[function(require,module,exports){
"use strict";

//template engine based upon JsonML
var dom = require(2);
var helpers = require(3);
var texts = require(4);
var jungle = require(1);

require(5);

var currentGlobalKeyboadrFocus = "no";


function View(opts, txtOverride) {
    var self = this;
    this.uid = Math.random();
    currentGlobalKeyboadrFocus = this.uid;
    this.el = opts.el;
    this.els = {};
    this.evs = [];


    this.txt = texts(txtOverride);

    this.bottomBarClass = (opts.barAlign === "left") ? "" : ".eg-bar-right";

    this.handlers = helpers.extend({
        selection: helpers.noop,
        close: helpers.noop,
        error: null
    }, opts.handlers);

    //action handlers
    //this.selection = helpers.extend(this.selection, opts.selection);
    this.model = opts.model;

    //bind to model events
    this.model.onloading = helpers.bindThis(self, self.renderLoading);
    this.model.onupdate = function () {
        self.render();
        if (self.handlers.ready) {
            var runReady = self.handlers.ready;
            self.handlers.ready = null;
            setTimeout(runReady, 0);
        }
    }
    this.model.onerror = helpers.bindThis(this, this.errorHandler);

    this.model.onchange = function () {
        if (self.model.getSelected().length > 0) {
            self.els.ok.removeAttribute("disabled");
        } else {
            self.els.ok.setAttribute("disabled", "");
        }
    }

    //create reusable view elements
    this.els.back = jungle([["a.eg-filepicker-back.eg-btn"]]).childNodes[0];
    this.els.close = jungle([["a.eg-filepicker-close.eg-btn", this.txt("Cancel")]]).childNodes[0];
    this.els.ok = jungle([["span.eg-filepicker-ok.eg-btn", this.txt("Ok")]]).childNodes[0];
    this.els.pgup = jungle([["span.eg-filepicker-pgup.eg-btn", ">"]]).childNodes[0];
    this.els.pgdown = jungle([["span.eg-filepicker-pgup.eg-btn", "<"]]).childNodes[0];
    this.els.crumb = jungle([["span.eg-filepicker-path"]]).childNodes[0];
    this.els.selectAll = jungle([["input[type=checkbox]", {
        title: this.txt("Select all")
    }]]).childNodes[0];

    //bind events and store references to unbind later
    this.handleClick(this.el, self.focused); //maintains focus when multiple instances exist
    this.handleClick(this.els.back, self.goUp);
    this.handleClick(this.els.close, self.handlers.close);
    this.handleClick(this.els.ok, self.confirmSelection);
    this.handleClick(this.els.crumb, self.crumbNav);
    this.handleClick(this.els.selectAll, function (e) {
        self.model.setAllSelection(!!e.target.checked);
    });
    this.handleClick(this.els.pgup, function (e) {
        self.model.switchPage(1);
    });
    this.handleClick(this.els.pgdown, function (e) {
        self.model.switchPage(-1);
    });

    if (opts.keys !== false) {
        var keybinding = helpers.extend({
            "up": "<up>",
            "down": "<down>",
            "select": "<space>",
            "explore": "<right>",
            "back": "<left>",
            "confirm": "none",
            "close": "<escape>"
        }, opts.keys);
        var keys = {};
        keys[keybinding["up"]] = helpers.bindThis(self, self.kbNav_up);
        keys[keybinding["down"]] = helpers.bindThis(self, self.kbNav_down);
        keys[keybinding["select"]] = helpers.bindThis(self, self.kbNav_select);
        keys[keybinding["explore"]] = helpers.bindThis(self, self.kbNav_explore);
        keys[keybinding["back"]] = helpers.bindThis(self.model, self.model.goUp);
        keys[keybinding["confirm"]] = helpers.bindThis(self, self.confirmSelection);
        keys[keybinding["close"]] = helpers.bindThis(self, self.handlers.close);

        document.activeElement && document.activeElement.blur();
        this.evs.push(dom.onKeys(document, keys, helpers.bindThis(self, self.hasFocus)));
    }

}

var viewPrototypeMethods = {};

viewPrototypeMethods.destroy = function () {
    helpers.each(this.evs, function (ev) {
        ev.destroy();
    });
    this.evs = null;
    this.el.innerHTML = "";
    this.el = null;
    this.els = null;
    this.model = null;
    this.handlers = null;
}

viewPrototypeMethods.handleClick = function (el, method) {
    this.evs.push(dom.addListener(el, "click", helpers.bindThis(this, method)));
}

viewPrototypeMethods.errorHandler = function (e) {
    if (this.handlers.error) {
        var message = this.handlers.error(e);
        if (typeof message === "string") {
            this.renderProblem("*", message);
        } else {
            if (message === false) {
                return;
            }
            this.renderProblem(~~(e.statusCode), e.message);
        }
    } else {
        this.renderProblem(~~(e.statusCode), e.message);
    }
}


//================================================================= 
// rendering
//================================================================= 
viewPrototypeMethods.render = function () {
    var self = this;

    this.els.list = document.createElement("ul");

    var topbar = ["div.eg-filepicker-bar"];
    if (this.model.isMultiselectable) {
        this.els.selectAll.checked = false;
        topbar.push(this.els.selectAll);
    }
    topbar.push(this.els.back);
    topbar.push(this.els.crumb);

    var layoutFragm = jungle([["div.eg-theme.eg-filepicker",
        topbar,
        this.els.list,
        ["div.eg-filepicker-bar" + this.bottomBarClass,
            this.els.ok,
            this.els.close,
            ["div.eg-filepicker-pager" + (this.model.hasPages ? "" : ".eg-not"),
                this.els.pgdown,
                ["span", this.model.page + "/" + this.model.totalPages],
                this.els.pgup
            ]
        ]
    ]]);

    this.el.innerHTML = "";
    this.el.appendChild(layoutFragm);

    this.breadcrumbify(this.model.path);

    if (this.model.isEmpty) {
        this.renderEmpty();
    } else {
        helpers.each(this.model.items, function (item) {
            self.renderItem(item);
        });
    }


}


viewPrototypeMethods.renderItem = function (itemModel) {
    var self = this;

    var itemName = jungle([["a.eg-filepicker-name",
        ["span.eg-ico.eg-filepicker-" + ((itemModel.data.is_folder) ? "folder" : "file.eg-mime-" + itemModel.mime),
            {
                "data-ext": itemModel.ext
            },
            ["span", itemModel.ext]
        ], itemModel.data.name]]).childNodes[0];

    var itemCheckbox = jungle([["input[type=checkbox]" + (itemModel.isSelectable ? "" : ".eg-not")]]).childNodes[0];
    itemCheckbox.checked = itemModel.selected;



    var itemNode = jungle([["li.eg-filepicker-item",
        itemCheckbox,
        itemName
    ]]).childNodes[0];

    dom.addListener(itemName, "click", function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        itemModel.defaultAction();
        return false;
    });

    dom.addListener(itemNode, "click", function (e) {
        itemModel.toggleSelect();
    });

    itemModel.onchange = function () {
        itemCheckbox.checked = itemModel.selected;
        itemNode.setAttribute("aria-selected", itemModel.isCurrent);
        if (itemModel.isCurrent) {
            self.els.list.scrollTop = itemNode.offsetTop - self.els.list.offsetHeight
            //itemNode.scrollIntoView(false);
        }
    };

    this.els.list.appendChild(itemNode);
}


viewPrototypeMethods.breadcrumbify = function (path) {
    var list = path.split("/");
    var crumbItems = [];
    var currentPath = "/";
    var maxSpace = ~~ (100 / list.length); //assigns maximum space for text
    helpers.each(list, function (folder, num) {
        if (folder) {
            currentPath += folder + "/";
            num > 1 && (crumbItems.push(["a", "/"]));
            crumbItems.push(["a", {
                    "data-path": currentPath,
                    "title": folder,
                    "style": "max-width:" + maxSpace + "%"
                },
                folder]);

        } else {
            if (num === 0) {
                crumbItems.push(["a", {
                    "data-path": currentPath
                }, "/"]);
            }
        }
    });
    this.els.crumb.innerHTML = "";
    this.els.crumb.appendChild(jungle([crumbItems]));

}



viewPrototypeMethods.renderLoading = function () {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-placeholder", ["div.eg-spinner"], this.txt("Loading")]]));
    }
}


var msgs = {
    "404": "This item doesn't exist (404)",
    "403": "Access denied (403)",
    "409": "Forbidden location (409)",
    "4XX": "Incorrect API request",
    "5XX": "API server error, try again later",
    "0": "Browser error, try again",
    "?": "Unknown error"
}

viewPrototypeMethods.renderProblem = function (code, message) {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        message = msgs["" + code] || msgs[~(code / 100) + "XX"] || message || msgs["?"];
        this.els.list.appendChild(jungle([["div.eg-placeholder", ["div.eg-filepicker-error"], message]]));
    } else {
        this.handlers.close();
    }
}
viewPrototypeMethods.renderEmpty = function () {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-placeholder", ["div.eg-filepicker-folder"], this.txt("This folder is empty")]]));
    }
}

//================================================================= 
// focus
//================================================================= 

viewPrototypeMethods.hasFocus = function () {
    return currentGlobalKeyboadrFocus === this.uid;
}
viewPrototypeMethods.focused = function () {
    currentGlobalKeyboadrFocus = this.uid;
}
//================================================================= 
// navigation
//================================================================= 

viewPrototypeMethods.goUp = function () {
    this.model.goUp();
}
viewPrototypeMethods.confirmSelection = function () {
    var selected = this.model.getSelected();
    if (selected && selected.length) {
        this.handlers.selection.call(this, this.model.getSelected());
    }
}

viewPrototypeMethods.crumbNav = function (e) {
    var path = e.target.getAttribute("data-path");
    if (path) {
        this.model.fetch(path);
    }
}

viewPrototypeMethods.kbNav_up = function () {
    this.model.mvCurrent(-1);
}

viewPrototypeMethods.kbNav_down = function () {
    this.model.mvCurrent(1);
}
viewPrototypeMethods.kbNav_select = function () {
    this.model.getCurrent().toggleSelect();
}
viewPrototypeMethods.kbNav_confirm = function () {
    this.model.getCurrent().toggleSelect();
}

viewPrototypeMethods.kbNav_explore = function () {
    var item = this.model.getCurrent();
    if (item.data.is_folder) {
        item.defaultAction();
    }
}

View.prototype = viewPrototypeMethods;

module.exports = View;
},{"1":23,"2":19,"3":20,"4":22,"5":17}],17:[function(require,module,exports){
(function() { var head = document.getElementsByTagName('head')[0]; style = document.createElement('style'); style.type = 'text/css';var css = "@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,600);.eg-btn{display:inline-block;line-height:20px;height:20px;text-align:center;margin:0 4px;cursor:pointer}span.eg-btn{padding:4px 15px;background:#fafafa;border:1px solid #ccc;border-radius:2px}span.eg-btn[disabled]{opacity:.3}a.eg-btn{font-weight:600;padding:4px;border:1px solid transparent}.eg-filepicker a{cursor:pointer}.eg-filepicker a:hover{text-decoration:underline}.eg-filepicker,.eg-filepicker-bar{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;position:relative}.eg-filepicker{background:#fff;border:1px solid #dbdbdb;height:100%;padding:50px 0;color:#5e5f60;font-family:\'Open Sans\',sans-serif;font-size:12px}.eg-filepicker *{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle}.eg-filepicker input{margin:10px 20px}.eg-filepicker ul{padding:0;margin:0;height:100%;overflow-y:scroll}.eg-filepicker-bar{z-index:1;height:50px;padding:10px 4px;background:#f1f1f1;outline:1px solid #dbdbdb;overflow:hidden}.eg-filepicker-bar:nth-child(1){margin-top:-50px;padding-left:0;background:#fff}.eg-filepicker-bar>*{float:left}.eg-bar-right>*{float:right}.eg-not{visibility:hidden}.eg-filepicker-pager{float:right;margin:0 10px}.eg-bar-right>.eg-filepicker-pager{float:left}.eg-btn.eg-filepicker-ok{background:#3191f2;border-color:#2b82d9;color:#fff}.eg-filepicker-path{min-width:60%;width:calc(100% - 96px);line-height:30px}.eg-filepicker-path>a{color:#838383;font-size:14px;white-space:nowrap;display:inline-block;overflow:hidden;text-overflow:ellipsis}.eg-filepicker-path>a:last-child{color:#5e5f60;font-size:16px}.eg-filepicker-item{line-height:1.2em;list-style:none;padding:4px 0;border-bottom:1px solid #f2f3f3}.eg-filepicker-item:hover{background:#f1f5f8;outline:1px solid #dbdbdb}.eg-filepicker-item[aria-selected=true]{background:#dde9f3}.eg-filepicker-item *{display:inline-block}.eg-btn.eg-filepicker-back{padding:4px 10px;position:relative}.eg-btn.eg-filepicker-back::before{content:\"\";display:block;left:4px;border:0 solid #838383;border-width:0 0 3px 3px;transform:rotate(45deg);width:7px;height:7px;position:absolute;bottom:10px}@-webkit-keyframes egspin{to{transform:rotate(360deg)}}@keyframes egspin{to{transform:rotate(360deg)}}.eg-placeholder{margin:33%;margin:calc(50% - 88px);margin-bottom:0;text-align:center}.eg-placeholder>div{margin:0 auto 5px}.eg-placeholder>.eg-spinner{content:\"\";-webkit-animation:egspin 1s infinite linear;animation:egspin 1s infinite linear;width:30px;height:30px;border:solid 7px;border-radius:50%;border-color:transparent transparent #dbdbdb}.eg-filepicker-error:before{content:\"?!\";font-size:32px;border:2px solid #5e5f60;padding:0 10px}.eg-ico{margin-right:10px}.eg-mime-audio{background:#94cbff}.eg-mime-video{background:#8f6bd1}.eg-mime-pdf{background:#e64e40}.eg-mime-word_processing{background:#4ca0e6}.eg-mime-spreadsheet{background:#6bd17f}.eg-mime-presentation{background:#fa8639}.eg-mime-cad{background:#f2d725}.eg-mime-text{background:#9e9e9e}.eg-mime-image{background:#d16bd0}.eg-mime-code{background:#a5d16b}.eg-mime-archive{background:#d19b6b}.eg-mime-goog{background:#0266C8}.eg-mime-unknown{background:#dbdbdb}.eg-filepicker-file{width:40px;height:40px;text-align:right}.eg-filepicker-file>span{text-align:center;font-size:13.33333333px;line-height:18px;font-weight:300;margin:10px 0;height:20px;width:32px;background:rgba(0,0,0,.15);color:#fff;cursor:default}.eg-filepicker-folder{background:#e1e1ba;border:#d4d8bd .1em solid;border-radius:.1em;border-top-left-radius:0;font-size:10px;margin-top:.75em;height:2.8em;overflow:visible;width:4em;position:relative}.eg-filepicker-folder:before{display:block;position:absolute;top:-.5em;left:-.1em;border:#d1dabc .1em solid;border-bottom:0;background:#dfe4b9;content:\" \";width:60%;height:.5em}.eg-filepicker-folder:after{display:block;position:absolute;top:.3em;height:2.4em;left:0;width:100%;background:#f3f7d3;content:\" \"}.eg-filepicker-folder>span{display:none}";if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style);}())

},{}],18:[function(require,module,exports){
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

},{"1":1}],19:[function(require,module,exports){
var vkey = require(1);


function addListener(elem, type, callback) {
    var handler;
    if (elem.addEventListener) {
        handler = callback;
        elem.addEventListener(type, callback, false);

    } else {
        handler = function (e) {
            e = e || window.event; // get window.event if argument is falsy (in IE)
            e.target || (e.target = e.srcElement);
            var res = callback.call(this, e);
            if (res === false) {
                e.cancelBubble = true;
            }
            return res;
        };
        elem.attachEvent("on" + type, handler);
    }

    return {
        destroy: function () {
            removeListener(elem, type, handler);
        }
    }
}

function removeListener(elem, type, handler) {
    if (elem.removeEventListener) {
        elem.removeEventListener(type, handler, false);
    } else if (elem.detachEvent) {
        elem.detachEvent(type, handler);
    }
}



module.exports = {

    addListener: addListener,

    onKeys: function (elem, actions, hasFocus) {
        return addListener(elem, "keyup", function (ev) {
            ev.preventDefault && ev.preventDefault();
            if (hasFocus() && actions[vkey[ev.keyCode]]) {
                actions[vkey[ev.keyCode]]();
            }
            return false;
        });
    },

    createFrame: function (url) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("scrolling", "no");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.minWidth = "400px";
        iframe.style.minHeight = "400px";
        iframe.style.border = "1px solid #dbdbdb";
        iframe.src = url;
        return iframe;
    }

}

},{"1":2}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
var helpers = require(1);


//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {
        if (!sourceOrigin || helpers.normalizeURL(event.origin) === helpers.normalizeURL(sourceOrigin)) {
            var message = event.data;
            if (message.substr(0, 2) === marker) {
                try {
                    message = JSON.parse(message.substring(2));

                } catch (e) {
                    //broken? ignore
                }
                if (message) {
                    callback(message);
                }
            }
        }
    };
}

function sendMessage(targetWindow, channel, action, dataString) {
    var targetOrigin = "*";

    if (typeof dataString !== "string" || typeof action !== "string") {
        throw new TypeError("only string is acceptable as action and data");
    }

    try {
        targetOrigin = targetWindow.location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    } catch (E) {}

    dataString = dataString.replace(/"/gm, '\\"').replace(/(\r\n|\n|\r)/gm, "");
    targetWindow.postMessage(channel.marker + '{"action":"' + action + '","data":"' + dataString + '"}', targetOrigin);
}

module.exports = {
    sendMessage: sendMessage,
    createMessageHandler: createMessageHandler
}

},{"1":20}],22:[function(require,module,exports){
module.exports = function (overrides) {
    return function (txt) {
        if (overrides) {
            if (overrides[txt]) {
                return overrides[txt];
            } else if (overrides[txt.toLowerCase()]) {
                return overrides[txt.toLowerCase()];
            }
        }
        return txt;
    };
};
},{}],23:[function(require,module,exports){
var zenjungle = (function () {
    // helpers
    var is_object = function (object) {
            return (!!object && '[object Object]' == Object.prototype.toString.call(object) && !object.nodeType);
        },
        is_array = function (object) {
            return '[object Array]' == Object.prototype.toString.call(object);
        },
        each = function (object, callback) {
            var key;
            if (object) {
                if (object.length) {
                    for (key = 0; key < object.length; key++) {
                        callback(object[key], key);
                    }
                } else {
                    for (key in object) {
                        object.hasOwnProperty(key) && callback(object[key], key);
                    }
                }
            }
        },
        merge = function () {
            var merged = {}

            each(arguments, function (arg) {
                each(arg, function (value, key) {
                    merged[key] = value;
                })
            });

            return merged;
        }

    // converts some patterns to properties
    var zen = function (string) {
        var replace = {
                '\\[([a-z\\-]+)=([^\\]]+)\\]': function (match) {
                    var prop = {};
                    prop[match[1]] = match[2].replace(/^["']/, '').replace(/["']$/, '');

                    return prop;
                },
                '#([a-zA-Z][a-zA-Z0-9\\-_]*)': function (match) {
                    return {
                        'id': match[1]
                    };
                },
                '(\\.[a-zA-Z][a-zA-Z0-9\\-_]*)+': function (match) {
                    return {
                        'class': match[0].substr(1).split(".").join(" ")
                    };
                }
            },
            props = {};

        each(replace, function (parser, regex) {
            var match;

            regex = new RegExp(regex);

            while (regex.test(string)) {
                match = regex.exec(string);
                string = string.replace(match[0], '');

                props = merge(props, parser(match));
            }
        });

        return [string, props];
    }

    var monkeys = function (what, where) {
        where = where || document.createDocumentFragment();

        each(what, function (element) {
            var zenned,
                props,
                new_el;

            if (is_array(element)) {

                if ('string' === typeof element[0]) {
                    zenned = zen(element.shift());
                    props = is_object(element[0]) ? element.shift() : {};
                    new_el = document.createElement(zenned[0]);

                    each(merge(zenned[1], props), function (value, key) {
                        new_el.setAttribute(key, value);
                    });

                    where.appendChild(new_el);
                    monkeys(element, new_el);
                } else {
                    monkeys(element, where);
                }
            } else if (element.nodeType) {
                where.appendChild(element);
            } else if ('string' === typeof (element) || 'number' === typeof (element)) {
                where.appendChild(document.createTextNode(element));
            }
        });

        return where;
    }

    return monkeys;
})();

if (typeof module !== "undefined") {
    module.exports = zenjungle;
}
},{}]},{},[7])