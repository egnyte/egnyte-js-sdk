(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Egnyte = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * PinkySwear.js 2.2.2 - Minimalistic implementation of the Promises/A+ spec
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
 * PinkySwear has just three functions.
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
//wrapper for any promises library
var pinkySwear = require(1);
var helpers = require(5);

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

function settler(array, resolver) {

    helpers.each(array, function (promise, num) {
        promise.then(function (result) {
            resolver(num, {
                state: "fulfilled",
                value: result
            });
        }, function (err) {
            resolver(num, {
                state: "rejected",
                reason: err
            });
        })
    });
}

Promises.all = function (array) {
    var collectiveDefere = Promises.defer();
    var results = [];
    var counter = array.length;

    settler(array, function (num, item) {
        if (counter) {
            if (item.state === "rejected") {
                counter = 0;
                collectiveDefere.reject(item.reason);
            } else {
                results[num] = item;
                if (--counter === 0) {
                    collectiveDefere.resolve(results);
                }
            }
        }
    })
    return collectiveDefere.promise;
}

Promises.allSettled = function (array) {
    var collectiveDefere = Promises.defer();
    var results = [];
    var counter = array.length;

    settler(array, function (num, item) {
        results[num] = item;
        if (--counter === 0) {
            collectiveDefere.resolve(results);
        }
    })

    return collectiveDefere.promise;
}

module.exports = Promises;
},{"1":1,"5":5}],4:[function(require,module,exports){
var vkey = require(2);


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
},{"2":2}],5:[function(require,module,exports){
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

function contains(arr, val) {
    var found = false;
    each(arr, function (v) {
        if (v === val) {
            found = true;
        }
    })
    return found;
}
var disallowedChars = /[":<>|?*+&#\\]/;

function normalizeURL(url) {
    return (url).replace(/\/*$/, "");
};

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
    id: function (a) {
        return a
    },
    bindThis: function (that, func) {
        return function () {
            return func.apply(that, arguments);
        }
    },
    contains: contains,
    each: each,
    normalizeURL: normalizeURL,
    httpsURL: function (url) {
        return "https://" + (normalizeURL(url).replace(/^https?:\/\//, ""));
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
},{}],6:[function(require,module,exports){
var helpers = require(5);


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
},{"5":5}],7:[function(require,module,exports){
module.exports = function (promises, dom, messages, callback) {
    var init = promises.defer();
    var remoteDomain, appUID;

    var channel = {
        marker: "-U",
        sourceOrigin: null //initial message only, origin is unknown anyway
    };

    var sendTarget = window.opener || window.parent;

    function actionsHandler(message) {
        if (message.action && message.data && message.action === "init") {
            init.resolve(message.data);
        }
    }

    function sendIdentified(action, body) {
        messages.sendMessage(sendTarget, channel, action, {
            uid: appUID,
            body: body
        }, remoteDomain);
    }

    function complete(body) {
        sendIdentified("complete", body);
    }

    function reload() {
        sendIdentified("reload");
    }

    function error(body) {
        sendIdentified("error", body);
    }

    channel.handler = messages.createMessageHandler(channel.sourceOrigin, channel.marker, actionsHandler);
    channel._evListener = dom.addListener(window, "message", channel.handler);

    //init
    messages.sendMessage(sendTarget, channel, "load", null, remoteDomain);

    init.promise.then(function (input) {
        remoteDomain = input.origin;
        appUID = input.uid;
        callback({
            data: input.data,
            reload: reload,
            error: error,
            complete: complete
        });
    });

}
},{}],8:[function(require,module,exports){
window.Egnyte || (window.Egnyte = {})
var core = require(7);
var promises = require(3);
var dom = require(4);
var messages = require(6);

window.Egnyte.appInit = function appInit(callback) {
    return core(promises, dom, messages, callback);
}
module.exports = window.Egnyte;
},{"3":3,"4":4,"6":6,"7":7}]},{},[8])(8)
});