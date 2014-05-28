(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function (process){
/*
 * PinkySwear.js 2.0 - Minimalistic implementation of the Promises/A+ spec
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
 * Google Closure Compiler and gzipping it weighs less than 500 bytes. It is based on the implementation for 
 * Minified.js and should be perfect for embedding. 
 *
 *
 * PinkySwear has just four functions.
 *
 * To create a new promise in pending state, call pinkySwear():
 *         var promise = pinkySwear();
 *
 * The returned object has a Promises/A+ compatible then() implementation:
 *          promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 *
 *
 * The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
 * an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
 * value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument: 
 *         promise(true, [42]);
 *
 * When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
 *         promise(true, [6, 6, 6]);
 *         
 * You can obtain the promise's current state by calling the function without arguments. It will be true if fulfilled,
 * false if rejected, and otherwise undefined.
 * 		   var state = promise();
 *
 * PinkySwear has two convenience functions. always(func) is the same as then(func, func) and thus will always be called, no matter what the
 * promises final state is:
 *          promise.always(function(value) { alert("Done!"); });
 *
 * error(func) is the same as then(0, func), and thus the handler will only be called on error:
 *          promise.error(function(value) { alert("Failure!"); });
 *          
 * 
 * https://github.com/timjansen/PinkySwear.js
 */
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


}).call(this,require("FWaASH"))
},{"FWaASH":1}],3:[function(require,module,exports){
var window = require("global/window")
var once = require("once")

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
            var message = xhr.responseText ||
                messages[String(xhr.status).charAt(0)]
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

},{"global/window":4,"once":5}],4:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
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
(function () {
    "use strict";

    var helpers = require('./lib/reusables/helpers');
    var options = {};

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        var api = require("./lib/api")(options);

        return {
            domain: options.egnyteDomainURL,
            filePicker: require("./lib/filepicker/byapi")(api),
            filePickerRemote: require("./lib/filepicker/bysession")(options),
            API: api
        }

    }

    window.Egnyte = {
        init: init
    }

})();
},{"./lib/api":7,"./lib/filepicker/byapi":11,"./lib/filepicker/bysession":12,"./lib/reusables/helpers":18}],7:[function(require,module,exports){
var APIMain = require("./api_elements/main");
var storageFacade = require("./api_elements/storage");
var linkFacade = require("./api_elements/link");


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
},{"./api_elements/link":8,"./api_elements/main":9,"./api_elements/storage":10}],8:[function(require,module,exports){
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
},{"../promises":16,"../reusables/helpers":18}],9:[function(require,module,exports){
var oauthRegex = /access_token=([^&]+)/;

var token;
var options;

var promises = require('../promises');
var xhr = require("xhr");


function requestTokenInplace(callback) {
    if (!token) {
        var access = oauthRegex.exec(window.location.hash);

        if (access) {
            if (access.length > 1) {

                token = access[1];
                callback();

            } else {
                //what now?
            }
        } else {
            window.location.href = options.egnyteDomainURL + "/puboauth/token?client_id=" + options.key + "&mobile=" + ~~(options.mobile) + "&redirect_uri=" + window.location.href;
        }
    } else {
        callback();
    }
}

//TODO: implement popup flow
function requestTokenWindow(callback, pingbackURL) {
    if (!token) {
        var dialog = window.open(options.egnyteDomainURL + "/puboauth/token?client_id=" + options.key + "&mobile=" + ~~(options.mobile) + "&redirect_uri=" + pingbackURL);

        //listen for a postmessage from window that gives you a token 
    } else {
        callback();
    }

}

function authorizeXHR(xhr) {
    //assuming token_type was bearer, no use for XHR otherwise, right?
    xhr.setRequestHeader("Authorization", "Bearer " + token);
}

function getHeaders() {
    return {
        "Authorization": "Bearer " + token
    };
}

function getEndpoint() {
    return options.egnyteDomainURL + "/pubapi/v1";
}

function isAuthorized() {
    return !!token;
}

function getToken() {
    return token;
}

function setToken(externalToken) {
    token = externalToken;
}


function dropToken(externalToken) {
    token = null;
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

function sendRequest(opts, callback) {
    if (isAuthorized()) {
        if (opts.params) {
            opts.url += "?" + params(opts.params);
        }
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = "Bearer " + getToken();
        return xhr(opts, function (error, response, body) {
            try {
                //this shouldn't be required, but server sometimes responds with content-type text/plain
                body = JSON.parse(body);
            } catch (e) {}
            callback.call(this, error, response, body);
        });
    } else {
        callback.call(this, new Error("Not authorized"), {
            statusCode: 0
        }, null);
    }

}

function promiseRequest(opts) {
    var defer = promises.defer();
    try {
        sendRequest(opts, function (error, response, body) {
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
    return defer.promise;
}

module.exports = function (opts) {
    options = opts;

    if (options.token) {
        setToken(options.token);
    }

    return {
        isAuthorized: isAuthorized,
        setToken: setToken,
        requestToken: requestTokenInplace,
        authorizeXHR: authorizeXHR,
        getHeaders: getHeaders,
        getToken: getToken,
        dropToken: dropToken,
        getEndpoint: getEndpoint,
        sendRequest: sendRequest,
        promiseRequest: promiseRequest
    };
};
},{"../promises":16,"xhr":3}],10:[function(require,module,exports){
var promises = require('../promises');
var helpers = require('../reusables/helpers');

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
        if (result.response.statusCode == 404) {
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

function download(pathFromRoot) {
    return promises.start(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        return api.promiseRequest({
            method: "GET",
            url: api.getEndpoint() + fscontent + encodeURI(pathFromRoot),
        });
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
},{"../promises":16,"../reusables/helpers":18}],11:[function(require,module,exports){
(function () {

    var helpers = require("../reusables/helpers");
    var dom = require("../reusables/dom");
    var View = require("../filepicker_elements/view");
    var Model = require("../filepicker_elements/model");

    var defaults = {};

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
                handlers: {
                    ready: setup.ready,
                    selection: function (item) {
                        setup.selection(item);
                        close();
                    },
                    close: function () {
                        setup.cancel();
                        close();
                    }
                }
            });

            fpModel.fetch(setup.path || "/");

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();
},{"../filepicker_elements/model":13,"../filepicker_elements/view":14,"../reusables/dom":17,"../reusables/helpers":18}],12:[function(require,module,exports){
(function () {

    var helpers = require('../reusables/helpers');
    var dom = require('../reusables/dom');
    var messages = require('../reusables/messages');

    var defaults = {
        filepickerViewAddress: "folderExplorer.html",
        channelMarker: "'E"
    };


    function listen(channel, callback) {
        channel.handler = messages.createMessageHandler(channel.sourceOrigin, channel.marker, callback);
        dom.addListener(window, "message", channel.handler);
    }

    function destroy(channel, iframe) {
        dom.removeListener(window, "message", channel.handler);
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
        options = helpers.extend(defaults, options);

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
},{"../reusables/dom":17,"../reusables/helpers":18,"../reusables/messages":19}],13:[function(require,module,exports){
var helpers = require("../reusables/helpers");


var fileext = /.*\.([a-z0-9]*)$/i;

function getExt(name) {
    if (fileext.test(name)) {
        return name.replace(fileext, "$1");
    } else {
        return "";
    }
}


//Item model
function Item(data, parent) {
    this.data = data;
    if (!this.data.is_folder) {
        this.ext = getExt(data.name);
    } else {
        this.ext = "";
    }
    this.isSelectable = ((parent.opts.select.folder && data.is_folder) || (parent.opts.select.file && !data.is_folder));
    this.parent = parent;
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

    // Waiting for requirements
    //    else {
    //        //when folders arent selectable, default to opening too
    //        if (this.data.is_folder) {
    //            this.parent.fetch(this.data.path);
    //        }
    //    }
};

//Collection
function Model(API, opts) {
    this.opts = opts;
    this.API = API;
}

var mock = {
    path: "/Mock/folder",
    name: "folder",
    folders: [
        {
            path: "/Mock/folder/foo",
            name: "foo",
            is_folder: true
        }
    ],
    files: [
        {
            path: "/Mock/folder/bar",
            name: "bar.png",
            is_folder: false
        }
    ]
};

Model.prototype.onloading = helpers.noop;
Model.prototype.onupdate = helpers.noop;
Model.prototype.onerror = helpers.noop;

Model.prototype.set = function (m) {
    var self = this;
    this.path = m.path;
    this.items = [];
    helpers.each(m.folders, function (f) {
        self.items.push(new Item(f, self));
    });
    //ignore files if they're not selectable
    if (this.opts.select.file) {
        helpers.each(m.files, function (f) {
            self.items.push(new Item(f, self));
        });
    }

    this.onupdate();
    this.onchange();
};

Model.prototype.fetch = function (path) {
    var self = this;
    if (path) {
        this.path = path;
    }
    self.onloading();
    self.API.storage.get(this.path).then(function (m) {
        self.set(m);
    }).error(function (e) {
        this.onerror();
    });
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

module.exports = Model;
},{"../reusables/helpers":18}],14:[function(require,module,exports){
"use strict";

//template engine based upon JsonML
var dom = require("../reusables/dom");
var helpers = require("../reusables/helpers");
var jungle = require("../../vendor/zenjungle");

require("./view.less");

var moduleClass = "eg-filepicker";



function View(opts) {
    var self = this;
    this.el = opts.el;
    this.els = {};

    this.handlers = helpers.extend({
        selection: helpers.noop,
        close: helpers.noop
    }, opts.handlers);
    this.selection = helpers.extend(this.selection, opts.selection);
    this.model = opts.model;
    //bind to model changes
    this.model.onloading = function () {
        self.loading();
    }
    this.model.onupdate = function () {
        self.render();
        if (self.handlers.ready) {
            var runReady = self.handlers.ready;
            self.handlers.ready = null;
            setTimeout(runReady, 0);
        }
    }
    this.model.onerror = function () {
        //handle error messaging
    }

    this.model.onchange = function () {
        if (self.model.getSelected().length > 0) {
            self.els.ok.removeAttribute("disabled");
        } else {
            self.els.ok.setAttribute("disabled", "");
        }
    }

    //create reusable view elements
    var back = jungle([["span",
        {
            "class": "eg-filepicker-back eg-btn"
        }, "<"]]);
    this.els.back = back.childNodes[0];
    var close = jungle([["span",
        {
            "class": "eg-filepicker-close eg-btn",
            "disabled":""
        }, "Cancel"]]);
    this.els.close = close.childNodes[0];

    var ok = jungle([["span",
        {
            "class": "eg-filepicker-ok eg-btn"
        }, "Ok"]]);
    this.els.ok = ok.childNodes[0];


    dom.addListener(this.els.back, "click", function (e) {
        self.model.goUp();
    });
    dom.addListener(this.els.close, "click", function (e) {
        self.handlers.close.call(self, e);
    });
    dom.addListener(this.els.ok, "click", function (e) {
        var selected = self.model.getSelected();
        if (selected && selected.length) {
            self.handlers.selection.call(self, self.model.getSelected());
        }
    });

}

View.prototype.render = function () {
    var self = this;

    this.els.list = document.createElement("ul");

    var layoutFragm = jungle([["div.eg-filepicker",
        ["div.eg-filepicker-bar",
            this.els.back,
            ["span.eg-filepicker-path", this.model.path]
        ],
        this.els.list,
        ["div.eg-filepicker-bar",
            this.els.ok,
            this.els.close
        ]
    ]]);

    this.el.innerHTML = "";
    this.el.appendChild(layoutFragm);

    helpers.each(this.model.items, function (item) {
        self.renderItem(item);
    });


}

View.prototype.renderItem = function (itemModel) {
    var self = this;

    var itemName = jungle([["span.eg-filepicker-name", itemModel.data.name]]).childNodes[0];
    var itemCheckbox = jungle([["input[type=checkbox]" + (itemModel.isSelectable ? "" : ".eg-not")]]).childNodes[0];
    itemCheckbox.checked = itemModel.selected;

    itemModel.onchange = function () {
        itemCheckbox.checked = itemModel.selected;
    };

    var itemFragm = jungle([["li.eg-filepicker-item",
        itemCheckbox,
        ["span.eg-filepicker-ico-" + ((itemModel.data.is_folder) ? "folder" : "file"),
            {
                "data-ext": itemModel.ext
            },
            ["span", itemModel.ext]
        ],
        itemName
    ]]);
    var itemNode = itemFragm.childNodes[0];

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

    this.els.list.appendChild(itemFragm);
}



View.prototype.loading = function () {
    var that = this;
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-spinner", ["div"], "loading"]]));
    }
}

View.prototype.destroy = function () {
    this.el.innerHTML = "";
    this.el = null;
    this.els = null;
    this.model = null;
    this.handlers = null;
}





module.exports = View;
},{"../../vendor/zenjungle":20,"../reusables/dom":17,"../reusables/helpers":18,"./view.less":15}],15:[function(require,module,exports){
(function() { var head = document.getElementsByTagName('head')[0]; style = document.createElement('style'); style.type = 'text/css';var css = ".eg-btn{display:inline-block;line-height:20px;padding:4px 18px;text-align:center;margin-right:8px;background-color:#fafafa;border:1px solid #ccc;border-radius:2px;cursor:pointer}.eg-filepicker{border:1px solid #dbdbdb;color:#5e5f60;font-family:sans-serif;font-size:13px;position:relative}.eg-filepicker *{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.eg-filepicker ul{padding:0;margin:0;height:400px;overflow-y:scroll}.eg-filepicker-bar{outline:1px solid #dbdbdb;padding:4px;background:#f1f1f1}.eg-filepicker-ok{background-color:#3191f2;border-color:#2b82d9;color:#fff}.eg-filepicker-ok[disabled]{opacity:.3}.eg-filepicker-back{padding:4px 10px;position:relative}.eg-filepicker-back::before{bottom:4px;right:12px;position:absolute;border:10px solid transparent;border-right:10px solid #5e5f60;content:\"\"}.eg-filepicker-item{line-height:1.2em;list-style:none;padding:4px 0}.eg-filepicker-item:hover{background-color:#f1f5f8;outline:1px solid #dbdbdb}.eg-filepicker-item *{vertical-align:middle;display:inline-block}.eg-filepicker-item input{margin:8px}.eg-filepicker-item input.eg-not{visibility:hidden}.eg-filepicker-name{margin-left:.3em;cursor:pointer}.eg-filepicker-name:hover{text-decoration:underline}.eg-filepicker-ico-file{width:40px;height:40px;background:#dbdbdb;text-align:right}.eg-filepicker-ico-file>span{text-align:center;font-size:14.28571429px;line-height:20px;font-weight:300;margin:10px 0;height:20px;width:32px;background:rgba(0,0,0,.15);color:#fff;cursor:default}.eg-filepicker-ico-folder{background-color:#e1e1ba;border:#d4d8bd .1em solid;border-radius:.1em;border-top-left-radius:0;font-size:10px;margin-top:.75em;height:2.8em;overflow:visible;width:4em;position:relative}.eg-filepicker-ico-folder:before{display:block;position:absolute;top:-.5em;left:-.1em;border:#d1dabc .1em solid;border-radius:.2em;border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0;background-color:#dfe4b9;content:\" \";width:60%;height:.5em}.eg-filepicker-ico-folder:after{display:block;position:absolute;top:.3em;height:2.4em;left:0;width:100%;border-top-left-radius:.3em;border-top-right-radius:.3em;background-color:#f3f7d3;content:\" \"}.eg-filepicker-ico-folder>span{display:none}@-webkit-keyframes egspin{to{transform:rotate(360deg)}}@keyframes egspin{to{transform:rotate(360deg)}}.eg-spinner{margin:40%;margin:calc(50% - 42px)}.eg-spinner>div{content:\"\";-webkit-animation:egspin 1s infinite linear;animation:egspin 1s infinite linear;width:30px;height:30px;border:solid 7px;border-radius:50%;border-color:transparent transparent #dbdbdb}";if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style);}())
},{}],16:[function(require,module,exports){
//wrapper for any promises library
var pinkySwear = require('pinkyswear');

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
},{"pinkyswear":2}],17:[function(require,module,exports){
module.exports = {

    addListener: function (elem, type, callback) {
        if (elem.addEventListener) {
            elem.addEventListener(type, callback, false);
        } else {
            elem.attachEvent("on" + type, function (e) {
                e = e || window.event; // get window.event if argument is falsy (in IE)
                e.target || (e.target = e.srcElement);
                var res = callback.call(this, e);
                if (res === false) {
                    e.cancelBubble = true;
                }
                return res;
            });
        }
    },

    removeListener: function (elem, type, callback) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, callback, false);
        } else if (elem.detachEvent) {
            //no can do
        }
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
},{}],18:[function(require,module,exports){
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
                    if (arguments[i].hasOwnProperty(k)) {
                        target[k] = arguments[i][k];
                    }
                }
            }
        }
        return target;
    },
    noop: function () {},
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
            name2.push(e.replace(/[^a-z0-9 ]*/gi, ""));
        });
        name2 = name2.join("/").replace(/^\/\//, "/");

        return (name2);
    }
};
},{}],19:[function(require,module,exports){
var helpers = require('../reusables/helpers');


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
},{"../reusables/helpers":18}],20:[function(require,module,exports){
/**
 * zenjungle - HTML via JSON with elements of Zen Coding
 *
 * https://github.com/radmen/zenjungle
 * Copyright (c) 2012 Radoslaw Mejer <radmen@gmail.com>
 */

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
                '\\.([a-zA-Z][a-zA-Z0-9\\-_]*)': function (match) {
                    return {
                        'class': match[1]
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
},{}]},{},[6])