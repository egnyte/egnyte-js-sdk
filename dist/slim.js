(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

	target[0][target[1]] = function pinkySwear(extend) {
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
			var promise2 = pinkySwear(extend);
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
        if(extend){
            set = extend(set);
        }
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
var parseHeaders = require(3)

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ? XHR : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new XDR()
        }else{
            xhr = new XHR()
        }
    }

    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var key
    var load = options.response ? loadResponse : loadXhr

    if ("json" in options) {
        isJson = true
        headers["Accept"] = "application/json"
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
                                    //backward compatibility
    if (options.withCredentials || (options.cors && options.withCredentials !== false)) {
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
    } else if (options.headers) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }
    
    if ("beforeSend" in options && 
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = null

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === 'text' || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function getStatusCode() {
        return xhr.status === 1223 ? 204 : xhr.status
    }

    // if we're getting a none-ok statusCode, build & return an error
    function errorFromStatusCode(status) {
        var error = null
        if (status === 0 || (status >= 400 && status < 600)) {
            var message = (typeof body === "string" ? body : false) ||
                messages[String(status).charAt(0)]
            error = new Error(message)
            error.statusCode = status
        }

        return error
    }

    // will load the data & process the response in a special response object
    function loadResponse() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)
        var response = {
            body: getBody(),
            statusCode: status,
            statusText: xhr.statusText,
            raw: xhr
        }
        if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
            response.headers = parseHeaders(xhr.getAllResponseHeaders())
        } else {
            response.headers = {}
        }

        callback(error, response, response.body)
    }

    // will load the data and add some response properties to the source xhr
    // and then respond with that
    function loadXhr() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)

        xhr.status = xhr.statusCode = status
        xhr.body = getBody()
        xhr.headers = parseHeaders(xhr.getAllResponseHeaders())

        callback(error, xhr, xhr.body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}
},{"1":4,"2":5,"3":9}],4:[function(require,module,exports){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else {
    module.exports = {};
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
var isFunction = require(1)

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}
},{"1":7}],7:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};
},{}],8:[function(require,module,exports){
exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};
},{}],9:[function(require,module,exports){
var trim = require(2)
  , forEach = require(1)
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}

},{"1":6,"2":8}],10:[function(require,module,exports){
module.exports = {
    handleQuota: true,
    QPS: 2,
    forwarderAddress: "app/integ/forwarder/1.0/apiForwarder.html",
    filepickerViewAddress: "register.do?ref=folder-explorer",
    channelMarker: "'E",
    httpRequest: null,
    oldIEForwarder: false
    
}

},{}],11:[function(require,module,exports){
var RequestEngine = require(3);
var AuthEngine = require(1);
var StorageFacade = require(4);
var LinkFacade = require(2);


module.exports = function (options) {
    var auth = new AuthEngine(options);
    var requestEngine = new RequestEngine(auth, options);

    var storage = new StorageFacade(requestEngine);
    var link = new LinkFacade(requestEngine);
    var api = {
        auth: auth,
        storage: storage,
        link: link
    };

    //onlt in IE8 and IE9
    if (!("withCredentials" in (new window.XMLHttpRequest()))) {
        if (options.acceptForwarding) {
            //will handle incoming forwards
            var responder = require(5);
            responder(options, api);
        } else {
            //IE 8 and 9 forwarding
            if (options.oldIEForwarder) {
                var forwarder = require(6);
                forwarder(options, api);
            }
        }
    }

    api.manual = requestEngine;

    return api;
};
},{"1":12,"2":14,"3":15,"4":16,"5":17,"6":18}],12:[function(require,module,exports){
var oauthRegex = /access_token=([^&]+)/;
var oauthDeniedRegex = /\?error=access_denied/;


var promises = require(5);
var helpers = require(2);
var dom = require(1);
var messages = require(3);
var errorify = require(4);





function Auth(options) {
    this.options = options;
    if (this.options.token) {
        this.token = this.options.token;
    }
    this.userInfo = null;
    this.getUserInfo = helpers.bindThis(this, this.getUserInfo);

}

var authPrototypeMethods = {};

authPrototypeMethods._reloadForToken = function () {
    window.location.href = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + window.location.href;
}

authPrototypeMethods._checkTokenResponse = function (success, denied, notoken, overrideWindow) {
    var win = overrideWindow || window;
    if (!this.token) {
        this.userInfo = null;
        var access = oauthRegex.exec(win.location.hash);
        if (access) {
            if (access.length > 1) {
                this.token = access[1];
                //overrideWindow || (window.location.hash = "");
                success && success();
            } else {
                //what now?
            }
        } else {
            if (oauthDeniedRegex.test(win.location.href)) {
                denied && denied();
            } else {
                notoken && notoken();
            }
        }
    } else {
        success && success();
    }
}

authPrototypeMethods.requestTokenReload = function (callback, denied) {
    this._checkTokenResponse(callback, denied, helpers.bindThis(this, this._reloadForToken));
}

authPrototypeMethods.requestTokenIframe = function (targetNode, callback, denied, emptyPageURL) {
    if (!this.token) {
        var self = this;
        var locationObject = window.location;
        emptyPageURL = (emptyPageURL) ? locationObject.protocol + "//" + locationObject.host + emptyPageURL : locationObject.href;
        var url = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + emptyPageURL;
        var iframe = dom.createFrame(url, !!"scrollbars please");
        iframe.onload = function () {
            try {
                var location = iframe.contentWindow.location;
                var override = {
                    location: {
                        hash: "" + location.hash,
                        href: "" + location.href
                    }
                };

                self._checkTokenResponse(function () {
                    iframe.src = "";
                    targetNode.removeChild(iframe);
                    callback();
                }, function () {
                    iframe.src = "";
                    targetNode.removeChild(iframe);
                    denied();
                }, null, override);
            } catch (e) {}
        }
        targetNode.appendChild(iframe);
    } else {
        callback();
    }

}


authPrototypeMethods._postTokenUp = function () {
    var self = this;
    if (!this.token && window.name === this.options.channelMarker) {
        var channel = {
            marker: this.options.channelMarker,
            sourceOrigin: this.options.egnyteDomainURL
        };

        this._checkTokenResponse(function () {
            messages.sendMessage(window.opener, channel, "token", self.token);
        }, function () {
            messages.sendMessage(window.opener, channel, "denied", "");
        });

    }
}
authPrototypeMethods.requestTokenPopup = function (callback, denied, recvrURL) {
    var self = this;
    if (!this.token) {
        var url = this.options.egnyteDomainURL + "/puboauth/token?client_id=" + this.options.key + "&mobile=" + ~~(this.options.mobile) + "&redirect_uri=" + recvrURL;
        var win = window.open(url);
        win.name = this.options.channelMarker;
        var handler = messages.createMessageHandler(null, this.options.channelMarker, function (message) {
            listener.destroy();
            win.close();
            if (message.action === "token") {
                self.token = message.data;
                callback && callback();
            }
            if (message.action === "denied") {
                denied && denied();
            }
        });
        var listener = dom.addListener(window, "message", handler);
    } else {
        callback();
    }

}

authPrototypeMethods.authorizeXHR = function (xhr) {
    //assuming token_type was bearer, no use for XHR otherwise, right?
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
}

authPrototypeMethods.getHeaders = function () {
    return {
        "Authorization": "Bearer " + this.token
    };
}


authPrototypeMethods.isAuthorized = function () {
    return !!this.token;
}

authPrototypeMethods.getToken = function () {
    return this.token;
}

authPrototypeMethods.setToken = function (externalToken) {
    this.token = externalToken;
}


authPrototypeMethods.dropToken = function (externalToken) {
    this.token = null;
}


//======================================================================
//api facade


authPrototypeMethods.addRequestEngine = function (requestEngine) {
    this.requestEngine = requestEngine;
}

authPrototypeMethods.getUserInfo = function () {
    var self = this;
    if (self.userInfo || !this.requestEngine) {
        return promises(true).then(function () {
            return self.userInfo;
        });
    } else {
        return this.requestEngine.promiseRequest({
            method: "GET",
            url: this.requestEngine.getEndpoint() + "/userinfo",
        }).then(function (result) { //result.response result.body
            self.userInfo = result.body;
            return result.body;
        });
    }
}

Auth.prototype = authPrototypeMethods;

module.exports = Auth;
},{"1":20,"2":21,"3":22,"4":13,"5":19}],13:[function(require,module,exports){
var isMsg = {
    "msg": 1,
    "message": 1,
    "errorMessage": 1
};

var htmlMsgRegex = /^\s*<h1>([^<]*)<\/h1>\s*$/gi;

function findMessage(obj) {
    var result;
    for (var i in obj) {
        if (isMsg[i]) {
            return obj[i];
        }
        if (typeof obj[i] === "object") {
            result = findMessage(obj[i]);
            if (result) {
                return result;
            }
        }
    }
}
//this should understand all the message formats from the server and translate to a nice message
function psychicMessageParser(mess, statusCode) {
    var nice;
    if (typeof mess === "string") {
        try {
            nice = findMessage(JSON.parse(mess));
            if (!nice) {
                //fallback if nothing found - return raw JSON string anyway
                nice = mess;
            }
        } catch (e) {
            nice = mess ? mess.replace(htmlMsgRegex, "$1") : "Unknown error";
        }
        if (statusCode === 404 && mess.length > 300) {
            //server returned a dirty 404
            nice = "Not found";
        }
    } else {
        nice = findMessage(mess);
    }
    return nice;
}

module.exports = function (result) {
    var error, code;
    if (result.response) {
        code = ~~ (result.response.statusCode);
        error = result.error;
        error.statusCode = code;
        error.message = psychicMessageParser(result.body||result.error.message, code);
        error.response = result.response;
        error.body = result.body;
    } else {
        error = result.error;
        error.statusCode = 0;
    }
    return error;
}

},{}],14:[function(require,module,exports){
var promises = require(2);
var helpers = require(1);



var linksEndpoint = "/links";

function Links(requestEngine) {
    this.requestEngine = requestEngine;
}

var linksProto = {};

linksProto.createLink = function(setup) {
    var requestEngine = this.requestEngine;
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

            return requestEngine.promiseRequest({
                method: "POST",
                url: requestEngine.getEndpoint() + linksEndpoint,
                json: setup
            });
        }).then(function (result) { //result.response result.body
            return result.body;
        });
}


linksProto.removeLink = function(id) {
    var requestEngine = this.requestEngine;
    return requestEngine.promiseRequest({
        method: "DELETE",
        url: requestEngine.getEndpoint() + linksEndpoint + "/" + id
    }).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

linksProto.listLink = function(id) {
    var requestEngine = this.requestEngine;
    return requestEngine.promiseRequest({
        method: "GET",
        url: requestEngine.getEndpoint() + linksEndpoint + "/" + id
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}


linksProto.listLinks = function(filters) {
    var requestEngine = this.requestEngine;
    return promises(true)
        .then(function () {
            filters.path = filters.path && helpers.encodeNameSafe(filters.path);

            return requestEngine.promiseRequest({
                method: "get",
                url: requestEngine.getEndpoint() + linksEndpoint,
                params: filters
            });
        }).then(function (result) { //result.response result.body
            return result.body;
        });
}

linksProto.findOne = function(filters) {
    var self=this;
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
},{"1":21,"2":19}],15:[function(require,module,exports){
var quotaRegex = /^<h1>Developer Over Qps/i;


var promises = require(5);
var helpers = require(2);
var dom = require(1);
var messages = require(3);
var errorify = require(4);
var request = require(6);



function Engine(auth, options) {
    this.auth = auth;
    this.options = options;

    this.requestHandler = (options.httpRequest) ? options.httpRequest : request;

    this.quota = {
        startOfTheSecond: 0,
        calls: 0,
        retrying: 0
    }
    this.queue = [];

    this.queueHandler = helpers.bindThis(this, _rollQueue);

    auth.addRequestEngine(this);

}

var enginePrototypeMethods = {};



//======================================================================
//request handling
function params(obj) {
    var str = [];
    //cachebuster for IE
    //    if (typeof window !== "undefined" && window.XDomainRequest) {
    //        str.push("random=" + (~~(Math.random() * 9999)));
    //    }
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    if (str.length) {
        return "?" + str.join("&");
    } else {
        return "";
    }
}

enginePrototypeMethods.getEndpoint = function () {
    return this.options.egnyteDomainURL + "/pubapi/v1";
}

enginePrototypeMethods.promise = function (value) {
    return promises(value);
}

enginePrototypeMethods.sendRequest = function (opts, callback) {
    var self = this;
    var originalOpts = helpers.extend({}, opts);
    //IE8/9 
    if (typeof window !== "undefined" && window.XDomainRequest) {
        opts.response = true;
    }

    if (this.auth.isAuthorized()) {
        opts.url += params(opts.params);
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = "Bearer " + this.auth.getToken();
        if (!callback) {
            return self.requestHandler(opts);
        } else {
            return self.requestHandler(opts, function (error, response, body) {
                //emulating the default XHR behavior
                if (!error && response.statusCode >= 400 && response.statusCode < 600) {
                    error = new Error(body);
                }
                try {
                    //this shouldn't be required, but server sometimes responds with content-type text/plain
                    body = JSON.parse(body);
                } catch (e) {}

                var retryAfter = response.headers["retry-after"];
                var masheryCode = response.headers["x-mashery-error-code"];
                //in case headers get returned as arrays, we only expect one value
                retryAfter = typeof retryAfter === "array" ? retryAfter[0] : retryAfter;
                masheryCode = typeof masheryCode === "array" ? masheryCode[0] : masheryCode;

                if (
                    self.options.handleQuota &&
                    response.statusCode === 403 &&
                    retryAfter
                ) {
                    if (masheryCode === "ERR_403_DEVELOPER_OVER_QPS") {
                        //retry
                        console && console.warn("developer over QPS, retrying");
                        self.quota.retrying = 1000 * ~~(retryAfter);
                        setTimeout(function () {
                            self.quota.retrying = 0;
                            self.sendRequest(originalOpts, callback);
                        }, self.quota.retrying);

                    }
                    if (masheryCode === "ERR_403_DEVELOPER_OVER_RATE") {
                        error.RATE = true;
                        callback.call(this, error, response, body);
                    }

                } else {

                    if (
                        //Checking for failed auth responses
                        //(ノಠ益ಠ)ノ彡┻━┻
                        self.options.onInvalidToken &&
                        (
                            response.statusCode === 401 ||
                            (
                                response.statusCode === 403 &&
                                masheryCode === "ERR_403_DEVELOPER_INACTIVE"
                            )
                        )
                    ) {
                        self.auth.dropToken();
                        self.options.onInvalidToken();
                    }

                    callback.call(this, error, response, body);
                }
            });
        }
    } else {
        callback.call(this, new Error("Not authorized"), {
            statusCode: 0
        }, null);
    }

}

enginePrototypeMethods.promiseRequest = function (opts, requestHandler) {
    var defer = promises.defer();
    var self = this;
    var requestFunction = function () {
        try {
            var req = self.sendRequest(opts, function (error, response, body) {
                if (error) {
                    defer.reject(errorify({
                        error: error,
                        response: response,
                        body: body
                    }));
                } else {
                    defer.resolve({
                        response: response,
                        body: body
                    });
                }
            });
            requestHandler && requestHandler(req);
        } catch (error) {
            defer.reject(errorify({
                error: error
            }));
        }
    }
    if (!this.options.handleQuota) {
        requestFunction();
    } else {
        //add to queue
        this.queue.push(requestFunction);
        //stop previous queue processing if any
        clearTimeout(this.quota.to);
        //start queue processing
        this.queueHandler();
    }
    return defer.promise;
}


//gets bound to this in the constructor and saved as this.queueHandler
function _rollQueue() {
    if (this.queue.length) {
        var currentWait = _quotaWaitTime(this.quota, this.options.QPS);
        if (currentWait === 0) {
            var requestFunction = this.queue.shift();
            requestFunction();
            this.quota.calls++;
        }
        this.quota.to = setTimeout(this.queueHandler, currentWait);
    }

}

function _quotaWaitTime(quota, QPS) {
    var now = +new Date();
    var diff = now - quota.startOfTheSecond;
    //in the middle of retrying a denied call
    if (quota.retrying) {
        quota.startOfTheSecond = now + quota.retrying;
        return quota.retrying + 1;
    }
    //last call was over a second ago, can start
    if (diff > 1000) {
        quota.startOfTheSecond = now;
        quota.calls = 0;
        return 0;
    }
    //calls limit not reached
    if (quota.calls < QPS) {
        return 0;
    }
    //calls limit reached, delay to the next second
    return 1001 - diff;
}


Engine.prototype = enginePrototypeMethods;

module.exports = Engine;
},{"1":20,"2":21,"3":22,"4":13,"5":19,"6":3}],16:[function(require,module,exports){
var promises = require(2);
var helpers = require(1);

var fsmeta = "/fs";
var fscontent = "/fs-content";


function Storage(requestEngine) {
    this.requestEngine = requestEngine;
}

var storageProto = {};
storageProto.exists = function (pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        };

        if (versionEntryId) {
            opts.params = opts.qs = { //xhr and request differ here
                "entry_id": versionEntryId
            };
        }

        return requestEngine.promiseRequest(opts);
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
            throw result;
        }
    });
}

storageProto.get = function (pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        };

        if (versionEntryId) {
            opts.params = opts.qs = { //xhr and request differ here
                "entry_id": versionEntryId
            };
        }

        return requestEngine.promiseRequest(opts);
    }).then(function (result) { //result.response result.body
        return result.body;
    });
}

storageProto.download = function (pathFromRoot, versionEntryId, isBinary) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);

        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot),
        }
        if (versionEntryId) {
            opts.params = opts.qs = { //xhr and request differ here
                "entry_id": versionEntryId
            };
        }

        if (isBinary) {
            opts.responseType = "arraybuffer";
        }

        return requestEngine.promiseRequest(opts);
    }).then(function (result) { //result.response result.body
        return result.response;
    });
}

storageProto.createFolder = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        return requestEngine.promiseRequest({
            method: "POST",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": "add_folder"
            }
        });
    }).then(function (result) { //result.response result.body
        if (result.response.statusCode == 201) {
            return {
                id: result.response.headers["etag"],
                path: pathFromRoot
            };
        }
    });
}

storageProto.move = storageProto.rename = function (pathFromRoot, newPath) {
    return transfer(this.requestEngine, pathFromRoot, newPath, "move");
}

storageProto.copy = function (pathFromRoot, newPath) {
    return transfer(this.requestEngine, pathFromRoot, newPath, "copy");
}

function transfer(requestEngine, pathFromRoot, newPath, action) {
    return promises(true).then(function () {
        if (!newPath) {
            throw new Error("Cannot move to empty path");
        }
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        newPath = helpers.encodeNameSafe(newPath);
        return requestEngine.promiseRequest({
            method: "POST",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
            json: {
                "action": action,
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



storageProto.storeFile = function (pathFromRoot, fileOrBlob, mimeType /* optional */) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        var file = fileOrBlob;
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";

        var opts = {
            method: "POST",
            url: requestEngine.getEndpoint() + fscontent + encodeURI(pathFromRoot),
            body: file,
        }
        
        opts.headers = {};
        if (mimeType) {
            opts.headers["Content-Type"] = mimeType;
        }

        return requestEngine.promiseRequest(opts);
    }).then(function (result) { //result.response result.body
        return ({
            id: result.response.headers["etag"],
            path: pathFromRoot
        });
    });
}

//currently not supported by back-end
//function storeFileMultipart(pathFromRoot, fileOrBlob) {
//    return promises(true).then(function () {
//        if (!window.FormData) {
//            throw new Error("Unsupported browser");
//        }
//        var file = fileOrBlob;
//        var formData = new window.FormData();
//        formData.append('file', file);
//        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
//
//        return api.promiseRequest({
//            method: "POST",
//            url: api.getEndpoint() + fscontent + encodeURI(pathFromRoot),
//            body: formData,
//        });
//    }).then(function (result) { //result.response result.body
//        return ({
//            id: result.response.getResponseHeader("etag"),
//            path: pathFromRoot
//        });
//    });
//}


//private
function remove(requestEngine, pathFromRoot, versionEntryId) {
    return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
        var opts = {
            method: "DELETE",
            url: requestEngine.getEndpoint() + fsmeta + encodeURI(pathFromRoot),
        };
        if (versionEntryId) {
            opts.params = opts.qs = { //xhr and request differ here
                "entry_id": versionEntryId
            };
        }
        return requestEngine.promiseRequest(opts);

    }).then(function (result) { //result.response result.body
        return result.response.statusCode;
    });
}

storageProto.removeFileVersion = function (pathFromRoot, versionEntryId) {
    var requestEngine = this.requestEngine;
    return promises(true).then(function () {
        if (!versionEntryId) {
            throw new Error("Version ID (second argument) is missing");
        }
        return remove(requestEngine, pathFromRoot, versionEntryId)
    });
}


storageProto.remove = function (pathFromRoot) {
    return remove(this.requestEngine, pathFromRoot);
}

Storage.prototype = storageProto;

module.exports = Storage;
},{"1":21,"2":19}],17:[function(require,module,exports){
var helpers = require(2);
var dom = require(1);
var messages = require(3);

function serializablifyXHR(res) {
    var resClone = {};
    for (var key in res) {
        //purposefully getting items from prototype too
        if (typeof res[key] !== "function" && key !== "headers") {
            resClone[key] = res[key];
        }
    };
    return resClone;
}

function init(options, api) {

    var channel;

    channel = {
        marker: options.channelMarker,
        sourceOrigin: options.egnyteDomainURL
    };

    function actionsHandler(message) {
        if (message.action && message.action === "call") {
            var data = message.data;
            if (api[data.ns] && api[data.ns][data.name]) {
                api.auth.setToken(data.token);
                api[data.ns][data.name].apply(api[data.ns], data.args).then(function (res) {
                    if (res instanceof XMLHttpRequest) {
                        res = serializablifyXHR(res);
                    }
                    messages.sendMessage(window.parent, channel, "result", {
                        status: true,
                        resolution: res,
                        uid: data.uid
                    });
                }, function (res) {
                    messages.sendMessage(window.parent, channel, "result", {
                        status: false,
                        resolution: res,
                        uid: data.uid
                    });
                })

            } else {
                //send something to clean up the caller
                messages.sendMessage(window.parent, channel, "nomethod", {
                    uid: data.uid
                });
            }
        }
    }

    channel.handler = messages.createMessageHandler(null, channel.marker, actionsHandler);
    channel._evListener = dom.addListener(window, "message", channel.handler);

}

module.exports = init;
},{"1":20,"2":21,"3":22}],18:[function(require,module,exports){
var promises = require(4);
var helpers = require(2);
var dom = require(1);
var messages = require(3);



var pending = {};
var origin = "";


function actionsHandler(message) {
    var data = message.data;
    if (message.action && message.data && pending[data.uid]) {
        if (message.action === "result") {
            pending[data.uid](data.status, data.resolution);
            pending[data.uid] = null;
        }
        if (message.action === "nomethod") {
            pending[data.uid] = null;
        }
    }
}

function guid() {
    return ("" + ~~(Math.random() * 9999999) + ~~(Math.random() * 9999999))
}


function remoteCall(channel, namespaceName, methodName, token, args, callback) {
    var uid = guid();
    pending[uid] = callback;
    messages.sendMessage(channel.iframe.contentWindow, channel, "call", {
        ns: namespaceName,
        name: methodName,
        args: args,
        token: token,
        uid: uid
    }, origin);

}

function forwardMethod(namespaceName, methodName, channel, getToken) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var defer = promises.defer();
        channel.ready.promise.then(function () {
            remoteCall(channel, namespaceName, methodName, getToken(), args, function (status, resolution) {
                if (status) {
                    defer.resolve(resolution);
                } else {
                    defer.reject(resolution);
                }

            });
        });
        return defer.promise;
    }

}

function setupForwarding(api, channel) {

    var mkForwarder = function (namespaceName, method) {
        api[namespaceName][method] = forwardMethod(namespaceName, method, channel, function () {
            return api.auth.getToken()
        });
    }

    //forwarding setup
    helpers.each(api, function (apiNamespace, namespaceName) {
        if (namespaceName !== "auth") {
            for (var method in apiNamespace) {
                mkForwarder(namespaceName, method);
            }
        }
    });
    //manual forwarder, leave other auth methods be
    mkForwarder("auth", "getUserInfo");

    var parentDestroy = api.destroy;
    api.destroy = function () {
        channel._evListener.destroy();
        channel.iframe.parentNode.removeChild(channel.iframe);
        if (parentDestroy) {
            return parentDestroy.apply(api, arguments)
        }
    }

    return api;
}


function init(options, api) {
    origin = options.egnyteDomainURL;
    //comm setup
    var iframe;
    var channel;

    channel = {
        marker: options.channelMarker,
        sourceOrigin: options.egnyteDomainURL,
        ready: promises.defer()
    };

    channel.handler = messages.createMessageHandler(channel.sourceOrigin, channel.marker, actionsHandler);
    channel._evListener = dom.addListener(window, "message", channel.handler);

    iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.forwarderAddress);
    iframe.style.display = "none";

    //give IE time to get the iframe going
    var onIframeLoad = function () {
        setTimeout(function () {
            channel.ready.resolve();
        }, 50);
    }
  
    if (iframe.addEventListener) {
        iframe.addEventListener('load', onIframeLoad, false);
    } else if (iframe.attachEvent) {
        iframe.attachEvent('onload', onIframeLoad);
    }
    var body = document.body || document.getElementsByTagName("body")[0];
    body.appendChild(iframe);

    channel.iframe = iframe;

    return setupForwarding(api, channel);

}

module.exports = init;
},{"1":20,"2":21,"3":22,"4":19}],19:[function(require,module,exports){
var pinkySwear = require(1);

//for pinkyswear starting versions above 2.10
var createErrorAlias = function (promObj) {
    promObj.fail = function (func) {
        return promObj.then(0, func);
    };
    return promObj;
}

var Promises = function (value) {
    var promise = pinkySwear(createErrorAlias);
    promise(value);
    return promise;
}

Promises.defer = function () {
    var promise = pinkySwear(createErrorAlias);
    return {
        promise: promise,
        resolve: function (a) {
            promise(true, [a]);
        },
        reject: function (a) {
            promise(false, [a]);
        }
    };
}

module.exports = Promises;
},{"1":1}],20:[function(require,module,exports){
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

    createFrame: function (url,scrolling) {
        var iframe = document.createElement("iframe");
        if(!scrolling){
            iframe.setAttribute("scrolling", "no");
        }
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.minWidth = "400px";
        iframe.style.minHeight = "400px";
        iframe.style.border = "1px solid #dbdbdb";
        iframe.src = url;
        return iframe;
    }

}

},{"1":2}],21:[function(require,module,exports){
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
var disallowedChars = /[":<>|?*+&#\\]/;

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
    bindThis: function (that, func) {
        return function () {
            return func.apply(that, arguments);
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
        if (disallowedChars.test(name)) {
            throw new Error("Disallowed characters in path");
        }

        name = name.replace(/^\/\//, "/");

        return (name);
    }
};
},{}],22:[function(require,module,exports){
var helpers = require(1);


//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {
        if (!sourceOrigin || helpers.normalizeURL(event.origin) === helpers.normalizeURL(sourceOrigin)) {
            var message = event.data;
            if (message.substr(0, marker.length) === marker) {
                try {
                    message = JSON.parse(message.substring(marker.length));

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

function sendMessage(targetWindow, channel, action, data, originOverride) {
    var targetOrigin = "*",
        pkg;

    if (typeof action !== "string") {
        throw new TypeError("only string is acceptable as action");
    }

    if (originOverride) {
        targetOrigin = originOverride;
    } else {
        try {
            targetOrigin = targetWindow.location.origin || targetWindow.location.protocol + "//" + targetWindow.location.hostname + (targetWindow.location.port ? ":" + targetWindow.location.port : "");
        } catch (E) {}
    }
    pkg = JSON.stringify({
        action: action,
        data: data
    });
    pkg = pkg.replace(/(\r\n|\n|\r)/gm, "");
    targetWindow.postMessage(channel.marker + pkg, targetOrigin);
}

module.exports = {
    sendMessage: sendMessage,
    createMessageHandler: createMessageHandler
}

},{"1":21}],23:[function(require,module,exports){
(function () {
    "use strict";

    var helpers = require(3);
    var options = require(1);

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            API: require(2)(options)
        }

    }
    //for commonJS
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            init: init
        }
    }
    //for browsers. AMD works better with shims anyway
    if (typeof window !== "undefined") {
        window.Egnyte = {
            init: init
        }
    }

})();
},{"1":10,"2":11,"3":21}]},{},[23]);
