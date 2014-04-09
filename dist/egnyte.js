(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        iframe.style.border = "none";
        iframe.src = url;
        return iframe;
    }

}
},{}],2:[function(require,module,exports){
(function () {
    "use strict";

    var helpers = require('./helpers');

    var options = {};

    function init(egnyteDomainURL, opts) {
        options = helpers.extend(options, opts);
        options.egnyteDomainURL = helpers.normalizeURL(egnyteDomainURL);

        return {
            domain: options.egnyteDomainURL,
            filePicker: require("./filepicker")(options)
        }

    }

    window.EgnyteWidget = {
        init: init
    }

})();
},{"./filepicker":3,"./helpers":4}],3:[function(require,module,exports){
(function () {

    var dom = require('./dom');
    var helpers = require('./helpers');

    var defaults = {
        filepickerViewAddress: "folderExplorer.html",
        channelMarker: "'E"
    };


    function listen(channel, callback) {
        channel.handler = helpers.createMessageHandler(channel.sourceOrigin, channel.marker, callback);
        dom.addListener(window, "message", channel.handler);
    }

    function destroy(channel, iframe) {
        dom.removeListener(window, "message", channel.handler);
        if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    }

    function actionHandler(close, callback, cancelCallback) {
        return function (message) {
            if (message.action) {
                switch (message.action) {
                case "selection":
                    if (callback(message.data) !== false) {
                        close();
                    }
                    break;
                case "cancel":
                    close();
                    cancelCallback();
                    break;
                }
            }
        }
    }

    function init(options) {

        options = helpers.extend(defaults, options);

        var filePicker = function (node, callback, cancelCallback) {
            var iframe;
            var channel = {
                marker: options.channelMarker,
                sourceOrigin: options.egnyteDomainURL
            }
            var close = function () {
                destroy(channel, iframe);
            };
            iframe = dom.createFrame(options.egnyteDomainURL + "/" + options.filepickerViewAddress);

            listen(channel, actionHandler(close, callback, cancelCallback));
            node.appendChild(iframe);

            return {
                close: close
            }
        }

        return filePicker;

    }

    module.exports = init;


})();
},{"./dom":1,"./helpers":4}],4:[function(require,module,exports){
var parse_json = (JSON && JSON.parse) ? JSON.parse : require("./json_parse_state");

function normalizeURL(url) {
    return (url).replace(/\/*$/, "");
}

//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
    return function (event) {
        if (!sourceOrigin || normalizeURL(event.origin) === normalizeURL(sourceOrigin)) {
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
    normalizeURL: normalizeURL,
    parse_json: parse_json,
    createMessageHandler: createMessageHandler
}
},{"./json_parse_state":5}],5:[function(require,module,exports){
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

},{}]},{},[2]);