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

    var helpers = require('./lib/reusables/helpers');
    var options = {};

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            filePicker: require("./lib/filepicker/byapi")(options),
            filePickerRemote: require("./lib/filepicker/bysession")(options),
            API:  require("./lib/api")(options)
        }

    }

    window.EgnyteWidget = {
        init: init
    }

})();
},{"./lib/api":7,"./lib/filepicker/byapi":11,"./lib/filepicker/bysession":12,"./lib/reusables/helpers":17}],7:[function(require,module,exports){
var authHelper = require("./api_elements/auth");
var storageFacade = require("./api_elements/storage");
var linkFacade = require("./api_elements/link");


module.exports = function (options) {
    var auth = authHelper(options);
    var storage = storageFacade(auth, options);
    var link = linkFacade(auth, options);

    return {
        auth: auth,
        storage: storage,
        link: link
    };
};
},{"./api_elements/auth":8,"./api_elements/link":9,"./api_elements/storage":10}],8:[function(require,module,exports){
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
    if (isAuthenticated()) {
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
            if (response.statusCode == 403 && quota.test(response.responseText)) {
                throw new Error("Developer Over Qps");
            } else {
                callback.call(this, error, response, body);
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
},{"../promises":15,"../reusables/helpers":17}],10:[function(require,module,exports){
var promises = require('../promises');
var helpers = require('../reusables/helpers');

var api;
var options;

var fsmeta = "/fs";
var fscontent = "/fs-content";


function exists(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

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
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

    api.sendRequest({
        method: "GET",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    }, function (error, response, body) {
        defer.resolve(body);
    });
    return defer.promise;
}

function download(pathFromRoot) {
    var defer = promises.defer();
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

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
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
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
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    newPath = helpers.encodeNameSafe(newPath);
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
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

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
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    var opts = {
        method: "DELETE",
        url: api.getEndpoint() + fsmeta + "/" + encodeURI(pathFromRoot),
    };
    var defer = promises.defer();
    if (versionEntryId) {
        opts.params = {
            "entry_id": versionEntryId
        };
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
},{"../promises":15,"../reusables/helpers":17}],11:[function(require,module,exports){
(function () {

    var helpers = require("../reusables/helpers");
    var dom = require("../reusables/dom");
    var View = require("../filepicker_elements/view");

    var defaults = {};

    function controllerFactory(view) {
        return function (path) {
            view.loading();
            eg.API.storage.get(path).then(function (m) {
                view.model = m;
                view.render();
            }).error(function () {
                console.error(arguments);
            });
        }
    }

    function init(options) {
        var filePicker;
        options = helpers.extend(defaults, options);

        filePicker = function (node, callback, cancelCallback) {
            var controller, close, fpView;
            close = function () {
                fpView.destroy();
            };

            fpView = new View({
                el: node,
                model: {},
                handlers: {
                    file: function (item) {
                        callback(item);
                        close();
                    },
                    folder: function (item) {
                        controller(item.path);
                    },
                    back: function () {
                        var path = this.model.path.replace(/\/[^\/]+\/?$/i, "");
                        controller(path);
                    },
                    close: function(){
                        cancelCallback();
                        close();
                    }
                }
            });

            controller = controllerFactory(fpView)

            controller("/Private/hackathon1");

            return {
                close: close,
            };
        };

        return filePicker;

    }

    module.exports = init;


})();
},{"../filepicker_elements/view":13,"../reusables/dom":16,"../reusables/helpers":17}],12:[function(require,module,exports){
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
},{"../reusables/dom":16,"../reusables/helpers":17,"../reusables/messages":18}],13:[function(require,module,exports){
//template engine based upon JsonML
var dom = require("../reusables/dom");
var helpers = require("../reusables/helpers");
var jungle = require("../../vendor/zenjungle");

require("./view.less");

var moduleClass = "eg-filepicker";

var fileext = /.*\.([a-z]*)$/i;

function getExt(name) {
    if (fileext.test(name)) {
        return name.replace(fileext, "$1");
    } else {
        return "";
    }
}

function View(opts) {
    this.el = opts.el;

    this.handlers = helpers.extend(this.handlers, opts.handlers);
    this.model = opts.model;

    var back = jungle([["span",
        {
            class: "eg-filepicker-back eg-btn"
        }, "<"]]);
    this.els.back = back.children[0];
    var close = jungle([["span",
        {
            class: "eg-filepicker-close eg-btn"
        }, "x"]]);
    this.els.close = close.children[0];

    var that = this;

    dom.addListener(this.els.back, "click", function (e) {
        that.handlers.back.call(that, e);
    });
    dom.addListener(this.els.close, "click", function (e) {
        that.handlers.close.call(that, e);
    });

}

var noop = function () {};

View.prototype.els = {};
View.prototype.model = {};
View.prototype.handlers = {
    item: noop,
    back: noop,
    folder: noop,
    file: noop,
    close: noop
};

View.prototype.renderItem = function (itemModel, handler) {
    var that = this;
    var ext = (itemModel.is_folder) ? "" : getExt(itemModel.name);
    var itemFragm = jungle([["li.eg-filepicker-item",
        ["span.eg-filepicker-ico-" + ((itemModel.is_folder) ? "folder" : "file"),
            {
                "data-ext": ext
            },
            ["span", ext]
        ],
        ["span.eg-filepicker-name", itemModel.name]
    ]]);
    var itemNode = itemFragm.children[0];

    dom.addListener(itemNode, "click", function (e) {
        handler.call(that, itemModel, e);
    });

    this.els.list.appendChild(itemFragm);
}

View.prototype.loading = function () {
    var that = this;
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-spinner",["div"], "loading"]]));
    }
}

View.prototype.destroy = function () {
    this.el.innerHTML = "";
    this.el = null;
    this.model = null;
    this.handlers = null;
}


View.prototype.render = function (node) {
    var that = this;

    if (node) {
        this.el = node;
    }
    this.els.list = document.createElement("ul");

    var listFragm = jungle([["div.eg-filepicker",
        this.els.close,
        ["div.eg-filepicker-breadcrumb",
            this.els.back,
            ["span.eg-filepicker-path", this.model.path]
        ],
        this.els.list

    ]]);

    this.el.innerHTML = "";
    this.el.appendChild(listFragm);


    helpers.each(this.model.folders, function (folder) {
        that.renderItem(folder, that.handlers.folder)
    });

    helpers.each(this.model.files, function (file) {
        that.renderItem(file, that.handlers.file);
    });


}


module.exports = View;
},{"../../vendor/zenjungle":19,"../reusables/dom":16,"../reusables/helpers":17,"./view.less":14}],14:[function(require,module,exports){
(function() { var head = document.getElementsByTagName('head')[0]; style = document.createElement('style'); style.type = 'text/css';var css = ".eg-btn{display:inline-block;line-height:20px;padding:0 10px;text-align:center;background-color:#f5f5f5;border:1px solid #ccc;border-radius:2px;font-weight:700}.eg-filepicker{border:1px solid #ccc;font-family:sans-serif;position:relative}.eg-filepicker ul{padding:0;margin:0;height:400px;overflow-y:scroll}.eg-filepicker-breadcrumb{padding:5px;border-bottom:1px solid #ccc}.eg-filepicker-back{margin-right:10px}.eg-filepicker-close{position:absolute;right:5px;top:5px}.eg-filepicker-item{line-height:1.2em;list-style:none;padding:5px;cursor:pointer}.eg-filepicker-item:hover{background-color:#f1f5f8}.eg-filepicker-item *{vertical-align:middle;display:inline-block}.eg-filepicker-name{margin-left:.3em}.eg-filepicker-ico-file{width:40px;height:40px;background:#dbdbdb;text-align:right}.eg-filepicker-ico-file>span{text-align:center;font-size:16px;line-height:20px;font-weight:300;margin:10px 0;height:20px;width:32px;background:rgba(0,0,0,.15);color:#fff}.eg-filepicker-ico-folder{background-color:#e1e1ba;border:#d4d8bd .1em solid;border-radius:.1em;border-top-left-radius:0;font-size:10px;margin-top:.75em;height:2.9em;overflow:visible;width:4em;position:relative}.eg-filepicker-ico-folder:before{display:block;position:absolute;top:-.5em;left:-.1em;border:#d1dabc .1em solid;border-radius:.2em;border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0;background-color:#dfe4b9;content:\" \";width:60%;height:.5em}.eg-filepicker-ico-folder:after{display:block;position:absolute;top:.3em;height:2.4em;left:0;width:100%;border-top-left-radius:.3em;border-top-right-radius:.3em;background-color:#f3f7d3;content:\" \"}.eg-filepicker-ico-folder>span{display:none}@-webkit-keyframes egspin{to{transform:rotate(360deg)}}@keyframes egspin{to{transform:rotate(360deg)}}.eg-spinner{margin:40%;margin:calc(50% - 42px)}.eg-spinner>div{content:\"\";-webkit-animation:egspin 1s infinite linear;animation:egspin 1s infinite linear;width:30px;height:30px;border:solid 7px;border-radius:50%;border-color:transparent transparent #ccc}";if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style);}())
},{}],15:[function(require,module,exports){
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
                promise(false, [result]);
            }
        }
    }
}
},{"pinkyswear":2}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
var subs = {}

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
    subscribe: function (topic, cb) {
        if (!subs[topic]) {
            subs[topic] = [];
        }
        subs[topic].push(cb);
    },
    publish: function (topic, data) {
        if (subs[topic]) {
            setTimeout(function () {
                each(subs[topic], function (cb) {
                    cb(data);
                })
            }, 0);
        }
    },
    each: function each(arr, fun) {
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (i in arr)
                    fun.call(null, arr[i], i, arr);
            }
        }
    },
    normalizeURL: function (url) {
        return (url).replace(/\/*$/, "");
    },
    encodeNameSafe: function (name) {
        name.split("/").map(function (e) {
            return e.replace(/[^a-z0-9 ]*/gi, "");
        })
            .join("/")
            .replace(/^\//, "");

        return (name);
    }
};
},{}],18:[function(require,module,exports){
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
},{"../reusables/helpers":17}],19:[function(require,module,exports){
/**
 * zenjungle - HTML via JSON with elements of Zen Coding 
 *
 * https://github.com/radmen/zenjungle
 * Copyright (c) 2012 Radoslaw Mejer <radmen@gmail.com>
 */

module.exports = (function() {
  // helpers
  var is_object = function(object) {
        return '[object Object]' == Object.prototype.toString.call(object);
      },
      is_array = function(object) {
        return '[object Array]' == Object.prototype.toString.call(object);
      },
      each = function(object, callback) {
        var key;

        for(key in object) {
          object.hasOwnProperty(key) && callback(object[key], key);
        }
      },
      merge = function() {
        var merged = {}

        each(arguments, function(arg) {
          each(arg, function(value, key) {
            merged[key] = value;
          })
        });

        return merged;
      }
  
  // converts some patterns to properties
  var zen = function(string) {
    var replace = {
          '\\[([a-z\\-]+)=([^\\]]+)\\]': function(match) {
            var prop = {};
            prop[match[1]] = match[2].replace(/^["']/, '').replace(/["']$/, '');

            return prop;
          },
          '#([a-zA-Z][a-zA-Z0-9\\-_]*)': function(match) {
            return {'id': match[1]};
          },
          '\\.([a-zA-Z][a-zA-Z0-9\\-_]*)': function(match) {
            return {'class': match[1]};
          }
        },
        props = {};
    
    each(replace, function(parser, regex) {
      var match;
      
      regex = new RegExp(regex);
      
      while(regex.test(string)) {
        match = regex.exec(string);
        string = string.replace(match[0], '');
        
        props = merge(props, parser(match));
      }
    });
    
    return [string, props];
  }
  
  var monkeys = function(what, where) {
    where = where || document.createDocumentFragment();
    
    each(what, function(element) {
      var zenned,
          props,
          new_el;
          
      if(is_array(element)) {
        
        if('string' === typeof element[0]) {
          zenned = zen(element.shift());
          props = is_object(element[0]) ? element.shift() : {};
          new_el = document.createElement(zenned[0]);
          
          each(merge(zenned[1], props), function(value, key) {
            new_el.setAttribute(key, value);
          });
          
          where.appendChild(new_el);
          monkeys(element, new_el);
        }
        else {
          monkeys(element, where);
        }
      }
      else if(1 == element.nodeType || 11 == element.nodeType) {
        where.appendChild(element);
      }
      else if('string' === typeof(element) || 'number' === typeof(element) ) {
          	where.appendChild(document.createTextNode(element));
      }
    });
    
    return where;
  }
  
  return monkeys;
})();


},{}]},{},[6]);