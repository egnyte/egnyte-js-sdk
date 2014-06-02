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