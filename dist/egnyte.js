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
process.once = noop;
process.off = noop;
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


}).call(this,require("/home/zb/repo/_git/egnyte-widget/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/home/zb/repo/_git/egnyte-widget/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":1}],3:[function(require,module,exports){
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
        Object.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, headers[key])
        })
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

    var helpers = require('./lib/helpers');
    var options = {};

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            filePicker: require("./lib/filepicker")(options),
            API:  require("./lib/api")(options)
        }

    }

    window.EgnyteWidget = {
        init: init
    }

})();
},{"./lib/api":7,"./lib/filepicker":10,"./lib/helpers":11}],7:[function(require,module,exports){
var authHelper = require("./api_elements/auth");
var storageFacade = require("./api_elements/storage");


module.exports = function (options) {
    var auth = authHelper(options);
    var storage = storageFacade(auth, options);

    return {
        auth: auth,
        storage: storage
    };
};
},{"./api_elements/auth":8,"./api_elements/storage":9}],8:[function(require,module,exports){
var oauthRegex = /access_token=([^&]+)/;

var token;
var options;

var xhr = require("xhr");
var quota = /<h1>Developer Over Qps<\/h1>/gi;


function authenticateInplace(callback) {
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
function authenticateWindow(callback, pingbackURL) {
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

function isAuthenticated() {
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

function sendRequest(opts, callback) {
    if (isAuthenticated()) {
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = "Bearer " + getToken();
        return xhr(opts, function (error, response, body) {
            if (response.statusCode == 403 && quota.test(response.responseText)) {
                throw new Error("Developer Over Qps");
            } else {
                callback.apply(this, arguments);
            }
        });
    } else {
        throw new Error("Not authenticated");
    }

}

module.exports = function (opts) {
    options = opts;

    if (options.token) {
        setToken(options.token);
    }

    return {
        isAuthenticated: isAuthenticated,
        setToken: setToken,
        authenticate: authenticateInplace,
        authorizeXHR: authorizeXHR,
        getHeaders: getHeaders,
        getToken: getToken,
        dropToken: dropToken,
        getEndpoint: getEndpoint,
        sendRequest: sendRequest
    };
};
},{"xhr":3}],9:[function(require,module,exports){
//porting from nodejs app in progress

var promises = require('../promises');

var api;
var options;

var fsmeta = "/fs";
var fscontent = "/fs-content";


function encodeNameSafe(name) {
    name.split("/").map(function (e) {
        return e.replace(/[^a-z0-9 ]*/gi, "");
    })
        .join("/")
        .replace(/^\//, "");

    return (name);
}

function exists(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        if (response.statusCode == 200) {
            defer.resolve(true);
        } else {
            defer.resolve(false);
        }
    });
    return defer.promise;
}

function get(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        defer.resolve(JSON.parse(body));
    });
    return defer.promise;
}

function download(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + fscontent + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        defer.resolve(response);
    });
    return defer.promise;
}

function createFolder(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";
    api.sendRequest({
        method: "POST",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
        json: {
            "action": "add_folder"
        }
    }, function (error, response, body) {
        if (response.statusCode == 201) {
            defer.resolve({
                path: pathFromRoot
            });
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function move(pathFromRoot, newPath) {
    if (!newPath) {
        throw new Error("Cannot move to empty path");
    }
    var defer = promises.defer();
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";
    newPath = encodeNameSafe(newPath);
    api.sendRequest({
        method: "POST",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
        json: {
            "action": "move",
            "destination": "/" + newPath,
        }
    }, function (error, response, body) {
        if (response.statusCode == 200) {

            defer.resolve({
                oldPath: pathFromRoot,
                path: newPath
            });
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}


function storeFile(pathFromRoot, fileOrBlob) {
    if (!window.FormData) {
        throw new Error("Unsupported browser");
    }
    var defer = promises.defer();
    var file = fileOrBlob;
    var formData = new window.FormData();
    formData.append('file', file);
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "POST",
        url: api.getEndpoint() + fscontent + "/" + encodeURI(pathFromRoot),
        body: formData,
    }, function (error, response, body) {
        if (response.statusCode === 200 || response.statusCode === 201) {
            defer.resolve({
                id: response.getResponseHeader("etag"),
                path: pathFromRoot
            });
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function remove(pathFromRoot, versionEntryId) {
    pathFromRoot = encodeNameSafe(pathFromRoot) || "";
    var opts = {
        method: "DELETE",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    };
    var defer = promises.defer();
    if (versionEntryId) {
        opts.url += "?entry_id=" + versionEntryId;
    }
    api.sendRequest(opts, function (error, response, body) {
        if (response.statusCode == 200 /*|| response.statusCode == 404*/ ) {
            defer.resolve();
        } else {
            defer.reject(response.statusCode);
        }
    });
    return defer.promise;
}

function removeFileVersion(pathFromRoot, versionEntryId) {
    if (!versionEntryId) {
        throw new Error("Version ID (second argument) is missing");
    }
    return remove(pathFromRoot, versionEntryId)
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
},{"../promises":12}],10:[function(require,module,exports){
(function () {

    var helpers = require('./helpers');
    var dom = require('./reusables/dom');
    var messages = require('./reusables/messages');

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

        filePicker = function (node, callback, cancelCallback) {
            var iframe;
            var channel = {
                marker: options.channelMarker,
                sourceOrigin: options.egnyteDomainURL
            };
            //informs the view to open a certain location
            var sendOpenAt = function () {
                if (options.openAt) {
                    messages.sendMessage(iframe.contentWindow, channel, "openAt", options.openAt);
                }
            }
            var close = function () {
                destroy(channel, iframe);
            };
            var openAt = function (location) {
                options.openAt = location;
                if (ready) {
                    sendOpenAt();
                }
            };
            
            
            iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.filepickerViewAddress);

            listen(channel,
                actionsHandler(close, {
                    "selection": callback,
                    "cancel": cancelCallback,
                    "ready": function () {
                        ready = true;
                        sendOpenAt();
                    }
                })
            );

            node.appendChild(iframe);

            return {
                close: close,
                openAt: openAt
            };
        };

        return filePicker;

    }

    module.exports = init;


})();
},{"./helpers":11,"./reusables/dom":13,"./reusables/messages":15}],11:[function(require,module,exports){

function normalizeURL(url) {
    return (url).replace(/\/*$/, "");
}



//simple extend function
function extend(target) {
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
}

module.exports = {
    extend: extend,
    normalizeURL: normalizeURL
};
},{}],12:[function(require,module,exports){
//wrapper for any promises library
var pinkySwear = require('pinkyswear');

module.exports = {
    "defer": function () {
        var promise = pinkySwear();
        return {
            promise: promise,
            resolve: function (result) {
                promise(true, [result]);
            },
            reject: function (result) {
                promise(true, [result]);
            }
        }
    }
}
},{"pinkyswear":2}],13:[function(require,module,exports){
module.exports = {

    addListener: function (elem, type, callback) {
        if (elem.addEventListener) {
            elem.addEventListener(type, callback, false);
        } else {
            elem.attachEvent("on" + type, function (e) {
                e = e || window.event; // get window.event if argument is falsy (in IE)
                e.target || (e.target = e.srcElement);
                callback.call(this, e);
            });
        }
    },

    removeListener: function (elem, type, callback) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, callback, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, callback);
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
},{}],14:[function(require,module,exports){
/*
    json_parse_state.js
    2013-05-26

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    This file creates a json_parse function.

        json_parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = json_parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint regexp: true, unparam: true */

/*members "", "\"", ",", "\/", ":", "[", "\\", "]", acomma, avalue, b,
    call, colon, container, exec, f, false, firstavalue, firstokey,
    fromCharCode, go, hasOwnProperty, key, length, n, null, ocomma, okey,
    ovalue, pop, prototype, push, r, replace, slice, state, t, test, true,
    value, "{", "}"
*/

module.exports = (function () {
    "use strict";

// This function creates a JSON parse function that uses a state machine rather
// than the dangerous eval function to parse a JSON text.

    var state,      // The state of the parser, one of
                    // 'go'         The starting state
                    // 'ok'         The final, accepting state
                    // 'firstokey'  Ready for the first key of the object or
                    //              the closing of an empty object
                    // 'okey'       Ready for the next key of the object
                    // 'colon'      Ready for the colon
                    // 'ovalue'     Ready for the value half of a key/value pair
                    // 'ocomma'     Ready for a comma or closing }
                    // 'firstavalue' Ready for the first value of an array or
                    //              an empty array
                    // 'avalue'     Ready for the next value of an array
                    // 'acomma'     Ready for a comma or closing ]
        stack,      // The stack, for controlling nesting.
        container,  // The current container object or array
        key,        // The current key
        value,      // The current value
        escapes = { // Escapement translation table
            '\\': '\\',
            '"': '"',
            '/': '/',
            't': '\t',
            'n': '\n',
            'r': '\r',
            'f': '\f',
            'b': '\b'
        },
        string = {   // The actions for string tokens
            go: function () {
                state = 'ok';
            },
            firstokey: function () {
                key = value;
                state = 'colon';
            },
            okey: function () {
                key = value;
                state = 'colon';
            },
            ovalue: function () {
                state = 'ocomma';
            },
            firstavalue: function () {
                state = 'acomma';
            },
            avalue: function () {
                state = 'acomma';
            }
        },
        number = {   // The actions for number tokens
            go: function () {
                state = 'ok';
            },
            ovalue: function () {
                state = 'ocomma';
            },
            firstavalue: function () {
                state = 'acomma';
            },
            avalue: function () {
                state = 'acomma';
            }
        },
        action = {

// The action table describes the behavior of the machine. It contains an
// object for each token. Each object contains a method that is called when
// a token is matched in a state. An object will lack a method for illegal
// states.

            '{': {
                go: function () {
                    stack.push({state: 'ok'});
                    container = {};
                    state = 'firstokey';
                },
                ovalue: function () {
                    stack.push({container: container, state: 'ocomma', key: key});
                    container = {};
                    state = 'firstokey';
                },
                firstavalue: function () {
                    stack.push({container: container, state: 'acomma'});
                    container = {};
                    state = 'firstokey';
                },
                avalue: function () {
                    stack.push({container: container, state: 'acomma'});
                    container = {};
                    state = 'firstokey';
                }
            },
            '}': {
                firstokey: function () {
                    var pop = stack.pop();
                    value = container;
                    container = pop.container;
                    key = pop.key;
                    state = pop.state;
                },
                ocomma: function () {
                    var pop = stack.pop();
                    container[key] = value;
                    value = container;
                    container = pop.container;
                    key = pop.key;
                    state = pop.state;
                }
            },
            '[': {
                go: function () {
                    stack.push({state: 'ok'});
                    container = [];
                    state = 'firstavalue';
                },
                ovalue: function () {
                    stack.push({container: container, state: 'ocomma', key: key});
                    container = [];
                    state = 'firstavalue';
                },
                firstavalue: function () {
                    stack.push({container: container, state: 'acomma'});
                    container = [];
                    state = 'firstavalue';
                },
                avalue: function () {
                    stack.push({container: container, state: 'acomma'});
                    container = [];
                    state = 'firstavalue';
                }
            },
            ']': {
                firstavalue: function () {
                    var pop = stack.pop();
                    value = container;
                    container = pop.container;
                    key = pop.key;
                    state = pop.state;
                },
                acomma: function () {
                    var pop = stack.pop();
                    container.push(value);
                    value = container;
                    container = pop.container;
                    key = pop.key;
                    state = pop.state;
                }
            },
            ':': {
                colon: function () {
                    if (Object.hasOwnProperty.call(container, key)) {
                        throw new SyntaxError('Duplicate key "' + key + '"');
                    }
                    state = 'ovalue';
                }
            },
            ',': {
                ocomma: function () {
                    container[key] = value;
                    state = 'okey';
                },
                acomma: function () {
                    container.push(value);
                    state = 'avalue';
                }
            },
            'true': {
                go: function () {
                    value = true;
                    state = 'ok';
                },
                ovalue: function () {
                    value = true;
                    state = 'ocomma';
                },
                firstavalue: function () {
                    value = true;
                    state = 'acomma';
                },
                avalue: function () {
                    value = true;
                    state = 'acomma';
                }
            },
            'false': {
                go: function () {
                    value = false;
                    state = 'ok';
                },
                ovalue: function () {
                    value = false;
                    state = 'ocomma';
                },
                firstavalue: function () {
                    value = false;
                    state = 'acomma';
                },
                avalue: function () {
                    value = false;
                    state = 'acomma';
                }
            },
            'null': {
                go: function () {
                    value = null;
                    state = 'ok';
                },
                ovalue: function () {
                    value = null;
                    state = 'ocomma';
                },
                firstavalue: function () {
                    value = null;
                    state = 'acomma';
                },
                avalue: function () {
                    value = null;
                    state = 'acomma';
                }
            }
        };

    function debackslashify(text) {

// Remove and replace any backslash escapement.

        return text.replace(/\\(?:u(.{4})|([^u]))/g, function (a, b, c) {
            return b ? String.fromCharCode(parseInt(b, 16)) : escapes[c];
        });
    }

    return function (source, reviver) {

// A regular expression is used to extract tokens from the JSON text.
// The extraction process is cautious.

        var r,          // The result of the exec method.
            tx = /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/;

// Set the starting state.

        state = 'go';

// The stack records the container, key, and state for each object or array
// that contains another object or array while processing nested structures.

        stack = [];

// If any error occurs, we will catch it and ultimately throw a syntax error.

        try {

// For each token...

            for (;;) {
                r = tx.exec(source);
                if (!r) {
                    break;
                }

// r is the result array from matching the tokenizing regular expression.
//  r[0] contains everything that matched, including any initial whitespace.
//  r[1] contains any punctuation that was matched, or true, false, or null.
//  r[2] contains a matched number, still in string form.
//  r[3] contains a matched string, without quotes but with escapement.

                if (r[1]) {

// Token: Execute the action for this state and token.

                    action[r[1]][state]();

                } else if (r[2]) {

// Number token: Convert the number string into a number value and execute
// the action for this state and number.

                    value = +r[2];
                    number[state]();
                } else {

// String token: Replace the escapement sequences and execute the action for
// this state and string.

                    value = debackslashify(r[3]);
                    string[state]();
                }

// Remove the token from the string. The loop will continue as long as there
// are tokens. This is a slow process, but it allows the use of ^ matching,
// which assures that no illegal tokens slip through.

                source = source.slice(r[0].length);
            }

// If we find a state/token combination that is illegal, then the action will
// cause an error. We handle the error by simply changing the state.

        } catch (e) {
            state = e;
        }

// The parsing is finished. If we are not in the final 'ok' state, or if the
// remaining source contains anything except whitespace, then we did not have
//a well-formed JSON text.

        if (state !== 'ok' || /[^\x20\t\n\r]/.test(source)) {
            throw state instanceof SyntaxError ? state : new SyntaxError('JSON');
        }

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the current
// value in an empty key. If there is not a reviver function, we simply return
// that value.

        return typeof reviver === 'function' ? (function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }({'': value}, '')) : value;
    };
}());

},{}],15:[function(require,module,exports){
var helpers = require('../helpers');
var parse_json = (JSON && JSON.parse) ? JSON.parse : require("./json_parse_state");


//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {
        if (!sourceOrigin || helpers.normalizeURL(event.origin) === helpers.normalizeURL(sourceOrigin)) {
            var message = event.data;
            if (message.substr(0, 2) === marker) {
                try {
                    message = parse_json(message.substring(2));

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
},{"../helpers":11,"./json_parse_state":14}]},{},[6]);