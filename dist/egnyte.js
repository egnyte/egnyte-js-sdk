(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Egnyte = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate){(function (){
/*! Axios v1.13.2 Copyright (c) 2025 Matt Zabriskie and contributors */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.axios = factory());
})(this, (function () { 'use strict';

  function _AsyncGenerator(e) {
    var r, t;
    function resume(r, t) {
      try {
        var n = e[r](t),
          o = n.value,
          u = o instanceof _OverloadYield;
        Promise.resolve(u ? o.v : o).then(function (t) {
          if (u) {
            var i = "return" === r ? "return" : "next";
            if (!o.k || t.done) return resume(i, t);
            t = e[i](t).value;
          }
          settle(n.done ? "return" : "normal", t);
        }, function (e) {
          resume("throw", e);
        });
      } catch (e) {
        settle("throw", e);
      }
    }
    function settle(e, n) {
      switch (e) {
        case "return":
          r.resolve({
            value: n,
            done: !0
          });
          break;
        case "throw":
          r.reject(n);
          break;
        default:
          r.resolve({
            value: n,
            done: !1
          });
      }
      (r = r.next) ? resume(r.key, r.arg) : t = null;
    }
    this._invoke = function (e, n) {
      return new Promise(function (o, u) {
        var i = {
          key: e,
          arg: n,
          resolve: o,
          reject: u,
          next: null
        };
        t ? t = t.next = i : (r = t = i, resume(e, n));
      });
    }, "function" != typeof e.return && (this.return = void 0);
  }
  _AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () {
    return this;
  }, _AsyncGenerator.prototype.next = function (e) {
    return this._invoke("next", e);
  }, _AsyncGenerator.prototype.throw = function (e) {
    return this._invoke("throw", e);
  }, _AsyncGenerator.prototype.return = function (e) {
    return this._invoke("return", e);
  };
  function _OverloadYield(t, e) {
    this.v = t, this.k = e;
  }
  function _asyncGeneratorDelegate(t) {
    var e = {},
      n = !1;
    function pump(e, r) {
      return n = !0, r = new Promise(function (n) {
        n(t[e](r));
      }), {
        done: !1,
        value: new _OverloadYield(r, 1)
      };
    }
    return e["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function () {
      return this;
    }, e.next = function (t) {
      return n ? (n = !1, t) : pump("next", t);
    }, "function" == typeof t.throw && (e.throw = function (t) {
      if (n) throw n = !1, t;
      return pump("throw", t);
    }), "function" == typeof t.return && (e.return = function (t) {
      return n ? (n = !1, t) : pump("return", t);
    }), e;
  }
  function _asyncIterator(r) {
    var n,
      t,
      o,
      e = 2;
    for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
      if (t && null != (n = r[t])) return n.call(r);
      if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
      t = "@@asyncIterator", o = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
  }
  function AsyncFromSyncIterator(r) {
    function AsyncFromSyncIteratorContinuation(r) {
      if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
      var n = r.done;
      return Promise.resolve(r.value).then(function (r) {
        return {
          value: r,
          done: n
        };
      });
    }
    return AsyncFromSyncIterator = function (r) {
      this.s = r, this.n = r.next;
    }, AsyncFromSyncIterator.prototype = {
      s: null,
      n: null,
      next: function () {
        return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
      },
      return: function (r) {
        var n = this.s.return;
        return void 0 === n ? Promise.resolve({
          value: r,
          done: !0
        }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
      },
      throw: function (r) {
        var n = this.s.return;
        return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
      }
    }, new AsyncFromSyncIterator(r);
  }
  function _awaitAsyncGenerator(e) {
    return new _OverloadYield(e, 0);
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return e;
    };
    var t,
      e = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o = Object.defineProperty || function (t, e, r) {
        t[e] = r.value;
      },
      i = "function" == typeof Symbol ? Symbol : {},
      a = i.iterator || "@@iterator",
      c = i.asyncIterator || "@@asyncIterator",
      u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) {
      return Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), t[e];
    }
    try {
      define({}, "");
    } catch (t) {
      define = function (t, e, r) {
        return t[e] = r;
      };
    }
    function wrap(t, e, r, n) {
      var i = e && e.prototype instanceof Generator ? e : Generator,
        a = Object.create(i.prototype),
        c = new Context(n || []);
      return o(a, "_invoke", {
        value: makeInvokeMethod(t, r, c)
      }), a;
    }
    function tryCatch(t, e, r) {
      try {
        return {
          type: "normal",
          arg: t.call(e, r)
        };
      } catch (t) {
        return {
          type: "throw",
          arg: t
        };
      }
    }
    e.wrap = wrap;
    var h = "suspendedStart",
      l = "suspendedYield",
      f = "executing",
      s = "completed",
      y = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var p = {};
    define(p, a, function () {
      return this;
    });
    var d = Object.getPrototypeOf,
      v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) {
      ["next", "throw", "return"].forEach(function (e) {
        define(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function AsyncIterator(t, e) {
      function invoke(r, o, i, a) {
        var c = tryCatch(t[r], t, o);
        if ("throw" !== c.type) {
          var u = c.arg,
            h = u.value;
          return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
            invoke("next", t, i, a);
          }, function (t) {
            invoke("throw", t, i, a);
          }) : e.resolve(h).then(function (t) {
            u.value = t, i(u);
          }, function (t) {
            return invoke("throw", t, i, a);
          });
        }
        a(c.arg);
      }
      var r;
      o(this, "_invoke", {
        value: function (t, n) {
          function callInvokeWithMethodAndArg() {
            return new e(function (e, r) {
              invoke(t, n, e, r);
            });
          }
          return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(e, r, n) {
      var o = h;
      return function (i, a) {
        if (o === f) throw new Error("Generator is already running");
        if (o === s) {
          if ("throw" === i) throw a;
          return {
            value: t,
            done: !0
          };
        }
        for (n.method = i, n.arg = a;;) {
          var c = n.delegate;
          if (c) {
            var u = maybeInvokeDelegate(c, n);
            if (u) {
              if (u === y) continue;
              return u;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
            if (o === h) throw o = s, n.arg;
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          o = f;
          var p = tryCatch(e, r, n);
          if ("normal" === p.type) {
            if (o = n.done ? s : l, p.arg === y) continue;
            return {
              value: p.arg,
              done: n.done
            };
          }
          "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
        }
      };
    }
    function maybeInvokeDelegate(e, r) {
      var n = r.method,
        o = e.iterator[n];
      if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
      var i = tryCatch(o, e.iterator, r.arg);
      if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
      var a = i.arg;
      return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
    }
    function pushTryEntry(t) {
      var e = {
        tryLoc: t[0]
      };
      1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function resetTryEntry(t) {
      var e = t.completion || {};
      e.type = "normal", delete e.arg, t.completion = e;
    }
    function Context(t) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(e) {
      if (e || "" === e) {
        var r = e[a];
        if (r) return r.call(e);
        if ("function" == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            i = function next() {
              for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
              return next.value = t, next.done = !0, next;
            };
          return i.next = i;
        }
      }
      throw new TypeError(typeof e + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
      var e = "function" == typeof t && t.constructor;
      return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
    }, e.mark = function (t) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
    }, e.awrap = function (t) {
      return {
        __await: t
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
      return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new AsyncIterator(wrap(t, r, n, o), i);
      return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
        return t.done ? t.value : a.next();
      });
    }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
      return this;
    }), define(g, "toString", function () {
      return "[object Generator]";
    }), e.keys = function (t) {
      var e = Object(t),
        r = [];
      for (var n in e) r.push(n);
      return r.reverse(), function next() {
        for (; r.length;) {
          var t = r.pop();
          if (t in e) return next.value = t, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, e.values = values, Context.prototype = {
      constructor: Context,
      reset: function (e) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      },
      stop: function () {
        this.done = !0;
        var t = this.tryEntries[0].completion;
        if ("throw" === t.type) throw t.arg;
        return this.rval;
      },
      dispatchException: function (e) {
        if (this.done) throw e;
        var r = this;
        function handle(n, o) {
          return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
        }
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
            a = i.completion;
          if ("root" === i.tryLoc) return handle("end");
          if (i.tryLoc <= this.prev) {
            var c = n.call(i, "catchLoc"),
              u = n.call(i, "finallyLoc");
            if (c && u) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            } else if (c) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            } else {
              if (!u) throw new Error("try statement without catch or finally");
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            }
          }
        }
      },
      abrupt: function (t, e) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var o = this.tryEntries[r];
          if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
            var i = o;
            break;
          }
        }
        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
        var a = i ? i.completion : {};
        return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
      },
      complete: function (t, e) {
        if ("throw" === t.type) throw t.arg;
        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
      },
      finish: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
        }
      },
      catch: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var n = r.completion;
            if ("throw" === n.type) {
              var o = n.arg;
              resetTryEntry(r);
            }
            return o;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (e, r, n) {
        return this.delegate = {
          iterator: values(e),
          resultName: r,
          nextLoc: n
        }, "next" === this.method && (this.arg = t), y;
      }
    }, e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : String(i);
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _wrapAsyncGenerator(fn) {
    return function () {
      return new _AsyncGenerator(fn.apply(this, arguments));
    };
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * Create a bound version of a function with a specified `this` context
   *
   * @param {Function} fn - The function to bind
   * @param {*} thisArg - The value to be passed as the `this` parameter
   * @returns {Function} A new function that will call the original function with the specified `this` context
   */
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;
  var getPrototypeOf = Object.getPrototypeOf;
  var iterator = Symbol.iterator,
    toStringTag = Symbol.toStringTag;
  var kindOf = function (cache) {
    return function (thing) {
      var str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    };
  }(Object.create(null));
  var kindOfTest = function kindOfTest(type) {
    type = type.toLowerCase();
    return function (thing) {
      return kindOf(thing) === type;
    };
  };
  var typeOfTest = function typeOfTest(type) {
    return function (thing) {
      return _typeof(thing) === type;
    };
  };

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   *
   * @returns {boolean} True if value is an Array, otherwise false
   */
  var isArray = Array.isArray;

  /**
   * Determine if a value is undefined
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  var isUndefined = typeOfTest('undefined');

  /**
   * Determine if a value is a Buffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  var isArrayBuffer = kindOfTest('ArrayBuffer');

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a String, otherwise false
   */
  var isString = typeOfTest('string');

  /**
   * Determine if a value is a Function
   *
   * @param {*} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  var isFunction$1 = typeOfTest('function');

  /**
   * Determine if a value is a Number
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Number, otherwise false
   */
  var isNumber = typeOfTest('number');

  /**
   * Determine if a value is an Object
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an Object, otherwise false
   */
  var isObject = function isObject(thing) {
    return thing !== null && _typeof(thing) === 'object';
  };

  /**
   * Determine if a value is a Boolean
   *
   * @param {*} thing The value to test
   * @returns {boolean} True if value is a Boolean, otherwise false
   */
  var isBoolean = function isBoolean(thing) {
    return thing === true || thing === false;
  };

  /**
   * Determine if a value is a plain Object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a plain Object, otherwise false
   */
  var isPlainObject = function isPlainObject(val) {
    if (kindOf(val) !== 'object') {
      return false;
    }
    var prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
  };

  /**
   * Determine if a value is an empty object (safely handles Buffers)
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is an empty object, otherwise false
   */
  var isEmptyObject = function isEmptyObject(val) {
    // Early return for non-objects or Buffers to prevent RangeError
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      // Fallback for any other objects that might cause RangeError with Object.keys()
      return false;
    }
  };

  /**
   * Determine if a value is a Date
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Date, otherwise false
   */
  var isDate = kindOfTest('Date');

  /**
   * Determine if a value is a File
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  var isFile = kindOfTest('File');

  /**
   * Determine if a value is a Blob
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  var isBlob = kindOfTest('Blob');

  /**
   * Determine if a value is a FileList
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  var isFileList = kindOfTest('FileList');

  /**
   * Determine if a value is a Stream
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  var isStream = function isStream(val) {
    return isObject(val) && isFunction$1(val.pipe);
  };

  /**
   * Determine if a value is a FormData
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  var isFormData = function isFormData(thing) {
    var kind;
    return thing && (typeof FormData === 'function' && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === 'formdata' ||
    // detect form-data instance
    kind === 'object' && isFunction$1(thing.toString) && thing.toString() === '[object FormData]'));
  };

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  var isURLSearchParams = kindOfTest('URLSearchParams');
  var _map = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest),
    _map2 = _slicedToArray(_map, 4),
    isReadableStream = _map2[0],
    isRequest = _map2[1],
    isResponse = _map2[2],
    isHeaders = _map2[3];

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   *
   * @returns {String} The String freed of excess whitespace
   */
  var trim = function trim(str) {
    return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   *
   * @param {Boolean} [allOwnKeys = false]
   * @returns {any}
   */
  function forEach(obj, fn) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$allOwnKeys = _ref.allOwnKeys,
      allOwnKeys = _ref$allOwnKeys === void 0 ? false : _ref$allOwnKeys;
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }
    var i;
    var l;

    // Force an array if not already something iterable
    if (_typeof(obj) !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }
    if (isArray(obj)) {
      // Iterate over array values
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Buffer check
      if (isBuffer(obj)) {
        return;
      }

      // Iterate over object keys
      var keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      var len = keys.length;
      var key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    var keys = Object.keys(obj);
    var i = keys.length;
    var _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  var _global = function () {
    /*eslint no-undef:0*/
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== 'undefined' ? window : global;
  }();
  var isContextDefined = function isContextDefined(context) {
    return !isUndefined(context) && context !== _global;
  };

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   *
   * @returns {Object} Result of all merge properties
   */
  function merge( /* obj1, obj2, obj3, ... */
  ) {
    var _ref2 = isContextDefined(this) && this || {},
      caseless = _ref2.caseless,
      skipUndefined = _ref2.skipUndefined;
    var result = {};
    var assignValue = function assignValue(val, key) {
      var targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };
    for (var i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   *
   * @param {Boolean} [allOwnKeys]
   * @returns {Object} The resulting value of object a
   */
  var extend = function extend(a, b, thisArg) {
    var _ref3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      allOwnKeys = _ref3.allOwnKeys;
    forEach(b, function (val, key) {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, {
      allOwnKeys: allOwnKeys
    });
    return a;
  };

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   *
   * @returns {string} content value without BOM
   */
  var stripBOM = function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  };

  /**
   * Inherit the prototype methods from one constructor into another
   * @param {function} constructor
   * @param {function} superConstructor
   * @param {object} [props]
   * @param {object} [descriptors]
   *
   * @returns {void}
   */
  var inherits = function inherits(constructor, superConstructor, props, descriptors) {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, 'super', {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };

  /**
   * Resolve object with deep prototype chain to a flat object
   * @param {Object} sourceObj source object
   * @param {Object} [destObj]
   * @param {Function|Boolean} [filter]
   * @param {Function} [propFilter]
   *
   * @returns {Object}
   */
  var toFlatObject = function toFlatObject(sourceObj, destObj, filter, propFilter) {
    var props;
    var i;
    var prop;
    var merged = {};
    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };

  /**
   * Determines whether a string ends with the characters of a specified string
   *
   * @param {String} str
   * @param {String} searchString
   * @param {Number} [position= 0]
   *
   * @returns {boolean}
   */
  var endsWith = function endsWith(str, searchString, position) {
    str = String(str);
    if (position === undefined || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    var lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };

  /**
   * Returns new array from array like object or null if failed
   *
   * @param {*} [thing]
   *
   * @returns {?Array}
   */
  var toArray = function toArray(thing) {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    var i = thing.length;
    if (!isNumber(i)) return null;
    var arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };

  /**
   * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
   * thing passed in is an instance of Uint8Array
   *
   * @param {TypedArray}
   *
   * @returns {Array}
   */
  // eslint-disable-next-line func-names
  var isTypedArray = function (TypedArray) {
    // eslint-disable-next-line func-names
    return function (thing) {
      return TypedArray && thing instanceof TypedArray;
    };
  }(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

  /**
   * For each entry in the object, call the function with the key and value.
   *
   * @param {Object<any, any>} obj - The object to iterate over.
   * @param {Function} fn - The function to call for each entry.
   *
   * @returns {void}
   */
  var forEachEntry = function forEachEntry(obj, fn) {
    var generator = obj && obj[iterator];
    var _iterator = generator.call(obj);
    var result;
    while ((result = _iterator.next()) && !result.done) {
      var pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };

  /**
   * It takes a regular expression and a string, and returns an array of all the matches
   *
   * @param {string} regExp - The regular expression to match against.
   * @param {string} str - The string to search.
   *
   * @returns {Array<boolean>}
   */
  var matchAll = function matchAll(regExp, str) {
    var matches;
    var arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };

  /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
  var isHTMLForm = kindOfTest('HTMLFormElement');
  var toCamelCase = function toCamelCase(str) {
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    });
  };

  /* Creating a function that will check if an object has a property. */
  var hasOwnProperty = function (_ref4) {
    var hasOwnProperty = _ref4.hasOwnProperty;
    return function (obj, prop) {
      return hasOwnProperty.call(obj, prop);
    };
  }(Object.prototype);

  /**
   * Determine if a value is a RegExp object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a RegExp object, otherwise false
   */
  var isRegExp = kindOfTest('RegExp');
  var reduceDescriptors = function reduceDescriptors(obj, reducer) {
    var descriptors = Object.getOwnPropertyDescriptors(obj);
    var reducedDescriptors = {};
    forEach(descriptors, function (descriptor, name) {
      var ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };

  /**
   * Makes all methods read-only
   * @param {Object} obj
   */

  var freezeMethods = function freezeMethods(obj) {
    reduceDescriptors(obj, function (descriptor, name) {
      // skip restricted props in strict mode
      if (isFunction$1(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
        return false;
      }
      var value = obj[name];
      if (!isFunction$1(value)) return;
      descriptor.enumerable = false;
      if ('writable' in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = function () {
          throw Error('Can not rewrite read-only method \'' + name + '\'');
        };
      }
    });
  };
  var toObjectSet = function toObjectSet(arrayOrString, delimiter) {
    var obj = {};
    var define = function define(arr) {
      arr.forEach(function (value) {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  var noop = function noop() {};
  var toFiniteNumber = function toFiniteNumber(value, defaultValue) {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };

  /**
   * If the thing is a FormData object, return true, otherwise return false.
   *
   * @param {unknown} thing - The thing to check.
   *
   * @returns {boolean}
   */
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
  }
  var toJSONObject = function toJSONObject(obj) {
    var stack = new Array(10);
    var visit = function visit(source, i) {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }

        //Buffer check
        if (isBuffer(source)) {
          return source;
        }
        if (!('toJSON' in source)) {
          stack[i] = source;
          var target = isArray(source) ? [] : {};
          forEach(source, function (value, key) {
            var reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = undefined;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  var isAsyncFn = kindOfTest('AsyncFunction');
  var isThenable = function isThenable(thing) {
    return thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing["catch"]);
  };

  // original code
  // https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

  var _setImmediate = function (setImmediateSupported, postMessageSupported) {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? function (token, callbacks) {
      _global.addEventListener("message", function (_ref5) {
        var source = _ref5.source,
          data = _ref5.data;
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return function (cb) {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    }("axios@".concat(Math.random()), []) : function (cb) {
      return setTimeout(cb);
    };
  }(typeof setImmediate === 'function', isFunction$1(_global.postMessage));
  var asap = typeof queueMicrotask !== 'undefined' ? queueMicrotask.bind(_global) : typeof process !== 'undefined' && process.nextTick || _setImmediate;

  // *********************

  var isIterable = function isIterable(thing) {
    return thing != null && isFunction$1(thing[iterator]);
  };
  var utils$1 = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isEmptyObject: isEmptyObject,
    isReadableStream: isReadableStream,
    isRequest: isRequest,
    isResponse: isResponse,
    isHeaders: isHeaders,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isRegExp: isRegExp,
    isFunction: isFunction$1,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isTypedArray: isTypedArray,
    isFileList: isFileList,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM,
    inherits: inherits,
    toFlatObject: toFlatObject,
    kindOf: kindOf,
    kindOfTest: kindOfTest,
    endsWith: endsWith,
    toArray: toArray,
    forEachEntry: forEachEntry,
    matchAll: matchAll,
    isHTMLForm: isHTMLForm,
    hasOwnProperty: hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors: reduceDescriptors,
    freezeMethods: freezeMethods,
    toObjectSet: toObjectSet,
    toCamelCase: toCamelCase,
    noop: noop,
    toFiniteNumber: toFiniteNumber,
    findKey: findKey,
    global: _global,
    isContextDefined: isContextDefined,
    isSpecCompliantForm: isSpecCompliantForm,
    toJSONObject: toJSONObject,
    isAsyncFn: isAsyncFn,
    isThenable: isThenable,
    setImmediate: _setImmediate,
    asap: asap,
    isIterable: isIterable
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [config] The config.
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   *
   * @returns {Error} The created error.
   */
  function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = 'AxiosError';
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  var prototype$1 = AxiosError.prototype;
  var descriptors = {};
  ['ERR_BAD_OPTION_VALUE', 'ERR_BAD_OPTION', 'ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK', 'ERR_FR_TOO_MANY_REDIRECTS', 'ERR_DEPRECATED', 'ERR_BAD_RESPONSE', 'ERR_BAD_REQUEST', 'ERR_CANCELED', 'ERR_NOT_SUPPORT', 'ERR_INVALID_URL'
  // eslint-disable-next-line func-names
  ].forEach(function (code) {
    descriptors[code] = {
      value: code
    };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, 'isAxiosError', {
    value: true
  });

  // eslint-disable-next-line func-names
  AxiosError.from = function (error, code, config, request, response, customProps) {
    var axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, function (prop) {
      return prop !== 'isAxiosError';
    });
    var msg = error && error.message ? error.message : 'Error';

    // Prefer explicit code; otherwise copy the low-level error's code (e.g. ECONNREFUSED)
    var errCode = code == null && error ? error.code : code;
    AxiosError.call(axiosError, msg, errCode, config, request, response);

    // Chain the original error on the standard field; non-enumerable to avoid JSON noise
    if (error && axiosError.cause == null) {
      Object.defineProperty(axiosError, 'cause', {
        value: error,
        configurable: true
      });
    }
    axiosError.name = error && error.name || 'Error';
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };

  // eslint-disable-next-line strict
  var httpAdapter = null;

  /**
   * Determines if the given thing is a array or js object.
   *
   * @param {string} thing - The object or array to be visited.
   *
   * @returns {boolean}
   */
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }

  /**
   * It removes the brackets from the end of a string
   *
   * @param {string} key - The key of the parameter.
   *
   * @returns {string} the key without the brackets.
   */
  function removeBrackets(key) {
    return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
  }

  /**
   * It takes a path, a key, and a boolean, and returns a string
   *
   * @param {string} path - The path to the current key.
   * @param {string} key - The key of the current object being iterated over.
   * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
   *
   * @returns {string} The path to the current key.
   */
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      // eslint-disable-next-line no-param-reassign
      token = removeBrackets(token);
      return !dots && i ? '[' + token + ']' : token;
    }).join(dots ? '.' : '');
  }

  /**
   * If the array is an array and none of its elements are visitable, then it's a flat array.
   *
   * @param {Array<any>} arr - The array to check
   *
   * @returns {boolean}
   */
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  var predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });

  /**
   * Convert a data object to FormData
   *
   * @param {Object} obj
   * @param {?Object} [formData]
   * @param {?Object} [options]
   * @param {Function} [options.visitor]
   * @param {Boolean} [options.metaTokens = true]
   * @param {Boolean} [options.dots = false]
   * @param {?Boolean} [options.indexes = false]
   *
   * @returns {Object}
   **/

  /**
   * It converts an object into a FormData object
   *
   * @param {Object<any, any>} obj - The object to convert to form data.
   * @param {string} formData - The FormData object to append to.
   * @param {Object<string, any>} options
   *
   * @returns
   */
  function toFormData(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError('target must be an object');
    }

    // eslint-disable-next-line no-param-reassign
    formData = formData || new (FormData)();

    // eslint-disable-next-line no-param-reassign
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      return !utils$1.isUndefined(source[option]);
    });
    var metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    var visitor = options.visitor || defaultVisitor;
    var dots = options.dots;
    var indexes = options.indexes;
    var _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
    var useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError('visitor must be a function');
    }
    function convertValue(value) {
      if (value === null) return '';
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (utils$1.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError('Blob is not supported. Use a Buffer instead.');
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }

    /**
     * Default visitor.
     *
     * @param {*} value
     * @param {String|Number} key
     * @param {Array<String|Number>} path
     * @this {FormData}
     *
     * @returns {boolean} return true to visit the each prop of the value recursively
     */
    function defaultVisitor(value, key, path) {
      var arr = value;
      if (value && !path && _typeof(value) === 'object') {
        if (utils$1.endsWith(key, '{}')) {
          // eslint-disable-next-line no-param-reassign
          key = metaTokens ? key : key.slice(0, -2);
          // eslint-disable-next-line no-param-reassign
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))) {
          // eslint-disable-next-line no-param-reassign
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + '[]', convertValue(el));
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    var stack = [];
    var exposedHelpers = Object.assign(predicates, {
      defaultVisitor: defaultVisitor,
      convertValue: convertValue,
      isVisitable: isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error('Circular reference detected in ' + path.join('.'));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        var result = !(utils$1.isUndefined(el) || el === null) && visitor.call(formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers);
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError('data must be an object');
    }
    build(obj);
    return formData;
  }

  /**
   * It encodes a string by replacing all characters that are not in the unreserved set with
   * their percent-encoded equivalents
   *
   * @param {string} str - The string to encode.
   *
   * @returns {string} The encoded string.
   */
  function encode$1(str) {
    var charMap = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }

  /**
   * It takes a params object and converts it to a FormData object
   *
   * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
   * @param {Object<string, any>} options - The options object passed to the Axios constructor.
   *
   * @returns {void}
   */
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData(params, this, options);
  }
  var prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString(encoder) {
    var _encode = encoder ? function (value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + '=' + _encode(pair[1]);
    }, '').join('&');
  };

  /**
   * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
   * URI encoded counterparts
   *
   * @param {string} val The value to be encoded.
   *
   * @returns {string} The encoded value.
   */
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @param {?(object|Function)} options
   *
   * @returns {string} The formatted url
   */
  function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }
    var _encode = options && options.encode || encode;
    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    var serializeFn = options && options.serialize;
    var serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }
    return url;
  }

  var InterceptorManager = /*#__PURE__*/function () {
    function InterceptorManager() {
      _classCallCheck(this, InterceptorManager);
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    _createClass(InterceptorManager, [{
      key: "use",
      value: function use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled: fulfilled,
          rejected: rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }

      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       *
       * @returns {void}
       */
    }, {
      key: "eject",
      value: function eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }

      /**
       * Clear all interceptors from the stack
       *
       * @returns {void}
       */
    }, {
      key: "clear",
      value: function clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }

      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       *
       * @returns {void}
       */
    }, {
      key: "forEach",
      value: function forEach(fn) {
        utils$1.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    }]);
    return InterceptorManager;
  }();
  var InterceptorManager$1 = InterceptorManager;

  var transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

  var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

  var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

  var platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
  };

  var hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';
  var _navigator = (typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && navigator || undefined;

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   *
   * @returns {boolean}
   */
  var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

  /**
   * Determine if we're running in a standard browser webWorker environment
   *
   * Although the `isStandardBrowserEnv` method indicates that
   * `allows axios to run in a web worker`, the WebWorker will still be
   * filtered out due to its judgment standard
   * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
   * This leads to a problem when axios post `FormData` in webWorker
   */
  var hasStandardBrowserWebWorkerEnv = function () {
    return typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === 'function';
  }();
  var origin = hasBrowserEnv && window.location.href || 'http://localhost';

  var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hasBrowserEnv: hasBrowserEnv,
    hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
    hasStandardBrowserEnv: hasStandardBrowserEnv,
    navigator: _navigator,
    origin: origin
  });

  var platform = _objectSpread2(_objectSpread2({}, utils), platform$1);

  function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), _objectSpread2({
      visitor: function visitor(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString('base64'));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }

  /**
   * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
   *
   * @param {string} name - The name of the property to get.
   *
   * @returns An array of strings.
   */
  function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(function (match) {
      return match[0] === '[]' ? '' : match[1] || match[0];
    });
  }

  /**
   * Convert an array to an object.
   *
   * @param {Array<any>} arr - The array to convert to an object.
   *
   * @returns An object with the same keys and values as the array.
   */
  function arrayToObject(arr) {
    var obj = {};
    var keys = Object.keys(arr);
    var i;
    var len = keys.length;
    var key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }

  /**
   * It takes a FormData object and returns a JavaScript object
   *
   * @param {string} formData The FormData object to convert to JSON.
   *
   * @returns {Object<string, any> | null} The converted object.
   */
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      var name = path[index++];
      if (name === '__proto__') return true;
      var isNumericKey = Number.isFinite(+name);
      var isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      var result = buildPath(path, value, target[name], index);
      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      var obj = {};
      utils$1.forEachEntry(formData, function (name, value) {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }

  /**
   * It takes a string, tries to parse it, and if it fails, it returns the stringified version
   * of the input
   *
   * @param {any} rawValue - The value to be stringified.
   * @param {Function} parser - A function that parses a string into a JavaScript object.
   * @param {Function} encoder - A function that takes a value and returns a string.
   *
   * @returns {string} A stringified version of the rawValue.
   */
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitionalDefaults,
    adapter: ['xhr', 'http', 'fetch'],
    transformRequest: [function transformRequest(data, headers) {
      var contentType = headers.getContentType() || '';
      var hasJSONContentType = contentType.indexOf('application/json') > -1;
      var isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      var isFormData = utils$1.isFormData(data);
      if (isFormData) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
        return data.toString();
      }
      var isFileList;
      if (isObjectPayload) {
        if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
          var _FormData = this.env && this.env.FormData;
          return toFormData(isFileList ? {
            'files[]': data
          } : data, _FormData && new _FormData(), this.formSerializer);
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType('application/json', false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      var transitional = this.transitional || defaults.transitional;
      var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      var JSONRequested = this.responseType === 'json';
      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': undefined
      }
    }
  };
  utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], function (method) {
    defaults.headers[method] = {};
  });
  var defaults$1 = defaults;

  // RawAxiosHeaders whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = utils$1.toObjectSet(['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent']);

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} rawHeaders Headers needing to be parsed
   *
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = (function (rawHeaders) {
    var parsed = {};
    var key;
    var val;
    var i;
    rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
      i = line.indexOf(':');
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === 'set-cookie') {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });
    return parsed;
  });

  var $internals = Symbol('internals');
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    var tokens = Object.create(null);
    var tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    var match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  var isValidHeaderName = function isValidHeaderName(str) {
    return /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  };
  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value)) return;
    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }
    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, function (w, _char, str) {
      return _char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    var accessorName = utils$1.toCamelCase(' ' + header);
    ['get', 'set', 'has'].forEach(function (methodName) {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function value(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  var AxiosHeaders = /*#__PURE__*/function (_Symbol$iterator, _Symbol$toStringTag) {
    function AxiosHeaders(headers) {
      _classCallCheck(this, AxiosHeaders);
      headers && this.set(headers);
    }
    _createClass(AxiosHeaders, [{
      key: "set",
      value: function set(header, valueOrRewrite, rewrite) {
        var self = this;
        function setHeader(_value, _header, _rewrite) {
          var lHeader = normalizeHeader(_header);
          if (!lHeader) {
            throw new Error('header name must be a non-empty string');
          }
          var key = utils$1.findKey(self, lHeader);
          if (!key || self[key] === undefined || _rewrite === true || _rewrite === undefined && self[key] !== false) {
            self[key || _header] = normalizeValue(_value);
          }
        }
        var setHeaders = function setHeaders(headers, _rewrite) {
          return utils$1.forEach(headers, function (_value, _header) {
            return setHeader(_value, _header, _rewrite);
          });
        };
        if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
          setHeaders(header, valueOrRewrite);
        } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
          setHeaders(parseHeaders(header), valueOrRewrite);
        } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
          var obj = {},
            dest,
            key;
          var _iterator = _createForOfIteratorHelper(header),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var entry = _step.value;
              if (!utils$1.isArray(entry)) {
                throw TypeError('Object iterator must return a key-value pair');
              }
              obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [].concat(_toConsumableArray(dest), [entry[1]]) : [dest, entry[1]] : entry[1];
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          setHeaders(obj, valueOrRewrite);
        } else {
          header != null && setHeader(valueOrRewrite, header, rewrite);
        }
        return this;
      }
    }, {
      key: "get",
      value: function get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
          var key = utils$1.findKey(this, header);
          if (key) {
            var value = this[key];
            if (!parser) {
              return value;
            }
            if (parser === true) {
              return parseTokens(value);
            }
            if (utils$1.isFunction(parser)) {
              return parser.call(this, value, key);
            }
            if (utils$1.isRegExp(parser)) {
              return parser.exec(value);
            }
            throw new TypeError('parser must be boolean|regexp|function');
          }
        }
      }
    }, {
      key: "has",
      value: function has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
          var key = utils$1.findKey(this, header);
          return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
      }
    }, {
      key: "delete",
      value: function _delete(header, matcher) {
        var self = this;
        var deleted = false;
        function deleteHeader(_header) {
          _header = normalizeHeader(_header);
          if (_header) {
            var key = utils$1.findKey(self, _header);
            if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
              delete self[key];
              deleted = true;
            }
          }
        }
        if (utils$1.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }
        return deleted;
      }
    }, {
      key: "clear",
      value: function clear(matcher) {
        var keys = Object.keys(this);
        var i = keys.length;
        var deleted = false;
        while (i--) {
          var key = keys[i];
          if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
            delete this[key];
            deleted = true;
          }
        }
        return deleted;
      }
    }, {
      key: "normalize",
      value: function normalize(format) {
        var self = this;
        var headers = {};
        utils$1.forEach(this, function (value, header) {
          var key = utils$1.findKey(headers, header);
          if (key) {
            self[key] = normalizeValue(value);
            delete self[header];
            return;
          }
          var normalized = format ? formatHeader(header) : String(header).trim();
          if (normalized !== header) {
            delete self[header];
          }
          self[normalized] = normalizeValue(value);
          headers[normalized] = true;
        });
        return this;
      }
    }, {
      key: "concat",
      value: function concat() {
        var _this$constructor;
        for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
          targets[_key] = arguments[_key];
        }
        return (_this$constructor = this.constructor).concat.apply(_this$constructor, [this].concat(targets));
      }
    }, {
      key: "toJSON",
      value: function toJSON(asStrings) {
        var obj = Object.create(null);
        utils$1.forEach(this, function (value, header) {
          value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
        });
        return obj;
      }
    }, {
      key: _Symbol$iterator,
      value: function value() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }
    }, {
      key: "toString",
      value: function toString() {
        return Object.entries(this.toJSON()).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            header = _ref2[0],
            value = _ref2[1];
          return header + ': ' + value;
        }).join('\n');
      }
    }, {
      key: "getSetCookie",
      value: function getSetCookie() {
        return this.get("set-cookie") || [];
      }
    }, {
      key: _Symbol$toStringTag,
      get: function get() {
        return 'AxiosHeaders';
      }
    }], [{
      key: "from",
      value: function from(thing) {
        return thing instanceof this ? thing : new this(thing);
      }
    }, {
      key: "concat",
      value: function concat(first) {
        var computed = new this(first);
        for (var _len2 = arguments.length, targets = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          targets[_key2 - 1] = arguments[_key2];
        }
        targets.forEach(function (target) {
          return computed.set(target);
        });
        return computed;
      }
    }, {
      key: "accessor",
      value: function accessor(header) {
        var internals = this[$internals] = this[$internals] = {
          accessors: {}
        };
        var accessors = internals.accessors;
        var prototype = this.prototype;
        function defineAccessor(_header) {
          var lHeader = normalizeHeader(_header);
          if (!accessors[lHeader]) {
            buildAccessors(prototype, _header);
            accessors[lHeader] = true;
          }
        }
        utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
      }
    }]);
    return AxiosHeaders;
  }(Symbol.iterator, Symbol.toStringTag);
  AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

  // reserved names hotfix
  utils$1.reduceDescriptors(AxiosHeaders.prototype, function (_ref3, key) {
    var value = _ref3.value;
    var mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
    return {
      get: function get() {
        return value;
      },
      set: function set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders);
  var AxiosHeaders$1 = AxiosHeaders;

  /**
   * Transform the data for a request or a response
   *
   * @param {Array|Function} fns A single function or Array of functions
   * @param {?Object} response The response object
   *
   * @returns {*} The resulting transformed data
   */
  function transformData(fns, response) {
    var config = this || defaults$1;
    var context = response || config;
    var headers = AxiosHeaders$1.from(context.headers);
    var data = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });
    headers.normalize();
    return data;
  }

  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
    this.name = 'CanceledError';
  }
  utils$1.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
  });

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   *
   * @returns {object} The response.
   */
  function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError('Request failed with status code ' + response.status, [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
    }
  }

  function parseProtocol(url) {
    var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || '';
  }

  /**
   * Calculate data maxRate
   * @param {Number} [samplesCount= 10]
   * @param {Number} [min= 1000]
   * @returns {Function}
   */
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    var bytes = new Array(samplesCount);
    var timestamps = new Array(samplesCount);
    var head = 0;
    var tail = 0;
    var firstSampleTS;
    min = min !== undefined ? min : 1000;
    return function push(chunkLength) {
      var now = Date.now();
      var startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      var i = tail;
      var bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      var passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
  }

  /**
   * Throttle decorator
   * @param {Function} fn
   * @param {Number} freq
   * @return {Function}
   */
  function throttle(fn, freq) {
    var timestamp = 0;
    var threshold = 1000 / freq;
    var lastArgs;
    var timer;
    var invoke = function invoke(args) {
      var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(void 0, _toConsumableArray(args));
    };
    var throttled = function throttled() {
      var now = Date.now();
      var passed = now - timestamp;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(function () {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    var flush = function flush() {
      return lastArgs && invoke(lastArgs);
    };
    return [throttled, flush];
  }

  var progressEventReducer = function progressEventReducer(listener, isDownloadStream) {
    var freq = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    var bytesNotified = 0;
    var _speedometer = speedometer(50, 250);
    return throttle(function (e) {
      var loaded = e.loaded;
      var total = e.lengthComputable ? e.total : undefined;
      var progressBytes = loaded - bytesNotified;
      var rate = _speedometer(progressBytes);
      var inRange = loaded <= total;
      bytesNotified = loaded;
      var data = _defineProperty({
        loaded: loaded,
        total: total,
        progress: total ? loaded / total : undefined,
        bytes: progressBytes,
        rate: rate ? rate : undefined,
        estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
        event: e,
        lengthComputable: total != null
      }, isDownloadStream ? 'download' : 'upload', true);
      listener(data);
    }, freq);
  };
  var progressEventDecorator = function progressEventDecorator(total, throttled) {
    var lengthComputable = total != null;
    return [function (loaded) {
      return throttled[0]({
        lengthComputable: lengthComputable,
        total: total,
        loaded: loaded
      });
    }, throttled[1]];
  };
  var asyncDecorator = function asyncDecorator(fn) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return utils$1.asap(function () {
        return fn.apply(void 0, args);
      });
    };
  };

  var isURLSameOrigin = platform.hasStandardBrowserEnv ? function (origin, isMSIE) {
    return function (url) {
      url = new URL(url, platform.origin);
      return origin.protocol === url.protocol && origin.host === url.host && (isMSIE || origin.port === url.port);
    };
  }(new URL(platform.origin), platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)) : function () {
    return true;
  };

  var cookies = platform.hasStandardBrowserEnv ?
  // Standard browser envs support document.cookie
  {
    write: function write(name, value, expires, path, domain, secure, sameSite) {
      if (typeof document === 'undefined') return;
      var cookie = ["".concat(name, "=").concat(encodeURIComponent(value))];
      if (utils$1.isNumber(expires)) {
        cookie.push("expires=".concat(new Date(expires).toUTCString()));
      }
      if (utils$1.isString(path)) {
        cookie.push("path=".concat(path));
      }
      if (utils$1.isString(domain)) {
        cookie.push("domain=".concat(domain));
      }
      if (secure === true) {
        cookie.push('secure');
      }
      if (utils$1.isString(sameSite)) {
        cookie.push("SameSite=".concat(sameSite));
      }
      document.cookie = cookie.join('; ');
    },
    read: function read(name) {
      if (typeof document === 'undefined') return null;
      var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    },
    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000, '/');
    }
  } :
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   *
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   *
   * @returns {string} The combined URL
   */
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
  }

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   *
   * @returns {string} The combined full path
   */
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    var isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  var headersToObject = function headersToObject(thing) {
    return thing instanceof AxiosHeaders$1 ? _objectSpread2({}, thing) : thing;
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   *
   * @returns {Object} New object resulting from merging config2 to config1
   */
  function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({
          caseless: caseless
        }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(undefined, a, prop, caseless);
      }
    }

    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(undefined, b);
      }
    }

    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(undefined, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(undefined, a);
      }
    }

    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(undefined, a);
      }
    }
    var mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: function headers(a, b, prop) {
        return mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true);
      }
    };
    utils$1.forEach(Object.keys(_objectSpread2(_objectSpread2({}, config1), config2)), function computeConfigValue(prop) {
      var merge = mergeMap[prop] || mergeDeepProperties;
      var configValue = merge(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }

  var resolveConfig = (function (config) {
    var newConfig = mergeConfig({}, config);
    var data = newConfig.data,
      withXSRFToken = newConfig.withXSRFToken,
      xsrfHeaderName = newConfig.xsrfHeaderName,
      xsrfCookieName = newConfig.xsrfCookieName,
      headers = newConfig.headers,
      auth = newConfig.auth;
    newConfig.headers = headers = AxiosHeaders$1.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

    // HTTP basic authentication
    if (auth) {
      headers.set('Authorization', 'Basic ' + btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : '')));
    }
    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(undefined); // browser handles it
      } else if (utils$1.isFunction(data.getHeaders)) {
        // Node.js FormData (like form-data package)
        var formHeaders = data.getHeaders();
        // Only set safe headers to avoid overwriting security headers
        var allowedHeaders = ['content-type', 'content-length'];
        Object.entries(formHeaders).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            val = _ref2[1];
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.

    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        // Add xsrf header
        var xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  });

  var isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';
  var xhrAdapter = isXHRAdapterSupported && function (config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var _config = resolveConfig(config);
      var requestData = _config.data;
      var requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
      var responseType = _config.responseType,
        onUploadProgress = _config.onUploadProgress,
        onDownloadProgress = _config.onDownloadProgress;
      var onCanceled;
      var uploadThrottled, downloadThrottled;
      var flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload(); // flush events
        flushDownload && flushDownload(); // flush events

        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener('abort', onCanceled);
      }
      var request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);

      // Set the request timeout in MS
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        var responseHeaders = AxiosHeaders$1.from('getAllResponseHeaders' in request && request.getAllResponseHeaders());
        var responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);

        // Clean up request
        request = null;
      }
      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError(event) {
        // Browsers deliver a ProgressEvent in XHR onerror
        // (message may be empty; when present, surface it)
        // See https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/error_event
        var msg = event && event.message ? event.message : 'Network Error';
        var err = new AxiosError(msg, AxiosError.ERR_NETWORK, config, request);
        // attach the underlying event for consumers who want details
        err.event = event || null;
        reject(err);
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
        var transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request));

        // Clean up request
        request = null;
      };

      // Remove Content-Type if data is undefined
      requestData === undefined && requestHeaders.setContentType(null);

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }

      // Add withCredentials to request if needed
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = _config.responseType;
      }

      // Handle progress if needed
      if (onDownloadProgress) {
        var _progressEventReducer = progressEventReducer(onDownloadProgress, true);
        var _progressEventReducer2 = _slicedToArray(_progressEventReducer, 2);
        downloadThrottled = _progressEventReducer2[0];
        flushDownload = _progressEventReducer2[1];
        request.addEventListener('progress', downloadThrottled);
      }

      // Not all browsers support upload events
      if (onUploadProgress && request.upload) {
        var _progressEventReducer3 = progressEventReducer(onUploadProgress);
        var _progressEventReducer4 = _slicedToArray(_progressEventReducer3, 2);
        uploadThrottled = _progressEventReducer4[0];
        flushUpload = _progressEventReducer4[1];
        request.upload.addEventListener('progress', uploadThrottled);
        request.upload.addEventListener('loadend', flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        // Handle cancellation
        // eslint-disable-next-line func-names
        onCanceled = function onCanceled(cancel) {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
        }
      }
      var protocol = parseProtocol(_config.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
        return;
      }

      // Send the request
      request.send(requestData || null);
    });
  };

  var composeSignals = function composeSignals(signals, timeout) {
    var _signals = signals = signals ? signals.filter(Boolean) : [],
      length = _signals.length;
    if (timeout || length) {
      var controller = new AbortController();
      var aborted;
      var onabort = function onabort(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          var err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
        }
      };
      var timer = timeout && setTimeout(function () {
        timer = null;
        onabort(new AxiosError("timeout ".concat(timeout, " of ms exceeded"), AxiosError.ETIMEDOUT));
      }, timeout);
      var unsubscribe = function unsubscribe() {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach(function (signal) {
            signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
          });
          signals = null;
        }
      };
      signals.forEach(function (signal) {
        return signal.addEventListener('abort', onabort);
      });
      var signal = controller.signal;
      signal.unsubscribe = function () {
        return utils$1.asap(unsubscribe);
      };
      return signal;
    }
  };
  var composeSignals$1 = composeSignals;

  var streamChunk = /*#__PURE__*/_regeneratorRuntime().mark(function streamChunk(chunk, chunkSize) {
    var len, pos, end;
    return _regeneratorRuntime().wrap(function streamChunk$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          len = chunk.byteLength;
          if (!(!chunkSize || len < chunkSize)) {
            _context.next = 5;
            break;
          }
          _context.next = 4;
          return chunk;
        case 4:
          return _context.abrupt("return");
        case 5:
          pos = 0;
        case 6:
          if (!(pos < len)) {
            _context.next = 13;
            break;
          }
          end = pos + chunkSize;
          _context.next = 10;
          return chunk.slice(pos, end);
        case 10:
          pos = end;
          _context.next = 6;
          break;
        case 13:
        case "end":
          return _context.stop();
      }
    }, streamChunk);
  });
  var readBytes = /*#__PURE__*/function () {
    var _ref = _wrapAsyncGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(iterable, chunkSize) {
      var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk;
      return _regeneratorRuntime().wrap(function _callee$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context2.prev = 2;
            _iterator = _asyncIterator(readStream(iterable));
          case 4:
            _context2.next = 6;
            return _awaitAsyncGenerator(_iterator.next());
          case 6:
            if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
              _context2.next = 12;
              break;
            }
            chunk = _step.value;
            return _context2.delegateYield(_asyncGeneratorDelegate(_asyncIterator(streamChunk(chunk, chunkSize))), "t0", 9);
          case 9:
            _iteratorAbruptCompletion = false;
            _context2.next = 4;
            break;
          case 12:
            _context2.next = 18;
            break;
          case 14:
            _context2.prev = 14;
            _context2.t1 = _context2["catch"](2);
            _didIteratorError = true;
            _iteratorError = _context2.t1;
          case 18:
            _context2.prev = 18;
            _context2.prev = 19;
            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context2.next = 23;
              break;
            }
            _context2.next = 23;
            return _awaitAsyncGenerator(_iterator["return"]());
          case 23:
            _context2.prev = 23;
            if (!_didIteratorError) {
              _context2.next = 26;
              break;
            }
            throw _iteratorError;
          case 26:
            return _context2.finish(23);
          case 27:
            return _context2.finish(18);
          case 28:
          case "end":
            return _context2.stop();
        }
      }, _callee, null, [[2, 14, 18, 28], [19,, 23, 27]]);
    }));
    return function readBytes(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
  var readStream = /*#__PURE__*/function () {
    var _ref2 = _wrapAsyncGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(stream) {
      var reader, _yield$_awaitAsyncGen, done, value;
      return _regeneratorRuntime().wrap(function _callee2$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!stream[Symbol.asyncIterator]) {
              _context3.next = 3;
              break;
            }
            return _context3.delegateYield(_asyncGeneratorDelegate(_asyncIterator(stream)), "t0", 2);
          case 2:
            return _context3.abrupt("return");
          case 3:
            reader = stream.getReader();
            _context3.prev = 4;
          case 5:
            _context3.next = 7;
            return _awaitAsyncGenerator(reader.read());
          case 7:
            _yield$_awaitAsyncGen = _context3.sent;
            done = _yield$_awaitAsyncGen.done;
            value = _yield$_awaitAsyncGen.value;
            if (!done) {
              _context3.next = 12;
              break;
            }
            return _context3.abrupt("break", 16);
          case 12:
            _context3.next = 14;
            return value;
          case 14:
            _context3.next = 5;
            break;
          case 16:
            _context3.prev = 16;
            _context3.next = 19;
            return _awaitAsyncGenerator(reader.cancel());
          case 19:
            return _context3.finish(16);
          case 20:
          case "end":
            return _context3.stop();
        }
      }, _callee2, null, [[4,, 16, 20]]);
    }));
    return function readStream(_x3) {
      return _ref2.apply(this, arguments);
    };
  }();
  var trackStream = function trackStream(stream, chunkSize, onProgress, onFinish) {
    var iterator = readBytes(stream, chunkSize);
    var bytes = 0;
    var done;
    var _onFinish = function _onFinish(e) {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      pull: function pull(controller) {
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var _yield$iterator$next, _done, value, len, loadedBytes;
          return _regeneratorRuntime().wrap(function _callee3$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return iterator.next();
              case 3:
                _yield$iterator$next = _context4.sent;
                _done = _yield$iterator$next.done;
                value = _yield$iterator$next.value;
                if (!_done) {
                  _context4.next = 10;
                  break;
                }
                _onFinish();
                controller.close();
                return _context4.abrupt("return");
              case 10:
                len = value.byteLength;
                if (onProgress) {
                  loadedBytes = bytes += len;
                  onProgress(loadedBytes);
                }
                controller.enqueue(new Uint8Array(value));
                _context4.next = 19;
                break;
              case 15:
                _context4.prev = 15;
                _context4.t0 = _context4["catch"](0);
                _onFinish(_context4.t0);
                throw _context4.t0;
              case 19:
              case "end":
                return _context4.stop();
            }
          }, _callee3, null, [[0, 15]]);
        }))();
      },
      cancel: function cancel(reason) {
        _onFinish(reason);
        return iterator["return"]();
      }
    }, {
      highWaterMark: 2
    });
  };

  var DEFAULT_CHUNK_SIZE = 64 * 1024;
  var isFunction = utils$1.isFunction;
  var globalFetchAPI = function (_ref) {
    var Request = _ref.Request,
      Response = _ref.Response;
    return {
      Request: Request,
      Response: Response
    };
  }(utils$1.global);
  var _utils$global = utils$1.global,
    ReadableStream$1 = _utils$global.ReadableStream,
    TextEncoder = _utils$global.TextEncoder;
  var test = function test(fn) {
    try {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return !!fn.apply(void 0, args);
    } catch (e) {
      return false;
    }
  };
  var factory = function factory(env) {
    env = utils$1.merge.call({
      skipUndefined: true
    }, globalFetchAPI, env);
    var _env = env,
      envFetch = _env.fetch,
      Request = _env.Request,
      Response = _env.Response;
    var isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === 'function';
    var isRequestSupported = isFunction(Request);
    var isResponseSupported = isFunction(Response);
    if (!isFetchSupported) {
      return false;
    }
    var isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
    var encodeText = isFetchSupported && (typeof TextEncoder === 'function' ? function (encoder) {
      return function (str) {
        return encoder.encode(str);
      };
    }(new TextEncoder()) : ( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(str) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = Uint8Array;
              _context.next = 3;
              return new Request(str).arrayBuffer();
            case 3:
              _context.t1 = _context.sent;
              return _context.abrupt("return", new _context.t0(_context.t1));
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }()));
    var supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(function () {
      var duplexAccessed = false;
      var hasContentType = new Request(platform.origin, {
        body: new ReadableStream$1(),
        method: 'POST',
        get duplex() {
          duplexAccessed = true;
          return 'half';
        }
      }).headers.has('Content-Type');
      return duplexAccessed && !hasContentType;
    });
    var supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(function () {
      return utils$1.isReadableStream(new Response('').body);
    });
    var resolvers = {
      stream: supportsResponseStream && function (res) {
        return res.body;
      }
    };
    isFetchSupported && function () {
      ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(function (type) {
        !resolvers[type] && (resolvers[type] = function (res, config) {
          var method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError("Response type '".concat(type, "' is not supported"), AxiosError.ERR_NOT_SUPPORT, config);
        });
      });
    }();
    var getBodyLength = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(body) {
        var _request;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(body == null)) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return", 0);
            case 2:
              if (!utils$1.isBlob(body)) {
                _context2.next = 4;
                break;
              }
              return _context2.abrupt("return", body.size);
            case 4:
              if (!utils$1.isSpecCompliantForm(body)) {
                _context2.next = 9;
                break;
              }
              _request = new Request(platform.origin, {
                method: 'POST',
                body: body
              });
              _context2.next = 8;
              return _request.arrayBuffer();
            case 8:
              return _context2.abrupt("return", _context2.sent.byteLength);
            case 9:
              if (!(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body))) {
                _context2.next = 11;
                break;
              }
              return _context2.abrupt("return", body.byteLength);
            case 11:
              if (utils$1.isURLSearchParams(body)) {
                body = body + '';
              }
              if (!utils$1.isString(body)) {
                _context2.next = 16;
                break;
              }
              _context2.next = 15;
              return encodeText(body);
            case 15:
              return _context2.abrupt("return", _context2.sent.byteLength);
            case 16:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function getBodyLength(_x2) {
        return _ref3.apply(this, arguments);
      };
    }();
    var resolveBodyLength = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(headers, body) {
        var length;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              length = utils$1.toFiniteNumber(headers.getContentLength());
              return _context3.abrupt("return", length == null ? getBodyLength(body) : length);
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function resolveBodyLength(_x3, _x4) {
        return _ref4.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(config) {
        var _resolveConfig, url, method, data, signal, cancelToken, timeout, onDownloadProgress, onUploadProgress, responseType, headers, _resolveConfig$withCr, withCredentials, fetchOptions, _fetch, composedSignal, request, unsubscribe, requestContentLength, _request, contentTypeHeader, _progressEventDecorat, _progressEventDecorat2, onProgress, flush, isCredentialsSupported, resolvedOptions, response, isStreamResponse, options, responseContentLength, _ref6, _ref7, _onProgress, _flush, responseData;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _resolveConfig = resolveConfig(config), url = _resolveConfig.url, method = _resolveConfig.method, data = _resolveConfig.data, signal = _resolveConfig.signal, cancelToken = _resolveConfig.cancelToken, timeout = _resolveConfig.timeout, onDownloadProgress = _resolveConfig.onDownloadProgress, onUploadProgress = _resolveConfig.onUploadProgress, responseType = _resolveConfig.responseType, headers = _resolveConfig.headers, _resolveConfig$withCr = _resolveConfig.withCredentials, withCredentials = _resolveConfig$withCr === void 0 ? 'same-origin' : _resolveConfig$withCr, fetchOptions = _resolveConfig.fetchOptions;
              _fetch = envFetch || fetch;
              responseType = responseType ? (responseType + '').toLowerCase() : 'text';
              composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
              request = null;
              unsubscribe = composedSignal && composedSignal.unsubscribe && function () {
                composedSignal.unsubscribe();
              };
              _context4.prev = 6;
              _context4.t0 = onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head';
              if (!_context4.t0) {
                _context4.next = 13;
                break;
              }
              _context4.next = 11;
              return resolveBodyLength(headers, data);
            case 11:
              _context4.t1 = requestContentLength = _context4.sent;
              _context4.t0 = _context4.t1 !== 0;
            case 13:
              if (!_context4.t0) {
                _context4.next = 17;
                break;
              }
              _request = new Request(url, {
                method: 'POST',
                body: data,
                duplex: "half"
              });
              if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
                headers.setContentType(contentTypeHeader);
              }
              if (_request.body) {
                _progressEventDecorat = progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress))), _progressEventDecorat2 = _slicedToArray(_progressEventDecorat, 2), onProgress = _progressEventDecorat2[0], flush = _progressEventDecorat2[1];
                data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
              }
            case 17:
              if (!utils$1.isString(withCredentials)) {
                withCredentials = withCredentials ? 'include' : 'omit';
              }

              // Cloudflare Workers throws when credentials are defined
              // see https://github.com/cloudflare/workerd/issues/902
              isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
              resolvedOptions = _objectSpread2(_objectSpread2({}, fetchOptions), {}, {
                signal: composedSignal,
                method: method.toUpperCase(),
                headers: headers.normalize().toJSON(),
                body: data,
                duplex: "half",
                credentials: isCredentialsSupported ? withCredentials : undefined
              });
              request = isRequestSupported && new Request(url, resolvedOptions);
              _context4.next = 23;
              return isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions);
            case 23:
              response = _context4.sent;
              isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');
              if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
                options = {};
                ['status', 'statusText', 'headers'].forEach(function (prop) {
                  options[prop] = response[prop];
                });
                responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));
                _ref6 = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [], _ref7 = _slicedToArray(_ref6, 2), _onProgress = _ref7[0], _flush = _ref7[1];
                response = new Response(trackStream(response.body, DEFAULT_CHUNK_SIZE, _onProgress, function () {
                  _flush && _flush();
                  unsubscribe && unsubscribe();
                }), options);
              }
              responseType = responseType || 'text';
              _context4.next = 29;
              return resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);
            case 29:
              responseData = _context4.sent;
              !isStreamResponse && unsubscribe && unsubscribe();
              _context4.next = 33;
              return new Promise(function (resolve, reject) {
                settle(resolve, reject, {
                  data: responseData,
                  headers: AxiosHeaders$1.from(response.headers),
                  status: response.status,
                  statusText: response.statusText,
                  config: config,
                  request: request
                });
              });
            case 33:
              return _context4.abrupt("return", _context4.sent);
            case 36:
              _context4.prev = 36;
              _context4.t2 = _context4["catch"](6);
              unsubscribe && unsubscribe();
              if (!(_context4.t2 && _context4.t2.name === 'TypeError' && /Load failed|fetch/i.test(_context4.t2.message))) {
                _context4.next = 41;
                break;
              }
              throw Object.assign(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request), {
                cause: _context4.t2.cause || _context4.t2
              });
            case 41:
              throw AxiosError.from(_context4.t2, _context4.t2 && _context4.t2.code, config, request);
            case 42:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[6, 36]]);
      }));
      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }();
  };
  var seedCache = new Map();
  var getFetch = function getFetch(config) {
    var env = config && config.env || {};
    var fetch = env.fetch,
      Request = env.Request,
      Response = env.Response;
    var seeds = [Request, Response, fetch];
    var len = seeds.length,
      i = len,
      seed,
      target,
      map = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map.get(seed);
      target === undefined && map.set(seed, target = i ? new Map() : factory(env));
      map = target;
    }
    return target;
  };
  getFetch();

  /**
   * Known adapters mapping.
   * Provides environment-specific adapters for Axios:
   * - `http` for Node.js
   * - `xhr` for browsers
   * - `fetch` for fetch API-based requests
   * 
   * @type {Object<string, Function|Object>}
   */
  var knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: {
      get: getFetch
    }
  };

  // Assign adapter names for easier debugging and identification
  utils$1.forEach(knownAdapters, function (fn, value) {
    if (fn) {
      try {
        Object.defineProperty(fn, 'name', {
          value: value
        });
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
      Object.defineProperty(fn, 'adapterName', {
        value: value
      });
    }
  });

  /**
   * Render a rejection reason string for unknown or unsupported adapters
   * 
   * @param {string} reason
   * @returns {string}
   */
  var renderReason = function renderReason(reason) {
    return "- ".concat(reason);
  };

  /**
   * Check if the adapter is resolved (function, null, or false)
   * 
   * @param {Function|null|false} adapter
   * @returns {boolean}
   */
  var isResolvedHandle = function isResolvedHandle(adapter) {
    return utils$1.isFunction(adapter) || adapter === null || adapter === false;
  };

  /**
   * Get the first suitable adapter from the provided list.
   * Tries each adapter in order until a supported one is found.
   * Throws an AxiosError if no adapter is suitable.
   * 
   * @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
   * @param {Object} config - Axios request configuration
   * @throws {AxiosError} If no suitable adapter is available
   * @returns {Function} The resolved adapter function
   */
  function getAdapter(adapters, config) {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];
    var _adapters = adapters,
      length = _adapters.length;
    var nameOrAdapter;
    var adapter;
    var rejectedReasons = {};
    for (var i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      var id = void 0;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === undefined) {
          throw new AxiosError("Unknown adapter '".concat(id, "'"));
        }
      }
      if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
        break;
      }
      rejectedReasons[id || '#' + i] = adapter;
    }
    if (!adapter) {
      var reasons = Object.entries(rejectedReasons).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          id = _ref2[0],
          state = _ref2[1];
        return "adapter ".concat(id, " ") + (state === false ? 'is not supported by the environment' : 'is not available in the build');
      });
      var s = length ? reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0]) : 'as no adapter specified';
      throw new AxiosError("There is no suitable adapter to dispatch the request " + s, 'ERR_NOT_SUPPORT');
    }
    return adapter;
  }

  /**
   * Exports Axios adapters and utility to resolve an adapter
   */
  var adapters = {
    /**
     * Resolve an adapter from a list of adapter names or functions.
     * @type {Function}
     */
    getAdapter: getAdapter,
    /**
     * Exposes all known adapters
     * @type {Object<string, Function|Object>}
     */
    adapters: knownAdapters
  };

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   *
   * @param {Object} config The config that is to be used for the request
   *
   * @returns {void}
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError(null, config);
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders$1.from(config.headers);

    // Transform request data
    config.data = transformData.call(config, config.transformRequest);
    if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
      config.headers.setContentType('application/x-www-form-urlencoded', false);
    }
    var adapter = adapters.getAdapter(config.adapter || defaults$1.adapter, config);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(config, config.transformResponse, response);
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(config, config.transformResponse, reason.response);
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }

  var VERSION = "1.13.2";

  var validators$1 = {};

  // eslint-disable-next-line func-names
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function (type, i) {
    validators$1[type] = function validator(thing) {
      return _typeof(thing) === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });
  var deprecatedWarnings = {};

  /**
   * Transitional option validator
   *
   * @param {function|boolean?} validator - set to false if the transitional option has been removed
   * @param {string?} version - deprecated version / removed since version
   * @param {string?} message - some message with additional info
   *
   * @returns {function}
   */
  validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    // eslint-disable-next-line func-names
    return function (value, opt, opts) {
      if (validator === false) {
        throw new AxiosError(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')), AxiosError.ERR_DEPRECATED);
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        // eslint-disable-next-line no-console
        console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return function (value, opt) {
      // eslint-disable-next-line no-console
      console.warn("".concat(opt, " is likely a misspelling of ").concat(correctSpelling));
      return true;
    };
  };

  /**
   * Assert object's properties type
   *
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   *
   * @returns {object}
   */

  function assertOptions(options, schema, allowUnknown) {
    if (_typeof(options) !== 'object') {
      throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator = schema[opt];
      if (validator) {
        var value = options[opt];
        var result = value === undefined || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }
  var validator = {
    assertOptions: assertOptions,
    validators: validators$1
  };

  var validators = validator.validators;

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   *
   * @return {Axios} A new instance of Axios
   */
  var Axios = /*#__PURE__*/function () {
    function Axios(instanceConfig) {
      _classCallCheck(this, Axios);
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager$1(),
        response: new InterceptorManager$1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    _createClass(Axios, [{
      key: "request",
      value: (function () {
        var _request2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(configOrUrl, config) {
          var dummy, stack;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._request(configOrUrl, config);
              case 3:
                return _context.abrupt("return", _context.sent);
              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](0);
                if (_context.t0 instanceof Error) {
                  dummy = {};
                  Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();

                  // slice off the Error: ... line
                  stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
                  try {
                    if (!_context.t0.stack) {
                      _context.t0.stack = stack;
                      // match without the 2 top stack lines
                    } else if (stack && !String(_context.t0.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
                      _context.t0.stack += '\n' + stack;
                    }
                  } catch (e) {
                    // ignore the case where "stack" is an un-writable property
                  }
                }
                throw _context.t0;
              case 10:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[0, 6]]);
        }));
        function request(_x, _x2) {
          return _request2.apply(this, arguments);
        }
        return request;
      }())
    }, {
      key: "_request",
      value: function _request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === 'string') {
          config = config || {};
          config.url = configOrUrl;
        } else {
          config = configOrUrl || {};
        }
        config = mergeConfig(this.defaults, config);
        var _config = config,
          transitional = _config.transitional,
          paramsSerializer = _config.paramsSerializer,
          headers = _config.headers;
        if (transitional !== undefined) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators["boolean"]),
            forcedJSONParsing: validators.transitional(validators["boolean"]),
            clarifyTimeoutError: validators.transitional(validators["boolean"])
          }, false);
        }
        if (paramsSerializer != null) {
          if (utils$1.isFunction(paramsSerializer)) {
            config.paramsSerializer = {
              serialize: paramsSerializer
            };
          } else {
            validator.assertOptions(paramsSerializer, {
              encode: validators["function"],
              serialize: validators["function"]
            }, true);
          }
        }

        // Set config.allowAbsoluteUrls
        if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
          config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
        } else {
          config.allowAbsoluteUrls = true;
        }
        validator.assertOptions(config, {
          baseUrl: validators.spelling('baseURL'),
          withXsrfToken: validators.spelling('withXSRFToken')
        }, true);

        // Set config.method
        config.method = (config.method || this.defaults.method || 'get').toLowerCase();

        // Flatten headers
        var contextHeaders = headers && utils$1.merge(headers.common, headers[config.method]);
        headers && utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function (method) {
          delete headers[method];
        });
        config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

        // filter out skipped interceptors
        var requestInterceptorChain = [];
        var synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
            return;
          }
          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        var responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        var promise;
        var i = 0;
        var len;
        if (!synchronousRequestInterceptors) {
          var chain = [dispatchRequest.bind(this), undefined];
          chain.unshift.apply(chain, requestInterceptorChain);
          chain.push.apply(chain, responseInterceptorChain);
          len = chain.length;
          promise = Promise.resolve(config);
          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }
          return promise;
        }
        len = requestInterceptorChain.length;
        var newConfig = config;
        while (i < len) {
          var onFulfilled = requestInterceptorChain[i++];
          var onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }
        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }
        return promise;
      }
    }, {
      key: "getUri",
      value: function getUri(config) {
        config = mergeConfig(this.defaults, config);
        var fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
        return buildURL(fullPath, config.params, config.paramsSerializer);
      }
    }]);
    return Axios;
  }(); // Provide aliases for supported request methods
  utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function (url, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/

    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          headers: isForm ? {
            'Content-Type': 'multipart/form-data'
          } : {},
          url: url,
          data: data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
  });
  var Axios$1 = Axios;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @param {Function} executor The executor function.
   *
   * @returns {CancelToken}
   */
  var CancelToken = /*#__PURE__*/function () {
    function CancelToken(executor) {
      _classCallCheck(this, CancelToken);
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function (cancel) {
        if (!token._listeners) return;
        var i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function (onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function (resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }
        token.reason = new CanceledError(message, config, request);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    _createClass(CancelToken, [{
      key: "throwIfRequested",
      value: function throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }

      /**
       * Subscribe to the cancel signal
       */
    }, {
      key: "subscribe",
      value: function subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }
        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }

      /**
       * Unsubscribe from the cancel signal
       */
    }, {
      key: "unsubscribe",
      value: function unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        var index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }
    }, {
      key: "toAbortSignal",
      value: function toAbortSignal() {
        var _this = this;
        var controller = new AbortController();
        var abort = function abort(err) {
          controller.abort(err);
        };
        this.subscribe(abort);
        controller.signal.unsubscribe = function () {
          return _this.unsubscribe(abort);
        };
        return controller.signal;
      }

      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
    }], [{
      key: "source",
      value: function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token: token,
          cancel: cancel
        };
      }
    }]);
    return CancelToken;
  }();
  var CancelToken$1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   *
   * @returns {Function}
   */
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   *
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  function isAxiosError(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }

  var HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(HttpStatusCode).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    HttpStatusCode[value] = key;
  });
  var HttpStatusCode$1 = HttpStatusCode;

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   *
   * @returns {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios$1(defaultConfig);
    var instance = bind(Axios$1.prototype.request, context);

    // Copy axios.prototype to instance
    utils$1.extend(instance, Axios$1.prototype, context, {
      allOwnKeys: true
    });

    // Copy context to instance
    utils$1.extend(instance, context, null, {
      allOwnKeys: true
    });

    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }

  // Create the default instance to be exported
  var axios = createInstance(defaults$1);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios$1;

  // Expose Cancel & CancelToken
  axios.CanceledError = CanceledError;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData;

  // Expose AxiosError class
  axios.AxiosError = AxiosError;

  // alias for CanceledError for backward compatibility
  axios.Cancel = axios.CanceledError;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;

  // Expose isAxiosError
  axios.isAxiosError = isAxiosError;

  // Expose mergeConfig
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = function (thing) {
    return formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  };
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios["default"] = axios;

  return axios;

}));


}).call(this)}).call(this,require(8),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require(4).Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require(26).setImmediate)
},{"26":26,"4":4,"8":8}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require(2)
var ieee754 = require(6)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require(4).Buffer)
},{"2":2,"4":4,"6":6}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],6:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],7:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = require(4)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"4":4}],10:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require(5).EventEmitter;
var inherits = require(7);

inherits(Stream, EE);
Stream.Readable = require(14);
Stream.Writable = require(16);
Stream.Duplex = require(12);
Stream.Transform = require(15);
Stream.PassThrough = require(13);
Stream.finished = require(20)
Stream.pipeline = require(22)

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"12":12,"13":13,"14":14,"15":15,"16":16,"20":20,"22":22,"5":5,"7":7}],11:[function(require,module,exports){
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;

},{}],12:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

module.exports = Duplex;
var Readable = require(14);
var Writable = require(16);
require(7)(Duplex, Readable);
{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;
  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;
    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}
Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

// the no-half-open enforcer
function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(onEndNT, this);
}
function onEndNT(self) {
  self.end();
}
Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});
}).call(this)}).call(this,require(8))
},{"14":14,"16":16,"7":7,"8":8}],13:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;
var Transform = require(15);
require(7)(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}
PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"15":15,"7":7}],14:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

module.exports = Readable;

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require(5).EventEmitter;
var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require(24);
/*</replacement>*/

var Buffer = require(4).Buffer;
var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*<replacement>*/
var debugUtil = require(3);
var debug;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/

var BufferList = require(18);
var destroyImpl = require(19);
var _require = require(23),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = require(11).codes,
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;

// Lazy loaded to improve the startup performance.
var StringDecoder;
var createReadableStreamAsyncIterator;
var from;
require(7)(Readable, Stream);
var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];
function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}
function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require(12);
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'end' (and potentially 'finish')
  this.autoDestroy = !!options.autoDestroy;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require(25).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  Duplex = Duplex || require(12);
  if (!(this instanceof Readable)) return new Readable(options);

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex);

  // legacy
  this.readable = true;
  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }
  Stream.call(this);
}
Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;
  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }
  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};
function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  }

  // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.
  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}
function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}
function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }
  return er;
}
Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require(25).StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder;
  // If setEncoding(null), decoder.encoding equals utf8
  this._readableState.encoding = this._readableState.decoder.encoding;

  // Iterate over current buffer to convert already stored Buffers:
  var p = this._readableState.buffer.head;
  var content = '';
  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }
  this._readableState.buffer.clear();
  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
};

// Don't raise the hwm > 1GB
var MAX_HWM = 0x40000000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }
  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }
  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;
  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }
  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }
  if (ret !== null) this.emit('data', ret);
  return ret;
};
function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;
  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;
    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}
function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);
  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  }

  // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.
  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}
function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};
Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;
  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }
  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);
    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);
  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }
  return dest;
};
function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}
Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    for (var i = 0; i < len; i++) dests[i].emit('unpipe', this, {
      hasUnpiped: false
    });
    return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;
  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0;

    // Try start flowing on next tick if stream isn't explicitly paused
    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);
      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }
  return res;
};
Readable.prototype.addListener = Readable.prototype.on;
Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);
  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);
  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;
  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true;

    // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}
function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()
    state.flowing = !state.readableListening;
    resume(this, state);
  }
  state.paused = false;
  return this;
};
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}
function resume_(stream, state) {
  debug('resume', state.reading);
  if (!state.reading) {
    stream.read(0);
  }
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}
Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  this._readableState.paused = true;
  return this;
};
function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null);
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;
  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }
    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };
  return this;
};
if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = require(17);
    }
    return createReadableStreamAsyncIterator(this);
  };
}
Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
});

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}
function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);
  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}
function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length);

  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;
      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}
if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = require(21);
    }
    return from(Readable, iterable, opts);
  };
}
function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this)}).call(this,require(8),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"11":11,"12":12,"17":17,"18":18,"19":19,"21":21,"23":23,"24":24,"25":25,"3":3,"4":4,"5":5,"7":7,"8":8}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;
var _require$codes = require(11).codes,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
  ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
var Duplex = require(12);
require(7)(Transform, Duplex);
function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;
  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }
  ts.writechunk = null;
  ts.writecb = null;
  if (data != null)
    // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;
  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}
function prefinish() {
  var _this = this;
  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}
Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};
Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;
  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};
Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};
function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null)
    // single equals check for both `null` and `undefined`
    stream.push(data);

  // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}
},{"11":11,"12":12,"7":7}],16:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;
  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var internalUtil = {
  deprecate: require(27)
};
/*</replacement>*/

/*<replacement>*/
var Stream = require(24);
/*</replacement>*/

var Buffer = require(4).Buffer;
var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
var destroyImpl = require(19);
var _require = require(23),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = require(11).codes,
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
  ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
  ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
  ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
var errorOrDestroy = destroyImpl.errorOrDestroy;
require(7)(Writable, Stream);
function nop() {}
function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || require(12);
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'finish' (and potentially 'end')
  this.autoDestroy = !!options.autoDestroy;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}
WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};
(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}
function Writable(options) {
  Duplex = Duplex || require(12);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex);

  // legacy.
  this.writable = true;
  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }
  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};
function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END();
  // TODO: defer error events consistently everywhere, not just the cb
  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var er;
  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }
  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }
  return true;
}
Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);
  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};
Writable.prototype.cork = function () {
  this._writableState.corked++;
};
Writable.prototype.uncork = function () {
  var state = this._writableState;
  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};
Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}
Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;
  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }
  return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}
function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}
function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}
function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;
    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }
    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}
function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;
  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }
    if (entry === null) state.lastBufferedRequest = null;
  }
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}
Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};
Writable.prototype._writev = null;
Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;
  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending) endWritable(this, state, cb);
  return this;
};
Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});
function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      errorOrDestroy(stream, err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}
function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;
        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }
  return need;
}
function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}
function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  // reuse the free corkReq.
  state.corkedRequestsFree.next = corkReq;
}
Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  cb(err);
};
}).call(this)}).call(this,require(8),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"11":11,"12":12,"19":19,"23":23,"24":24,"27":27,"4":4,"7":7,"8":8}],17:[function(require,module,exports){
(function (process){(function (){
'use strict';

var _Object$setPrototypeO;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var finished = require(20);
var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');
function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}
function readAndResolve(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    var data = iter[kStream].read();
    // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'
    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}
function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}
function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }
      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}
var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },
  next: function next() {
    var _this = this;
    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];
    if (error !== null) {
      return Promise.reject(error);
    }
    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }
    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    }

    // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time
    var lastPromise = this[kLastPromise];
    var promise;
    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();
      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }
      promise = new Promise(this[kHandlePromise]);
    }
    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;
  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);
var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;
  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();
      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject];
      // reject if we are waiting for data in the Promise
      // returned by next() and store the error
      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }
      iterator[kError] = err;
      return;
    }
    var resolve = iterator[kLastResolve];
    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }
    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};
module.exports = createReadableStreamAsyncIterator;
}).call(this)}).call(this,require(8))
},{"20":20,"8":8}],18:[function(require,module,exports){
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var _require = require(4),
  Buffer = _require.Buffer;
var _require2 = require(3),
  inspect = _require2.inspect;
var custom = inspect && inspect.custom || 'inspect';
function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}
module.exports = /*#__PURE__*/function () {
  function BufferList() {
    _classCallCheck(this, BufferList);
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;
      while (p = p.next) ret += s + p.data;
      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    }

    // Consumes a specified amount of bytes or characters from the buffered data.
  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;
      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }
      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    }

    // Consumes a specified amount of characters from the buffered data.
  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Consumes a specified amount of bytes from the buffered data.
  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Make sure the linked list only shows the minimal necessary information.
  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);
  return BufferList;
}();
},{"3":3,"4":4}],19:[function(require,module,exports){
(function (process){(function (){
'use strict';

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;
  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;
  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }
  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });
  return this;
}
function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}
function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}
function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }
  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}
function emitErrorNT(self, err) {
  self.emit('error', err);
}
function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.

  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}
module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
}).call(this)}).call(this,require(8))
},{"8":8}],20:[function(require,module,exports){
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).

'use strict';

var ERR_STREAM_PREMATURE_CLOSE = require(11).codes.ERR_STREAM_PREMATURE_CLOSE;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    callback.apply(this, args);
  };
}
function noop() {}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;
  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };
  var writableEnded = stream._writableState && stream._writableState.finished;
  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };
  var readableEnded = stream._readableState && stream._readableState.endEmitted;
  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };
  var onerror = function onerror(err) {
    callback.call(stream, err);
  };
  var onclose = function onclose() {
    var err;
    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };
  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };
  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }
  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}
module.exports = eos;
},{"11":11}],21:[function(require,module,exports){
module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};

},{}],22:[function(require,module,exports){
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).

'use strict';

var eos;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}
var _require$codes = require(11).codes,
  ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = require(20);
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true;

    // request.destroy just do .end - .abort is what we want
    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}
function call(fn) {
  fn();
}
function pipe(from, to) {
  return from.pipe(to);
}
function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}
function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }
  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];
  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }
  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}
module.exports = pipeline;
},{"11":11,"20":20}],23:[function(require,module,exports){
'use strict';

var ERR_INVALID_OPT_VALUE = require(11).codes.ERR_INVALID_OPT_VALUE;
function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}
function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }
    return Math.floor(hwm);
  }

  // Default value
  return state.objectMode ? 16 : 16 * 1024;
}
module.exports = {
  getHighWaterMark: getHighWaterMark
};
},{"11":11}],24:[function(require,module,exports){
module.exports = require(5).EventEmitter;

},{"5":5}],25:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require(9).Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"9":9}],26:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require(8).nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require(26).setImmediate,require(26).clearImmediate)
},{"26":26,"8":8}],27:[function(require,module,exports){
(function (global){(function (){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
'use strict'

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

},{}],29:[function(require,module,exports){
"use strict";

module.exports = {
  handleQuota: true,
  QPS: 2,
  forwarderAddress: "app/integ/forwarder/1.4/apiForwarder.html",
  channelMarker: "'E",
  httpRequest: null,
  oldIEForwarder: false
};

},{}],30:[function(require,module,exports){
"use strict";

var slim = require(70);
var filepicker = require(55);
var prompt = require(63);
var authPrompt = require(33);
slim.plugin("filePicker", function (root, resources) {
  root.filePicker = filepicker(resources.API);
});
slim.plugin("authPrompt", authPrompt);
slim.plugin("prompt", function (root, resources) {
  root.prompt = prompt;
});
module.exports = slim;

},{"33":33,"55":55,"63":63,"70":70}],31:[function(require,module,exports){
"use strict";

var RequestEngine = require(42);
var AuthEngine = require(32);
var StorageFacade = require(45);
var Notes = require(40);
var LinkFacade = require(38);
var PermFacade = require(41);
var UserPerms = require(47);
var User = require(46);
var Events = require(37);
var Search = require(44);
module.exports = function (options) {
  var auth = new AuthEngine(options);
  var requestEngine = new RequestEngine(auth, options);
  var storage = new StorageFacade(requestEngine);
  var notes = new Notes(requestEngine);
  var link = new LinkFacade(requestEngine);
  var perms = new PermFacade(requestEngine);
  var userPerms = new UserPerms(requestEngine);
  var user = new User(requestEngine);
  var search = new Search(requestEngine);
  var events = new Events(requestEngine);
  var api = {
    auth: auth,
    storage: storage,
    notes: notes,
    link: link,
    events: events,
    search: search,
    perms: perms,
    userPerms: userPerms,
    user: user
  };

  //onlt in IE8 and IE9
  if (!("withCredentials" in new window.XMLHttpRequest())) {
    if (options.acceptForwarding) {
      //will handle incoming forwards
      var responder = require(48);
      responder(options, api);
    } else {
      //IE 8 and 9 forwarding
      if (options.oldIEForwarder) {
        var forwarder = require(49);
        forwarder(options, api);
      }
    }
  }
  api.manual = requestEngine;
  return api;
};

},{"32":32,"37":37,"38":38,"40":40,"41":41,"42":42,"44":44,"45":45,"46":46,"47":47,"48":48,"49":49}],32:[function(require,module,exports){
"use strict";

var oauthRegex = /access_token=([^&]+)/;
var oauthDeniedRegex = /error=access_denied/;
var promises = require(62);
var helpers = require(66);
var dom = require(64);
var messages = require(67);
var errorify = require(36);
var ENDPOINTS_userinfo = require(50).userinfo;
var ENDPOINTS_tokenauth = require(50).tokenauth;
function Auth(options) {
  this.type = "Bearer";
  this.options = options;
  if (this.options.token) {
    this.token = this.options.token;
  }
  this.userInfo = null;
  this.getUserInfo = helpers.bindThis(this, this.getUserInfo);
}
var authPrototypeMethods = {};
authPrototypeMethods._buildTokenQuery = function (redirect) {
  var url = this.options.egnyteDomainURL + ENDPOINTS_tokenauth + "?client_id=" + this.options.key + "&mobile=" + ~~this.options.mobile + "&redirect_uri=" + encodeURIComponent(redirect);
  if (this.options.scope) {
    url += "&scope=" + this.options.scope;
  }
  return url;
};
authPrototypeMethods._reloadForToken = function () {
  window.location.href = this._buildTokenQuery(window.location.href);
};
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
};
authPrototypeMethods.requestTokenReload = function (callback, denied) {
  this._checkTokenResponse(callback, denied, helpers.bindThis(this, this._reloadForToken));
};
authPrototypeMethods.requestTokenIframe = function (targetNode, callback, denied, emptyPageURL) {
  if (!this.token) {
    var self = this;
    var locationObject = window.location;
    emptyPageURL = emptyPageURL ? locationObject.protocol + "//" + locationObject.host + emptyPageURL : locationObject.href;
    var url = self._buildTokenQuery(emptyPageURL);
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
    };
    targetNode.appendChild(iframe);
  } else {
    callback();
  }
};
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
};
authPrototypeMethods.requestTokenPopup = function (callback, denied, recvrURL) {
  var self = this;
  if (!this.token) {
    var url = this._buildTokenQuery(recvrURL);
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
};
authPrototypeMethods.requestTokenByPassword = function (username, password) {
  var self = this;
  return this.requestEngine.promiseRequest({
    method: "POST",
    url: this.options.egnyteDomainURL + ENDPOINTS_tokenauth + "",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: ["client_id=" + this.options.key, "grant_type=password", "username=" + encodeURIComponent(username), "password=" + encodeURIComponent(password)].join("&")
  }, null, !!"forceNoAuth").then(function (result) {
    //result.response result.body
    self.token = result.body.access_token;
    return self.token;
  });
};
authPrototypeMethods.authorizeXHR = function (xhr) {
  //assuming token_type was bearer, no use for XHR otherwise, right?
  xhr.setRequestHeader("Authorization", "Bearer " + this.token);
};
authPrototypeMethods.getHeaders = function () {
  return {
    Authorization: "Bearer " + this.token
  };
};
authPrototypeMethods.isAuthorized = function () {
  return !!this.token;
};
authPrototypeMethods.getToken = function () {
  return this.token;
};
authPrototypeMethods.setToken = function (externalToken) {
  this.token = externalToken;
};
authPrototypeMethods.dropToken = function (externalToken) {
  this.token = null;
};

//======================================================================
//api facade

authPrototypeMethods.addRequestEngine = function (requestEngine) {
  this.requestEngine = requestEngine;
};
authPrototypeMethods.getUserInfo = function () {
  var self = this;
  if (self.userInfo || !this.requestEngine) {
    return promises(true).then(function () {
      return self.userInfo;
    });
  } else {
    return this.requestEngine.promiseRequest({
      method: "GET",
      url: this.requestEngine.getEndpoint() + ENDPOINTS_userinfo
    }).then(function (result) {
      //result.response result.body
      self.userInfo = result.body;
      return result.body;
    });
  }
};
Auth.prototype = authPrototypeMethods;
module.exports = Auth;

},{"36":36,"50":50,"62":62,"64":64,"66":66,"67":67}],33:[function(require,module,exports){
"use strict";

var prompt = require(63);
var helpers = require(66);
function egmitifyDomain(domain) {
  if (domain.indexOf('.') === -1) {
    domain += '.egnyte.com';
  }
  return domain;
}
module.exports = function (root, resources) {
  root.API.auth.requestTokenIframeWithPrompt = function (targetNode, callback, denied, emptyPageURL) {
    prompt(targetNode, {
      texts: {
        question: "Your egnyte domain address"
      },
      result: function result(choice) {
        root.setDomain(helpers.httpsURL(egmitifyDomain(choice)));
        root.API.auth.requestTokenIframe(targetNode, callback, denied, emptyPageURL);
      }
    });
  };
};

},{"63":63,"66":66}],34:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var ENDPOINTS = require(50);
function genericUpload(requestEngine, decorate, pathFromRoot, headers, file) {
  pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
  var opts = {
    headers: headers,
    method: "POST",
    url: requestEngine.getEndpoint() + ENDPOINTS.fschunked + helpers.encodeURIPath(pathFromRoot),
    body: file
  };
  return requestEngine.promiseRequest(decorate(opts));
}
function ChunkedUploader(storage, pathFromRoot, mimeType) {
  this.storage = storage;
  this.path = pathFromRoot;
  this.mime = mimeType;
  this.num = 1;
  this.successful = 1;
  this.chunksPromised = [];
}
var chunkedUploaderProto = {};
chunkedUploaderProto.setId = function (id) {
  this.id = id;
};
chunkedUploaderProto.sendChunk = function (content, num, verify) {
  var self = this;
  var requestEngine = this.storage.requestEngine;
  var decorate = this.storage.getDecorator();
  if (num) {
    self.num = num;
  } else {
    num = ++self.num;
  }
  var headers = {
    "x-egnyte-upload-id": self.id,
    "x-egnyte-chunk-num": self.num
  };
  var promised = genericUpload(requestEngine, decorate, self.path, headers, content).then(function (result) {
    verify && verify(result.response.headers["x-egnyte-chunk-sha512-checksum"]);
    self.successful++;
    return result;
  });
  self.chunksPromised.push(promised);
  return promised;
};
chunkedUploaderProto.sendLastChunk = function (content, verify) {
  var self = this;
  var requestEngine = this.storage.requestEngine;
  var decorate = this.storage.getDecorator();
  var headers = {
    "x-egnyte-upload-id": self.id,
    "x-egnyte-last-chunk": true,
    "x-egnyte-chunk-num": self.num + 1
  };
  if (self.mime) {
    headers["content-type"] = self.mime;
  }
  return promises.allSettled(this.chunksPromised).then(function () {
    if (self.num === self.successful) {
      return genericUpload(requestEngine, decorate, self.path, headers, content).then(function (result) {
        verify && verify(result.response.headers["x-egnyte-chunk-sha512-checksum"]);
        return {
          id: result.response.headers["etag"],
          path: self.path
        };
      });
    } else {
      throw new Error("Tried to commit a file with missing chunks (some uploads failed)");
    }
  });
};
ChunkedUploader.prototype = chunkedUploaderProto;
exports.startChunkedUpload = function (pathFromRoot, fileOrBlob, mimeType, verify) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  var chunkedUploader = new ChunkedUploader(this, pathFromRoot, mimeType);
  return promises(true).then(function () {
    var file = fileOrBlob;
    var headers = {};
    if (mimeType) {
      headers["content-type"] = mimeType;
    }
    return genericUpload(requestEngine, decorate, pathFromRoot, headers, fileOrBlob);
  }).then(function (result) {
    //result.response result.body
    verify && verify(result.response.headers["x-egnyte-chunk-sha512-checksum"]);
    chunkedUploader.setId(result.response.headers["x-egnyte-upload-id"]);
    return chunkedUploader;
  });
};

},{"50":50,"62":62,"66":66}],35:[function(require,module,exports){
"use strict";

var helpers = require(66);
var defaultDecorators = {
  "impersonate": function impersonate(opts, data) {
    if (!opts.headers) {
      opts.headers = {};
    }
    if (data.username) {
      opts.headers["X-Egnyte-Act-As"] = data.username;
    }
    if (data.email) {
      opts.headers["X-Egnyte-Act-As-Email"] = data.email;
    }
    return opts;
  },
  "customizeRequest": function customizeRequest(opts, transformation) {
    return transformation(opts);
  },
  "requestId": function requestId(opts, _requestId) {
    if (!opts.headers) {
      opts.headers = {};
    }
    if (_requestId) {
      opts.headers["X-Egnyte-Request-Id"] = _requestId;
    }
    return opts;
  }
};
function getDecorator() {
  var self = this;
  return function (opts) {
    helpers.each(self._decorators, function (decor, name) {
      if (self._decorations[name] !== undefined) {
        opts = decor(opts, self._decorations[name]);
      }
    });
    return opts;
  };
}
module.exports = {
  install: function install(self) {
    function exposeDecorators(that) {
      helpers.each(that._decorators, function (decor, name) {
        that[name] = function (data) {
          var Decorated = function Decorated() {};
          Decorated.prototype = this;
          var instance = new Decorated();
          instance.getDecorator = getDecorator;
          instance._decorations = helpers.extend({}, this._decorations);
          instance._decorations[name] = data || null;
          exposeDecorators(instance);
          return instance;
        };
      });
    }
    self._decorators = helpers.extend({}, defaultDecorators);
    exposeDecorators(self);
    self.addDecorator = function (name, action) {
      this._decorators[name] = action;
      exposeDecorators(this);
    };
    self.getDecorator = function () {
      return helpers.id;
    };
  }
};

},{"66":66}],36:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
//making sense of all the different error message bodies
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
    if (_typeof(obj[i]) === "object") {
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
    code = ~~result.response.statusCode;
    error = result.error;
    error.statusCode = code;
    error.message = "" + psychicMessageParser(result.body || result.error.message, code);
    error.response = result.response;
    error.body = result.body;
  } else {
    error = result.error;
    error.statusCode = 0;
  }
  return error;
};

},{}],37:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var every = require(65);
var decorators = require(35);
var ENDPOINTS_events = require(50).events;
var ENDPOINTS_eventscursor = require(50).eventscursor;
function Events(requestEngine) {
  this.requestEngine = requestEngine;
  decorators.install(this);
  this.addDecorator("filter", addFilter);
  this.addDecorator("notMy", notMy);
}
function addFilter(opts, data) {
  opts.params || (opts.params = {});
  if (data.folder) {
    opts.params.folder = data.folder;
  }
  if (data.type) {
    if (data.type.join) {
      opts.params.type = data.type.join("|");
    } else {
      opts.params.type = data.type;
    }
  }
  return opts;
}
function notMy(opts, data) {
  opts.params || (opts.params = {});
  opts.params.suppress = data ? data : "app";
  return opts;
}
var defaultCount = 20;
Events.prototype = {
  getCursor: function getCursor() {
    var requestEngine = this.requestEngine;
    return requestEngine.promiseRequest({
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS_eventscursor
    }).then(function (result) {
      return result.body.latest_event_id;
    });
  },
  //options.start
  //options.emit
  //options.count (optional)
  getUpdate: function getUpdate(options) {
    var self = this;
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();
    return promises(true).then(function () {
      if (!(options.start >= 0)) {
        throw new Error("'start' option is required");
      }
      var count = options.count || defaultCount;
      return requestEngine.promiseRequest(decorate({
        method: "GET",
        url: requestEngine.getEndpoint() + ENDPOINTS_events,
        params: {
          id: options.start,
          count: count
        }
      }));
    }).then(function (result) {
      if (result.body && options.emit) {
        helpers.each(result.body.events, function (e) {
          setTimeout(function () {
            options.emit(e);
          }, 0);
        });
      }
      return result;
    });
  },
  //options.start
  //options.interval >2000
  //options.emit
  //options.current
  //options.count (optional)
  //returns {stop:function}
  listen: function listen(options) {
    var self = this;
    return promises(true).then(function () {
      if (!isNaN(options.start)) {
        return options.start;
      } else {
        return self.getCursor();
      }
    }).then(function (initial) {
      var start = initial;
      if (options.current) {
        options.current(start);
      }
      //returns controllong object
      return every(Math.max(options.interval || 30000, 2000), function (controller) {
        var count = options.count || defaultCount;
        return self.getUpdate({
          count: count,
          emit: options.emit,
          start: start
        }).then(function (result) {
          if (result.body) {
            start = result.body.latest_id;
            if (options.current) {
              options.current(start);
            }
            if (result.body.events.length >= count) {
              controller.repeat();
            }
          }
          if (options.heartbeat) {
            options.heartbeat(result.body);
          }
        });
      }, options.error);
    });
  }
};
module.exports = Events;

},{"35":35,"50":50,"62":62,"65":65,"66":66}],38:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var decorators = require(35);
var ENDPOINTS_links = require(50).links;
function Links(requestEngine) {
  this.requestEngine = requestEngine;
  decorators.install(this);
}
var linksProto = {};
linksProto.createLink = function (setup) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  var defaults = {
    path: null,
    type: "file",
    accessibility: "domain"
  };
  return promises(true).then(function () {
    setup = helpers.extend(defaults, setup);
    setup.path = helpers.encodeNameSafe(setup.path);
    if (!setup.path) {
      throw new Error("Path attribute missing or incorrect");
    }
    return requestEngine.promiseRequest(decorate({
      method: "POST",
      url: requestEngine.getEndpoint() + ENDPOINTS_links,
      json: setup
    }));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
linksProto.removeLink = function (id) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return requestEngine.promiseRequest(decorate({
    method: "DELETE",
    url: requestEngine.getEndpoint() + ENDPOINTS_links + "/" + id
  })).then(function (result) {
    //result.response result.body
    return result.response.statusCode;
  });
};
linksProto.listLink = function (id) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return requestEngine.promiseRequest(decorate({
    method: "GET",
    url: requestEngine.getEndpoint() + ENDPOINTS_links + "/" + id
  })).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
linksProto.listLinks = function (filters) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    filters.path = filters.path && helpers.encodeNameSafe(filters.path);
    return requestEngine.promiseRequest(decorate({
      method: "get",
      url: requestEngine.getEndpoint() + ENDPOINTS_links,
      params: filters
    }));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
linksProto.findOne = function (filters) {
  var self = this;
  return self.listLinks(filters).then(function (list) {
    if (list.ids && list.ids.length > 0) {
      return self.listLink(list.ids[0]);
    } else {
      return null;
    }
  });
};
Links.prototype = linksProto;
module.exports = Links;

},{"35":35,"50":50,"62":62,"66":66}],39:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var promises = require(62);
var helpers = require(66);
var ENDPOINTS_fsmeta = require(50).fsmeta;
exports.lock = function (pathFromRoot, lockTokenOrBody, timeout) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var body = {
      action: "lock"
    };
    // Old style JS function signature override
    if (_typeof(lockTokenOrBody) === "object" && lockTokenOrBody != null) {
      body = Object.assign(body, lockTokenOrBody);
    } else {
      if (lockTokenOrBody) {
        body.lock_token = lockTokenOrBody;
      }
      if (timeout) {
        body.lock_timeout = timeout;
      }
    }
    var opts = {
      method: "POST",
      url: requestEngine.getEndpoint() + ENDPOINTS_fsmeta + helpers.encodeURIPath(pathFromRoot),
      json: body
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    result.body.path = pathFromRoot;
    return result.body;
  });
};
exports.unlock = function (pathFromRoot, lockToken) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var body = {
      action: "unlock",
      lock_token: lockToken
    };
    var opts = {
      method: "POST",
      url: requestEngine.getEndpoint() + ENDPOINTS_fsmeta + helpers.encodeURIPath(pathFromRoot),
      json: body
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return {
      path: pathFromRoot
    };
  });
};

},{"50":50,"62":62,"66":66}],40:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var decorators = require(35);
var ENDPOINTS_notes = require(50).notes;
function Notes(requestEngine) {
  this.requestEngine = requestEngine;
  decorators.install(this);
}
var notesProto = {};
notesProto.path = function (pathFromRoot) {
  pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
  var self = this;
  return {
    addNote: function addNote(body) {
      var requestEngine = self.requestEngine;
      var decorate = self.getDecorator();
      return promises(true).then(function () {
        var opts = {
          method: "POST",
          url: requestEngine.getEndpoint() + ENDPOINTS_notes,
          json: {
            path: pathFromRoot,
            body: body
          }
        };
        return requestEngine.promiseRequest(decorate(opts));
      }).then(function (result) {
        //result.response result.body
        return {
          id: result.body.id
        };
      });
    },
    listNotes: function listNotes(params) {
      var requestEngine = self.requestEngine;
      var decorate = self.getDecorator();
      return promises(true).then(function () {
        pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
        var opts = {
          method: "GET",
          url: requestEngine.getEndpoint() + ENDPOINTS_notes
        };

        //xhr and request differ here
        opts.params = helpers.extend({
          file: helpers.encodeURIPath(pathFromRoot)
        }, params);
        return requestEngine.promiseRequest(decorate(opts)).then(function (result) {
          return result.body;
        });
      });
    }
  };
};
notesProto.getNote = function (id) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS_notes + "/" + helpers.encodeURIPath(id)
    };
    return requestEngine.promiseRequest(decorate(opts)).then(function (result) {
      return result.body;
    });
  });
};
notesProto.removeNote = function (id) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    var opts = {
      method: "DELETE",
      url: requestEngine.getEndpoint() + ENDPOINTS_notes + "/" + helpers.encodeURIPath(id)
    };
    return requestEngine.promiseRequest(decorate(opts));
  });
};
Notes.prototype = notesProto;
module.exports = Notes;

},{"35":35,"50":50,"62":62,"66":66}],41:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var decorators = require(35);
var resourceIdentifier = require(43);
var ENDPOINTS_perms = require(50).perms;
function Perms(requestEngine) {
  this.requestEngine = requestEngine;
  decorators.install(this);
  this.addDecorator("users", enlist("users"));
  this.addDecorator("groups", enlist("groups"));
}
function enlist(what) {
  return function (opts, data) {
    switch (opts.method) {
      case "GET":
        opts.params || (opts.params = {});
        opts.params[what] = data.join("|");
        break;
      case "POST":
        opts.json[what] = data;
        break;
    }
    return opts;
  };
}
var permsProto = {};
permsProto.disallow = function (pathFromRoot) {
  return permsProto.allow.call(this, pathFromRoot, "None");
};
permsProto.allowView = function (pathFromRoot) {
  return permsProto.allow.call(this, pathFromRoot, "Viewer");
};
permsProto.allowEdit = function (pathFromRoot) {
  return permsProto.allow.call(this, pathFromRoot, "Editor");
};
permsProto.allowFullAccess = function (pathFromRoot) {
  return permsProto.allow.call(this, pathFromRoot, "Full");
};
permsProto.allowOwnership = function (pathFromRoot) {
  return permsProto.allow.call(this, pathFromRoot, "Owner");
};
permsProto.allow = function (pathFromRoot, permission) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    var opts = {
      method: "POST",
      url: requestEngine.getEndpoint() + ENDPOINTS_perms + helpers.encodeURIPath(pathFromRoot),
      json: {
        permission: permission
      }
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.response;
  });
};
permsProto.getPerms = function (pathFromRoot) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS_perms + helpers.encodeURIPath(pathFromRoot)
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
Perms.prototype = resourceIdentifier(permsProto, {
  pathPrefix: "/folder"
});

//to prevent confusion in users
delete Perms.prototype.fileId;
module.exports = Perms;

},{"35":35,"43":43,"50":50,"62":62,"66":66}],42:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var promises = require(62);
var helpers = require(66);
var dom = require(64);
var messages = require(67);
var errorify = require(36);
var axios = require(1);
var PassThrough = require(10).PassThrough;

// Configuration for stream endpoint detection
// These URL patterns indicate streaming endpoints
// Support both old (/v1/) and new (/pubapi/v1/) URL formats
var STREAM_ENDPOINT_PATTERNS = ["/v1/fs-content", "/v1/fs-content-chunked", "/pubapi/v1/fs-content", "/pubapi/v1/fs-content-chunked"];

// Helper function to check if a URL is a stream endpoint
function isStreamEndpoint(url) {
  if (!url) return false;
  var urlLower = url.toLowerCase();
  for (var i = 0; i < STREAM_ENDPOINT_PATTERNS.length; i++) {
    if (urlLower.indexOf(STREAM_ENDPOINT_PATTERNS[i]) !== -1) {
      return true;
    }
  }
  return false;
}

// Helper function to handle axios success responses consistently
function handleAxiosSuccess(response, callback) {
  callback(null, {
    statusCode: response.status,
    statusMessage: response.statusText,
    headers: response.headers,
    body: response.data,
    request: response.request
  }, response.data);
}

// Helper function to handle axios errors consistently
function handleAxiosError(error, callback) {
  if (error.response) {
    // Server responded with error status
    callback(null, {
      statusCode: error.response.status,
      statusMessage: error.response.statusText,
      headers: error.response.headers,
      body: error.response.data,
      request: error.response.request
    }, error.response.data);
  } else if (error.request) {
    // Request was made but no response received
    callback(error, {
      statusCode: 0,
      statusMessage: error.message
    }, null);
  } else {
    // Error in request setup
    callback(error, {
      statusCode: 0,
      statusMessage: error.message
    }, null);
  }
}

// Axios wrapper to provide request-like interface
// Compatible with axios 1.x latest features
function axiosWrapper(options, callback) {
  if (typeof options === "string") {
    options = {
      url: options
    };
  }

  // Support both 'url' and 'uri' for compatibility with request library
  var url = options.url || options.uri;
  var baseURL = options.baseURL;

  // Rewrite /v1/ to /pubapi/v1/ for backward compatibility
  // This maintains compatibility with code that uses the old API endpoint pattern
  // The request library accepted both, but axios is more strict
  if (typeof url === "string") {
    // Only rewrite if /v1/ is present but /pubapi/v1/ is not
    // Use global regex to replace all occurrences (though typically there's only one)
    if (url.indexOf("/v1/") !== -1 && url.indexOf("/pubapi/v1/") === -1) {
      url = url.replace(/\/v1\//g, "/pubapi/v1/");
    }
  }

  // Axios requires absolute URLs in Node.js
  // If URL starts with /, it's relative - extract baseURL from it if it looks like a full path
  if (typeof url === "string" && url.charAt(0) === "/" && !baseURL) {
    // Check if this is a mock URL pattern like /mock/pubapi/...
    // In that case, use a dummy base URL
    if (url.indexOf("/mock/") === 0 || url.indexOf("/pubapi/") === 0) {
      baseURL = "http://localhost";
    }
  }

  // Handle the 'json' option correctly
  // In request library: json: true means "parse response as JSON"
  // In request library: json: {object} means "send this object as JSON body"
  var requestData;
  if (options.body) {
    requestData = options.body;
  } else if (options.form) {
    requestData = options.form;
  } else if (options.json && _typeof(options.json) === "object") {
    // json is an object - use it as request body
    requestData = options.json;
  }
  // If json is true (boolean), it's just a flag for response parsing, not request data

  var axiosConfig = {
    url: url,
    baseURL: baseURL,
    method: (options.method || "GET").toUpperCase(),
    headers: options.headers || {},
    params: options.qs,
    data: requestData,
    timeout: options.timeout || 0,
    maxRedirects: options.maxRedirects !== undefined ? options.maxRedirects : 5,
    validateStatus: function validateStatus() {
      return true; // Don't throw on any status code - handle all responses
    },
    // Axios 1.x specific options for better compatibility
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    // Force JSON parsing for all responses
    transformResponse: [function (data) {
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          return data;
        }
      }
      return data;
    }]
  };

  // Set content-type for JSON only if we're actually sending JSON data
  if (options.json && _typeof(options.json) === "object" && !axiosConfig.headers["Content-Type"]) {
    axiosConfig.headers["Content-Type"] = "application/json";
  }

  // Handle form data
  if (options.form && !axiosConfig.headers["Content-Type"]) {
    axiosConfig.headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  // Handle authentication
  if (options.auth) {
    axiosConfig.auth = options.auth;
  }

  // Handle response type
  if (options.encoding === null || options.encoding === "binary") {
    axiosConfig.responseType = "arraybuffer";
  }

  // Handle streaming responses
  if (options.responseType === "stream") {
    axiosConfig.responseType = "stream";
  }
  if (callback) {
    // Check if this is a stream upload (POST/PUT with no body data to a stream endpoint)
    // Allow explicit override via options.isStreamUpload
    var isStreamUpload = options.isStreamUpload || (axiosConfig.method === "POST" || axiosConfig.method === "PUT") && !axiosConfig.data && isStreamEndpoint(axiosConfig.url);
    if (isStreamUpload) {
      // Callback-style usage with stream upload support
      // Create a PassThrough stream to accept piped data
      var streamProxy = new PassThrough();
      var chunks = [];
      streamProxy.on("data", function (chunk) {
        chunks.push(chunk);
      });
      streamProxy.on("end", function () {
        // When stream ends, combine chunks and send with axios
        if (chunks.length > 0) {
          var buffer = Buffer.concat(chunks);
          axiosConfig.data = buffer;
          // Remove any existing Content-Length header (check all case variations)
          Object.keys(axiosConfig.headers).forEach(function (key) {
            if (key.toLowerCase() === "content-length") {
              delete axiosConfig.headers[key];
            }
          });
          // Explicitly set Content-Length to the buffer length
          axiosConfig.headers["Content-Length"] = String(buffer.length);
          // Ensure we're sending binary data if no Content-Type is set
          if (!axiosConfig.headers["Content-Type"]) {
            axiosConfig.headers["Content-Type"] = "application/octet-stream";
          }
          // Disable axios's default transformRequest to prevent data modification
          // Using function syntax for IE11 compatibility
          axiosConfig.transformRequest = [function (data) {
            return data;
          }];
        }
        axios(axiosConfig).then(function (response) {
          handleAxiosSuccess(response, callback);
        })["catch"](function (error) {
          handleAxiosError(error, callback);
        });
      });
      streamProxy.on("error", function (error) {
        callback(error, {
          statusCode: 0,
          statusMessage: error.message
        }, null);
      });

      // Return the PassThrough stream which acts like a writable stream
      // This allows code like stream.pipe(req) to work
      return streamProxy;
    } else {
      // Regular callback-style request (not stream upload)
      // Make the request immediately
      axios(axiosConfig).then(function (response) {
        handleAxiosSuccess(response, callback);
      })["catch"](function (error) {
        handleAxiosError(error, callback);
      });

      // Return a mock request object for compatibility
      return {
        abort: function abort() {}
      };
    }
  } else {
    // No callback - could be streaming downloads or promise-based requests
    // Check if this is a stream request by looking at the URL or options
    // Allow explicit override via options.isStreamRequest
    var isStreamRequest = options.isStreamRequest || isStreamEndpoint(axiosConfig.url);
    if (isStreamRequest) {
      // Return a readable stream that emits 'response' event
      var downloadStream = new PassThrough();

      // For downloads, we need responseType to be 'stream' in Node.js
      if (typeof window === "undefined") {
        axiosConfig.responseType = "stream";
      }
      axios(axiosConfig).then(function (response) {
        // Create a response object that is also a stream (like request library)
        // The response object needs to be the stream itself with additional properties
        var responseStream = downloadStream;
        responseStream.statusCode = response.status;
        responseStream.statusMessage = response.statusText;
        responseStream.headers = response.headers;
        responseStream.body = response.data;

        // Emit response event with the stream itself (request library behavior)
        downloadStream.emit("response", responseStream);

        // If response.data is a stream (Node.js), pipe it
        if (response.data && response.data.pipe) {
          response.data.pipe(downloadStream);
        } else {
          // If it's not a stream, write the data and end
          if (response.data) {
            downloadStream.write(response.data);
          }
          downloadStream.end();
        }
      })["catch"](function (error) {
        downloadStream.emit("error", error);
        downloadStream.end();
      });

      // Add pause/resume methods for compatibility
      downloadStream.pause = function () {
        PassThrough.prototype.pause.call(this);
        return this;
      };
      downloadStream.resume = function () {
        PassThrough.prototype.resume.call(this);
        return this;
      };
      return downloadStream;
    } else {
      // Promise-style usage for non-stream requests
      return axios(axiosConfig);
    }
  }
}
function Engine(auth, options) {
  this.auth = auth;
  this.options = options;
  this.requestHandler = options.httpRequest ? options.httpRequest : axiosWrapper;
  this.quota = {
    startOfTheSecond: 0,
    calls: 0,
    retrying: 0
  };
  this.queue = [];
  this.queueHandler = helpers.bindThis(this, _rollQueue);
  auth.addRequestEngine(this);
}
var enginePrototypeMethods = {
  Promise: promises
};

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
  return this.options.egnyteDomainURL + "/pubapi";
};
enginePrototypeMethods.promise = function (value) {
  return promises(value);
};
enginePrototypeMethods.sendRequest = function (opts, callback, forceNoAuth, forceNoRetry) {
  var self = this;
  opts = helpers.extend({}, self.options.requestDefaults, opts); //merging in the defaults
  var originalOpts = helpers.extend({}, opts); //just copying the object

  if (this.auth.isAuthorized() || forceNoAuth) {
    // Support both 'url' and 'uri' for compatibility with request library
    if (!opts.url && opts.uri) {
      opts.url = opts.uri;
    }
    opts.url += params(opts.params);
    opts.headers = opts.headers || {};
    if (!forceNoAuth) {
      opts.headers["Authorization"] = this.auth.type + " " + this.auth.getToken();
    }
    if (!callback) {
      return self.requestHandler(opts);
    } else {
      var timer;
      var _retry = function retry() {
        self.sendRequest(originalOpts, self.retryHandler(callback, _retry, timer, forceNoRetry));
      };
      if (self.timerStart) {
        timer = self.timerStart(originalOpts.method, originalOpts.url || originalOpts.uri);
      }
      return self.requestHandler(opts, self.retryHandler(callback, _retry, timer, forceNoRetry));
    }
  } else {
    callback.call(this, new Error("Not authorized"), {
      statusCode: 0
    }, null);
  }
};
enginePrototypeMethods.retryHandler = function (callback, retry, timer, forceNoRetry) {
  var self = this;
  return function (error, response, body) {
    //build an error object for http errors
    if (!error && response.statusCode >= 400 && response.statusCode < 600) {
      // Create error with proper message handling for string, object, null, and undefined bodies
      var errorMessage = "HTTP " + response.statusCode + " error";
      if (body !== null && body !== undefined) {
        if (typeof body === "string") {
          errorMessage = body;
        } else {
          // Try to stringify object bodies, but handle circular references gracefully
          try {
            errorMessage = JSON.stringify(body);
          } catch (e) {
            // Keep default error message if stringify fails (e.g., circular references)
          }
        }
      }
      error = new Error(errorMessage);
    }
    try {
      //this shouldn't be required, but server sometimes responds with content-type text/plain
      body = JSON.parse(body);
    } catch (e) {
      // JSON parsing failed - body is not valid JSON
      // This is expected when server returns non-JSON content (e.g., plain text, HTML)
      // Keep body as-is and continue
    }
    if (response && response.headers) {
      var retryAfter = response.headers["retry-after"];
      var masheryCode = response.headers["x-mashery-error-code"];
      //in case headers get returned as arrays, we only expect one value
      retryAfter = typeof retryAfter === "array" ? retryAfter[0] : retryAfter;
      masheryCode = typeof masheryCode === "array" ? masheryCode[0] : masheryCode;
    }
    if (response && self.options.handleQuota && response.statusCode === 403 && retryAfter && !forceNoRetry) {
      if (masheryCode === "ERR_403_DEVELOPER_OVER_QPS") {
        //retry
        console && console.warn("developer over QPS, retrying");
        self.quota.retrying = 1000 * ~~retryAfter;
        setTimeout(function () {
          self.quota.retrying = 0;
          retry();
        }, self.quota.retrying);
      }
      if (masheryCode === "ERR_403_DEVELOPER_OVER_RATE") {
        error.RATE = true;
        callback.call(this, error, response, body);
      }
    } else {
      if (response &&
      //Checking for failed auth responses
      //(ノಠ益ಠ)ノ彡┻━┻
      self.options.onInvalidToken && (response.statusCode === 401 || response.statusCode === 403 && masheryCode === "ERR_403_DEVELOPER_INACTIVE")) {
        self.auth.dropToken();
        self.options.onInvalidToken();
      }
      if (self.timerEnd) {
        var statusCode = response && response.statusCode || 0;
        self.timerEnd(timer, statusCode);
      }
      callback.call(this, error, response, body);
    }
  };
};
enginePrototypeMethods.retrieveStreamFromRequest = function (opts) {
  var defer = promises.defer();
  var self = this;
  var requestFunction = function requestFunction() {
    try {
      var req = self.sendRequest(opts);
      defer.resolve(req);
    } catch (error) {
      defer.reject(errorify({
        error: error
      }));
    }
  };
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
};
enginePrototypeMethods.promiseRequest = function (opts, requestHandler, forceNoAuth, forceNoRetry) {
  var defer = promises.defer();
  var self = this;
  var requestFunction = function requestFunction() {
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
      }, forceNoAuth, forceNoRetry);
      requestHandler && requestHandler(req);
    } catch (error) {
      defer.reject(errorify({
        error: error
      }));
    }
  };
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
};
enginePrototypeMethods.setupTiming = function (getTimer, timeEnd) {
  this.timerStart = getTimer;
  this.timerEnd = timeEnd;
};

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
  if (diff > 1002) {
    quota.startOfTheSecond = now;
    quota.calls = 0;
    return 0;
  }
  //calls limit not reached
  if (quota.calls < QPS) {
    return 0;
  }
  //calls limit reached, delay to the next second
  return 1003 - diff;
}
Engine.prototype = enginePrototypeMethods;
module.exports = Engine;

}).call(this)}).call(this,require(4).Buffer)
},{"1":1,"10":10,"36":36,"4":4,"62":62,"64":64,"66":66,"67":67}],43:[function(require,module,exports){
"use strict";

var helpers = require(66);
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
    };
  }
}
function wrap(self, pathOrId, APIPrototype) {
  var api = {};
  helpers.each(APIPrototype, function (implementation, name) {
    api[name] = createMethod(implementation, self, pathOrId);
  });
  return api;
}
module.exports = function (APIPrototype, opts) {
  return {
    fileId: function fileId(groupId) {
      return wrap(this, makeId(false, groupId), APIPrototype);
    },
    folderId: function folderId(_folderId) {
      return wrap(this, makeId(true, _folderId), APIPrototype);
    },
    path: function path(_path) {
      if (opts && opts.pathPrefix) {
        _path = opts.pathPrefix + _path;
      }
      return wrap(this, _path, APIPrototype);
    },
    internals: APIPrototype
  };
};

},{"66":66}],44:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var decorators = require(35);
var ENDPOINTS_search = require(50).search;
function Search(requestEngine) {
  this.requestEngine = requestEngine;
  this.count = 10;
  decorators.install(this);
}
var searchProto = {};
searchProto.itemsPerPage = function (count) {
  this.count = count || 10;
};
searchProto.query = function (query, page) {
  var self = this;
  var requestEngine = self.requestEngine;
  var decorate = self.getDecorator();
  return promises(true).then(function () {
    var qs = ["query=" + encodeURIComponent(query), "offset=" + ~~page * self.count, "count=" + self.count];
    var querystring = "?" + qs.join("&");
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS_search + querystring
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
searchProto.getResults = function (query) {
  var self = this;
  return self.query(query).then(function (body) {
    return {
      page: function page(number) {
        return self.query(query, number).then(function (body) {
          return body.results;
        });
      },
      totalPages: Math.round(body.total_count / self.count),
      sample: body.results,
      totalCount: body.total_count
    };
  });
};
Search.prototype = searchProto;
module.exports = Search;

},{"35":35,"50":50,"62":62,"66":66}],45:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var decorators = require(35);
var notes = require(40);
var lock = require(39);
var chunkedUpload = require(34);
var resourceIdentifier = require(43);
var ENDPOINTS = require(50);
function Storage(requestEngine) {
  this.requestEngine = requestEngine;
  decorators.install(this);
}
var storageProto = {};
storageProto.exists = function (pathFromRoot) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot)
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    if (result.response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }, function (result) {
    //result.error result.response, result.body
    if (result.response && result.response.statusCode == 404) {
      return false;
    } else {
      throw result;
    }
  });
};
storageProto.get = function (pathFromRoot, versionEntryId) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot)
    };
    if (versionEntryId) {
      opts.params = {
        entry_id: versionEntryId
      };
    }
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};

//undocumented, will bo official in v3
storageProto.parents = function (pathFromRoot) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot) + "/parents"
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
storageProto.download = function (pathFromRoot, versionEntryId, isBinary) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS.fscontent + helpers.encodeURIPath(pathFromRoot)
    };
    if (versionEntryId) {
      opts.params = {
        entry_id: versionEntryId
      };
    }
    if (isBinary) {
      opts.responseType = "arraybuffer";
    }
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.response;
  });
};
storageProto.createFolder = function (pathFromRoot) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    var opts = {
      method: "POST",
      url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot),
      json: {
        action: "add_folder"
      }
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    if (result.response.statusCode == 201) {
      return {
        path: pathFromRoot
      };
    }
  });
};
storageProto.move = storageProto.rename = function (pathFromRoot, newPath) {
  return transfer(this.requestEngine, this.getDecorator(), pathFromRoot, newPath, "move");
};
storageProto.copy = function (pathFromRoot, newPath) {
  return transfer(this.requestEngine, this.getDecorator(), pathFromRoot, newPath, "copy");
};
function transfer(requestEngine, decorate, pathFromRoot, newPath, action) {
  return promises(true).then(function () {
    if (!newPath) {
      throw new Error("Cannot move to empty path");
    }
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot);
    newPath = helpers.encodeNameSafe(newPath);
    var opts = {
      method: "POST",
      url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot),
      json: {
        action: action,
        destination: newPath
      }
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
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
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    var file = fileOrBlob;
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    var opts = {
      method: "POST",
      url: requestEngine.getEndpoint() + ENDPOINTS.fscontent + helpers.encodeURIPath(pathFromRoot),
      body: file
    };
    opts.headers = {};
    if (mimeType) {
      opts.headers["Content-Type"] = mimeType;
    }
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return {
      id: result.response.headers["etag"],
      group_id: result.body.group_id,
      path: pathFromRoot
    };
  });
};

//currently not supported by back - end
//
//function storeFileMultipart(pathFromRoot, fileOrBlob) {
//    return promises(true).then(function () {
//        if (!window.FormData) {
//            throw new Error("Unsupported browser");
//        }
//        var file = fileOrBlob;
//        var formData = new window.FormData();
//        formData.append('file', file);
//        pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
//        var opts = {
//            method: "POST",
//            url: api.getEndpoint() + fscontent + helpers.encodeURIPath(pathFromRoot),
//            body: formData,
//        };
//        return api.promiseRequest(decorate(opts));
//    }).then(function (result) { //result.response result.body
//        return ({
//            id: result.response.getResponseHeader("etag"),
//            path: pathFromRoot
//        });
//    });
//}

//private
function remove(requestEngine, decorate, pathFromRoot, versionEntryId) {
  return promises(true).then(function () {
    pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
    var opts = {
      method: "DELETE",
      url: requestEngine.getEndpoint() + ENDPOINTS.fsmeta + helpers.encodeURIPath(pathFromRoot)
    };
    if (versionEntryId) {
      opts.params = {
        entry_id: versionEntryId
      };
    }
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.response.statusCode;
  });
}
storageProto.removeFileVersion = function (pathFromRoot, versionEntryId) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    if (!versionEntryId) {
      throw new Error("Version ID (second argument) is missing");
    }
    return remove(requestEngine, decorate, pathFromRoot, versionEntryId);
  });
};
storageProto.remove = function (pathFromRoot, versionEntryId) {
  var decorate = this.getDecorator();
  return remove(this.requestEngine, decorate, pathFromRoot, versionEntryId);
};
storageProto = helpers.extend(storageProto, lock);
storageProto = helpers.extend(storageProto, chunkedUpload);
Storage.prototype = resourceIdentifier(storageProto);
module.exports = Storage;

},{"34":34,"35":35,"39":39,"40":40,"43":43,"50":50,"62":62,"66":66}],46:[function(require,module,exports){
"use strict";

var promises = require(62);
var decorators = require(35);
var ENDPOINTS_users = require(50).users;
function User(requestEngine) {
  this.requestEngine = requestEngine;
  decorators.install(this);
}
var userProto = {};
userProto.getById = function (userId) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS_users + userId
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
userProto.getByName = function (username) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS_users,
      params: {
        filter: 'userName eq "' + username + '"'
      }
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    if (result.body.resources && result.body.resources[0]) {
      return result.body.resources[0];
    } else {
      var err = Error("User not found");
      err.statusCode = 404;
      throw err;
    }
  });
};
User.prototype = userProto;
module.exports = User;

},{"35":35,"50":50,"62":62}],47:[function(require,module,exports){
"use strict";

var promises = require(62);
var decorators = require(35);
var ENDPOINTS_perms = require(50).perms;
function UserPerms(requestEngine) {
  this.requestEngine = requestEngine;
  decorators.install(this);
  this.addDecorator("path", pointFolder("folder"));
  this.addDecorator("folderId", pointFolder("folder_id"));
}
function pointFolder(what) {
  return function (opts, data) {
    opts.params || (opts.params = {});
    opts.params[what] = data;
    return opts;
  };
}
var userPermsProto = {};
userPermsProto.get = function (user) {
  var requestEngine = this.requestEngine;
  var decorate = this.getDecorator();
  return promises(true).then(function () {
    var opts = {
      method: "GET",
      url: requestEngine.getEndpoint() + ENDPOINTS_perms + "/user" + (user ? "/" + user : "")
    };
    return requestEngine.promiseRequest(decorate(opts));
  }).then(function (result) {
    //result.response result.body
    return result.body;
  });
};
UserPerms.prototype = userPermsProto;
module.exports = UserPerms;

},{"35":35,"50":50,"62":62}],48:[function(require,module,exports){
"use strict";

var helpers = require(66);
var dom = require(64);
var messages = require(67);
function serializablifyXHR(res) {
  var resClone = {};
  for (var key in res) {
    //purposefully getting items from prototype too
    if (typeof res[key] !== "function" && key !== "headers") {
      resClone[key] = res[key];
    }
  }
  ;
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
        });
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

},{"64":64,"66":66,"67":67}],49:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var dom = require(64);
var messages = require(67);
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
  return "" + ~~(Math.random() * 9999999) + ~~(Math.random() * 9999999);
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
  };
}
function setupForwarding(api, channel) {
  var mkForwarder = function mkForwarder(namespaceName, method) {
    api[namespaceName][method] = forwardMethod(namespaceName, method, channel, function () {
      return api.auth.getToken();
    });
  };

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
      return parentDestroy.apply(api, arguments);
    }
  };
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
  var onIframeLoad = function onIframeLoad() {
    setTimeout(function () {
      channel.ready.resolve();
    }, 50);
  };
  if (iframe.addEventListener) {
    iframe.addEventListener("load", onIframeLoad, false);
  } else if (iframe.attachEvent) {
    iframe.attachEvent("onload", onIframeLoad);
  }
  var body = document.body || document.getElementsByTagName("body")[0];
  body.appendChild(iframe);
  channel.iframe = iframe;
  return setupForwarding(api, channel);
}
module.exports = init;

},{"62":62,"64":64,"66":66,"67":67}],50:[function(require,module,exports){
module.exports={
    "fsmeta": "/v1/fs",
    "fscontent": "/v1/fs-content",
    "fschunked": "/v1/fs-content-chunked",
    "notes": "/v1/notes",
    "links": "/v1/links",
    "perms": "/v1/perms",
    "userinfo": "/v1/userinfo",
    "users": "/v2/users/",
    "events": "/v1/events",
    "search": "/v1/search",
    "eventscursor": "/v1/events/cursor",
    "tokenauth": "/puboauth/token"
}

},{}],51:[function(require,module,exports){
"use strict";

var helpers = require(66);
module.exports = function (opts, model) {
  var page = 1;
  var totalPages = 1;
  var rawItems;
  var rawItemSelf;
  var currentPath;
  function fetchImplementation(path) {
    if (path) {
      currentPath = path;
    }
    return opts.API.storage.path(currentPath).get().then(function (m) {
      return setData(m);
    });
  }
  function canJump(offset) {
    var newPage = page + offset;
    return newPage <= totalPages && newPage > 0;
  }
  function switchPage(offset) {
    if (canJump(offset)) {
      page += offset;
    }
    return opts.API.manual.promise(buildDataObj());
  }
  function buildDataObj() {
    var pageArr = rawItems.slice((page - 1) * opts.pageSize, page * opts.pageSize);
    return {
      canJump: canJump,
      switchPage: switchPage,
      page: page,
      totalPages: totalPages,
      items: pageArr,
      itemSelf: rawItemSelf
    };
  }
  function setData(m) {
    page = 1;
    rawItems = [];
    rawItemSelf = null;
    if (m) {
      currentPath = m.path;
      helpers.each(m.folders, function (f) {
        rawItems.push(f);
      });
      //ignore files if they're not selectable
      if (opts.filesOn) {
        helpers.each(m.files, function (f) {
          if (!opts.fileFilter || opts.fileFilter(f)) {
            rawItems.push(f);
          }
        });
      }
      rawItemSelf = m;
      delete rawItemSelf.files;
      delete rawItemSelf.folders;
    }
    totalPages = ~~(rawItems.length / opts.pageSize) + 1;
    return buildDataObj();
  }
  model.fetch = function (path) {
    var self = this;
    if (!self.processing) {
      self.processing = true;
      if (path) {
        self.path = path;
      }
      this.viewState.searchOn = false;
      self.onloading();
      fetchImplementation(self.path).then(function (data) {
        self._itemsUpdated(data);
        model.opts.handlers.navigation({
          path: model.path,
          folder_id: model.itemSelf.folder_id,
          forbidSelection: model.forbidSelection
        });
      }).fail(function (e) {
        self._itemsUpdated();
        self.onerror(e);
      });
    }
  };
  model.goUp = function () {
    var path = this.path.replace(/\/[^\/]+\/?$/i, "") || "/";
    if (path !== this.path) {
      this.fetch(path);
    }
  };
};

},{"66":66}],52:[function(require,module,exports){
"use strict";

var helpers = require(66);
module.exports = function (opts, model) {
  var currentQuery;
  var previousQuery;
  var currentResult;
  var page;
  opts.API.search.itemsPerPage(opts.pageSize);
  function searchImplementation(query) {
    currentQuery = query;
    return opts.API.search.getResults(query).then(function (response) {
      //if no query was started in the meantime
      if (currentQuery === query) {
        currentResult = response;
        page = 0;
        return buildDataObj(response.sample);
      }
    });
  }
  function canJump(offset) {
    var newPage = page + offset;
    return newPage <= currentResult.totalPages && newPage > 0;
  }
  function switchPage(offset) {
    if (canJump(offset)) {
      page += offset;
    }
    return currentResult.page(page).then(buildDataObj);
  }
  function buildDataObj(items) {
    if (opts.fileFilter) {
      helpers.each(items, function (item) {
        if (!opts.fileFilter(item)) {
          item.disabled = true;
        }
      });
    }
    return {
      canJump: canJump,
      switchPage: switchPage,
      page: page + 1,
      totalPages: currentResult.totalPages,
      items: items
    };
  }
  model.cancelSearch = function () {
    currentQuery = null;
    previousQuery = null;
    this.processing = false;
    //hide search results by reloading current folder
    this.fetch();
  };
  model.search = function (query) {
    var self = this;
    if (previousQuery !== query) {
      self.processing = true;
      this.viewState.searchOn = true;
      self.onloading();
      previousQuery = query;
      searchImplementation(query).then(function (data) {
        if (data) {
          self._itemsUpdated(data);
        }
      }).fail(function (e) {
        self._itemsUpdated();
        self.onerror(e);
      });
    }
  };
};

},{"66":66}],53:[function(require,module,exports){
"use strict";

module.exports = {
  "404": "This item doesn't exist (404)",
  "403": "Access denied (403)",
  "409": "Forbidden location (409)",
  "596": "Path contains an unexpected character (596)",
  "4XX": "Incorrect API request",
  "5XX": "API server error, try again later",
  "R": "API use limit reached",
  "0": "Browser error, try again",
  "?": "Unknown error"
};

},{}],54:[function(require,module,exports){
"use strict";

var helpers = require(66);
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
  "goog": ["gdoc", "gsheet", "gslides", "gdraw"]
  //    "email": ["msg", "olk14message", "pst", "emlx", "olk14event", "eml", "olk14msgattach", "olk14msgsource"],
}, function (list, mime) {
  helpers.each(list, function (ex) {
    mapping[ex] = mime;
  });
});
function _mime(ext) {
  return mapping[ext] || "unknown";
}
function getExt(name) {
  var splitted = name.split(".");
  if (splitted.length > 1) {
    return splitted[splitted.length - 1];
  } else {
    return "";
  }
}
function getMime(name) {
  return _mime(getExt(name));
}
function getExtensionFilter(filter) {
  return function (file) {
    var ext = getExt(file.name);
    return filter(ext, _mime(ext));
  };
}
module.exports = {
  getMime: getMime,
  getExt: getExt,
  getExtensionFilter: getExtensionFilter
};

},{"66":66}],55:[function(require,module,exports){
"use strict";

var helpers = require(66);
var dom = require(64);
var View = require(60);
var Model = require(56);
function noGoog(ext, mime) {
  return mime !== "goog";
}
function init(API) {
  var filePicker;
  filePicker = function filePicker(node, setup) {
    if (!setup) {
      throw new Error("Setup required as a second argument");
    }
    var _close,
      openPath,
      fpView,
      fpModel,
      defaults = {
        folder: true,
        file: true,
        multiple: true,
        forbidden: []
      };
    var selectOpts = helpers.extend(defaults, setup.select);
    _close = function close() {
      fpView.destroy();
      fpView = null;
      fpModel = null;
    };
    openPath = function openPath(path) {
      fpModel.fetch(path || "/");
    };
    fpModel = new Model(API, {
      select: selectOpts,
      filterExtensions: typeof setup.filterExtensions === "undefined" ? noGoog : setup.filterExtensions,
      handlers: {
        navigation: function navigation(currentFolder) {
          setup.navigation && setup.navigation(currentFolder);
        }
      }
    });
    fpView = new View({
      el: node,
      model: fpModel,
      barAlign: setup.barAlign,
      handlers: {
        ready: setup.ready,
        selection: function selection(items) {
          _close();
          setup.selection && setup.selection(items);
        },
        close: function close(e) {
          _close();
          setup.cancel && setup.cancel(e);
        },
        error: setup.error
      },
      keys: setup.keys
    }, setup.texts);
    openPath(setup.path || "/");
    return {
      getCurrentFolder: function getCurrentFolder() {
        return {
          path: fpModel.path,
          folder_id: fpModel.itemSelf.folder_id,
          forbidSelection: fpModel.forbidSelection
        };
      },
      openPath: openPath,
      close: _close
    };
  };
  return filePicker;
}
module.exports = init;

},{"56":56,"60":60,"64":64,"66":66}],56:[function(require,module,exports){
"use strict";

var helpers = require(66);
var exts = require(54);
var Item = require(57);
var folderFetchProvider = require(51);
var searchProvider = require(52);

//Collection
function Model(API, opts) {
  this.opts = opts;
  this.page = 1;
  this.isMultiselectable = this.opts.select.multiple;
  this.viewState = {};
  var dataProviderSettings = {
    API: API,
    pageSize: 100,
    filesOn: opts.select.filesRemainVisible || opts.select.file,
    fileFilter: opts.filterExtensions && exts.getExtensionFilter(opts.filterExtensions)
  };
  //creates this.fetch and this.goUp
  folderFetchProvider(dataProviderSettings, this);
  //creates this.search
  searchProvider(dataProviderSettings, this);
}
Model.prototype.onloading = helpers.noop;
Model.prototype.onupdate = helpers.noop;
Model.prototype.onerror = helpers.noop;
Model.prototype._itemsUpdated = function (data) {
  var self = this;
  self.processing = false;
  self.dataSrc = data;
  this.currentItem = -1;
  var pathArray = helpers.normalizePath(this.path).split("/");
  pathArray.pop();
  this.parentForbidsSelection = pathArray.length > 0 ? helpers.contains(this.opts.select.forbidden, pathArray.join("/") || "/") : false;
  if (data) {
    //force disabled selection on root or other path
    this.forbidSelection = helpers.contains(this.opts.select.forbidden, helpers.normalizePath(this.path));
    this.items = [];
    helpers.each(data.items, function (item) {
      self.items.push(new Item(item, self));
    });
    this.isEmpty = data.items.length === 0;
    this.hasPages = data.totalPages > 1;
    this.totalPages = data.totalPages;
    this.page = data.page;
    this.itemSelf = data.itemSelf;
  } else {
    this.items = [];
    this.isEmpty = true;
    this.hasPages = false;
  }
  this.onupdate();
  this.onchange();
};
Model.prototype.switchPage = function (offset) {
  var self = this;
  if (!self.processing && self.dataSrc.canJump(offset)) {
    self.processing = true;
    self.dataSrc.switchPage(offset).then(function (data) {
      self._itemsUpdated(data);
    }, function (e) {
      self._itemsUpdated();
      self.onerror(e);
    }).fail(self.onerror);
  }
};
Model.prototype.getSelected = function () {
  var selected = [];
  helpers.each(this.items, function (item) {
    if (item.selected) {
      selected.push(item.data);
    }
  });
  return selected;
};
Model.prototype.deselect = function () {
  helpers.each(this.items, function (item) {
    if (item.selected) {
      item.selected = false;
      item.onchange();
    }
  });
};
Model.prototype.setAllSelection = function (selected) {
  helpers.each(this.items, function (item) {
    item.selected = selected;
    item.onchange();
  });
  this.onchange();
};
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
};
Model.prototype.getCurrent = function () {
  return this.items[this.currentItem];
};
module.exports = Model;

},{"51":51,"52":52,"54":54,"57":57,"66":66}],57:[function(require,module,exports){
"use strict";

var exts = require(54);

//Item model
function Item(data, parent) {
  this.data = data;
  if (!this.data.is_folder) {
    this.ext = exts.getExt(data.name).substr(0, 3);
    this.mime = exts.getMime(data.name);
  } else {
    this.ext = "";
    this.mime = "folder";
  }
  this.isSelectable = !data.disabled && (parent.opts.select.folder && data.is_folder || parent.opts.select.file && !data.is_folder) && !parent.forbidSelection;
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
module.exports = Item;

},{"54":54}],58:[function(require,module,exports){
"use strict";

var helpers = require(66);
var jungle = require(71);
function beradcrumbView(parent) {
  var self = this;
  var myElements = this.els = {};
  self.model = parent.model;
  myElements.selectAll = jungle.node(["input[type=checkbox]", {
    title: parent.txt("Select all")
  }]);
  myElements.back = jungle.node(["a.eg-picker-back.eg-btn[title=back]"]);
  myElements.crumb = jungle.node(["span.eg-picker-path"]);
  parent.handleClick(myElements.selectAll, function (e) {
    parent.model.setAllSelection(!!e.target.checked);
  });
  parent.handleClick(myElements.back, parent.goUp);
  parent.handleClick(myElements.crumb, function (e) {
    var path = e.target.getAttribute("data-path");
    if (path) {
      self.model.fetch(path);
    }
  });
}
beradcrumbView.prototype.getTree = function () {
  var myElements = this.els;
  var topbar = ["div.eg-bar.eg-top"];
  if (this.model.isMultiselectable) {
    myElements.selectAll.checked = false;
    topbar.push(myElements.selectAll);
  }
  topbar.push(myElements.back);
  topbar.push(myElements.crumb);
  topbar = jungle.node(topbar);
  return topbar;
};
beradcrumbView.prototype.render = function () {
  var currentPath = "/";
  var path = this.model.path || currentPath; //in case path was not provided, go for root

  var list = path.split("/");
  var crumbItems = [];
  var maxSpace = ~~(100 / list.length); //assigns maximum space for text
  helpers.each(list, function (folder, num) {
    if (folder) {
      currentPath += folder + "/";
      num > 1 && crumbItems.push(["span", "/"]);
      crumbItems.push(["a", {
        "data-path": currentPath,
        "title": folder,
        "style": "max-width:" + maxSpace + "%"
      }, folder]);
    } else {
      if (num === 0) {
        crumbItems.push(["a", {
          "data-path": currentPath
        }, "/"]);
      }
    }
  });
  this.els.crumb.innerHTML = "";
  this.els.crumb.appendChild(jungle.tree([crumbItems]));
};
module.exports = beradcrumbView;

},{"66":66,"71":71}],59:[function(require,module,exports){
"use strict";

var helpers = require(66);
var dom = require(64);
var jungle = require(71);
var airaExpanded = "aria-expanded";
function searchView(parent) {
  var self = this;
  var myElements = this.els = {};
  self.evs = [];
  self.model = parent.model;
  self.action = helpers.bindThis(self, actionImplementation);
  myElements.close = jungle.node(["a.eg-search-x.eg-btn", "+"]);
  myElements.ico = jungle.node(["a.eg-btn.eg-search-ico[tabindex=2]"]);
  myElements.input = jungle.node(["input[placeholder=" + parent.txt("Search in files") + "][tabindex=1]"]);
  myElements.field = jungle.node(["div.eg-search-inpt", myElements.input]);
  parent.handleClick(myElements.close, function () {
    self.model.viewState.searchOn = false;
    self.model.cancelSearch();
    self.el.removeAttribute(airaExpanded);
  });
  function invoke() {
    if (self.model.viewState.searchOn) {
      self.action();
    } else {
      self.model.viewState.searchOn = true;
      self.el.setAttribute(airaExpanded, true);
      myElements.input.focus();
    }
  }
  parent.handleClick(myElements.ico, invoke);
  parent.evs.push(dom.onKeys(myElements.ico, {
    "<space>": invoke
  }, true));
  parent.evs.push(dom.onKeys(myElements.input, {
    "<enter>": self.action,
    "other": helpers.debounce(self.action, 800)
  }, true));
}
searchView.prototype.getTree = function () {
  var myElements = this.els;
  var searchBarDefinition = "div.eg-search.eg-bar";
  if (this.model.viewState.searchOn) {
    searchBarDefinition += "[" + airaExpanded + "=true]";
  }
  var el = [searchBarDefinition];
  el.push(myElements.close);
  el.push(myElements.field);
  el.push(myElements.ico);
  el = jungle.node(el);
  this.el = el;
  return el;
};
searchView.prototype.render = function () {
  if (this.model.viewState.searchOn) {
    setTimeout(this.els.input.focus(), 0);
  }
};
function actionImplementation() {
  var myElements = this.els;
  if (myElements.input.value && myElements.input.value.length > 2) {
    this.model.search(myElements.input.value);
  }
}
module.exports = searchView;

},{"64":64,"66":66,"71":71}],60:[function(require,module,exports){
"use strict";

//template engine based upon JsonML
var dom = require(64);
var helpers = require(66);
var texts = require(68);
var jungle = require(71);
var SubvBread = require(58);
var SubvSearch = require(59);
require(69);
var fontLoaded = false;
var currentGlobalKeyboadrFocus = "no";
function View(opts, txtOverride) {
  var self = this;
  this.uid = Math.random();
  currentGlobalKeyboadrFocus = this.uid;
  this.el = opts.el;
  this.evs = [];
  var myElements = this.els = {};
  if (!opts.noFont) {
    renderFont();
  }
  this.txt = texts(txtOverride);
  this.bottomBarClass = opts.barAlign === "left" ? "" : ".eg-bar-right";
  this.handlers = helpers.extend({
    selection: helpers.noop,
    events: helpers.noop,
    close: helpers.noop,
    error: null
  }, opts.handlers);

  //action handlers
  //this.selection = helpers.extend(this.selection, opts.selection);
  this.model = opts.model;

  //bind to model events
  this.model.onloading = helpers.bindThis(self, self.renderLoading);
  this.model.onupdate = function () {
    self.handlers.events("beforeRender", self.model);
    self.render();
    self.handlers.events("render", self.model);
    if (self.handlers.ready) {
      var runReady = self.handlers.ready;
      self.handlers.ready = null;
      setTimeout(runReady, 0);
    }
  };
  this.model.onerror = helpers.bindThis(this, this.errorHandler);
  self.kbNav_up = helpers.bindThis(self, self.kbNav_up);
  self.kbNav_down = helpers.bindThis(self, self.kbNav_down);
  self.kbNav_select = helpers.bindThis(self, self.kbNav_select);
  self.kbNav_explore = helpers.bindThis(self, self.kbNav_explore);
  self.model.goUp = helpers.bindThis(self.model, self.model.goUp);
  self.confirmSelection = helpers.bindThis(self, self.confirmSelection);
  self.handlers.close = helpers.bindThis(self, self.handlers.close);
  this.model.onchange = function () {
    if (self.model.getSelected().length > 0 || self.model.opts.select.folder && !(self.model.forbidSelection || self.model.parentForbidsSelection)) {
      self.els.ok.removeAttribute("disabled");
    } else {
      self.els.ok.setAttribute("disabled", "");
    }
  };

  //create reusable view elements
  myElements.container = jungle.node(["div.eg-in"]);
  myElements.close = jungle.node(["a.eg-picker-close.eg-btn", this.txt("Cancel")]);
  myElements.ok = jungle.node(["span.eg-picker-ok.eg-btn.eg-btn-prim[tabindex=0][role=button]", this.txt("OK")]);
  myElements.pgup = jungle.node(["span.eg-picker-pgup.eg-btn", ">"]);
  myElements.pgdown = jungle.node(["span.eg-picker-pgup.eg-btn", "<"]);

  //bind events and store references to unbind later
  this.handleClick(this.el, self.focused); //maintains focus when multiple instances exist

  this.handleClick(myElements.close, function () {
    self.handlers.close();
  });
  this.handleClick(myElements.ok, self.confirmSelection);
  this.evs.push(dom.onKeys(myElements.ok, {
    "<space>": self.confirmSelection
  }, true));
  this.handleClick(myElements.pgup, function (e) {
    self.model.switchPage(1);
  });
  this.handleClick(myElements.pgdown, function (e) {
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
    keys[keybinding["up"]] = self.kbNav_up;
    keys[keybinding["down"]] = self.kbNav_down;
    keys[keybinding["select"]] = self.kbNav_select;
    keys[keybinding["explore"]] = self.kbNav_explore;
    keys[keybinding["back"]] = self.model.goUp;
    keys[keybinding["confirm"]] = self.confirmSelection;
    keys[keybinding["close"]] = self.handlers.close;
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
    this.evs.push(dom.onKeys(document, keys, helpers.bindThis(self, self.hasFocus)));
  }

  //initialize subviews
  self.subviews = {
    breadcrumb: new SubvBread(this),
    search: new SubvSearch(this)
  };
  this.buildLayout();
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
};
viewPrototypeMethods.handleClick = function (el, method) {
  this.evs.push(dom.addListener(el, "click", helpers.bindThis(this, method)));
};
viewPrototypeMethods.errorHandler = function (e) {
  if (this.handlers.error) {
    var message = this.handlers.error(e);
    if (typeof message === "string") {
      this.renderProblem("*", message);
      return;
    } else {
      if (message === false) {
        return;
      }
    }
  }
  this.renderProblem(e.RATE ? "R" : e.statusCode, e.message);
};

//=================================================================
// rendering
//=================================================================

//all this mess is because IE8 dies on @include in css
function renderFont() {
  if (!fontLoaded) {
    document.getElementsByTagName("head")[0].appendChild(jungle.tree([["link", {
      href: "https://fonts.googleapis.com/css?family=Open+Sans:400,600",
      type: "text/css",
      rel: "stylesheet"
    }]]));
    fontLoaded = true;
  }
}
viewPrototypeMethods.buildLayout = function () {
  var self = this;
  var myElements = this.els;
  var search = self.subviews.search.getTree();
  var layoutFragm = jungle.tree([["div.eg-theme.eg-picker.eg-widget", search, myElements.container]]);
  this.el.innerHTML = "";
  this.el.appendChild(layoutFragm);
};
viewPrototypeMethods.render = function () {
  var self = this;
  var myElements = this.els;
  myElements.list = document.createElement("ul");
  var topbar = self.subviews.breadcrumb.getTree();
  var layoutFragm = jungle.tree([topbar, myElements.list, ["div.eg-bar" + this.bottomBarClass, ["a.eg-brand", {
    title: "egnyte.com"
  }], myElements.ok, myElements.close, ["div.eg-picker-pager" + (this.model.hasPages ? "" : ".eg-not"), myElements.pgdown, ["span", this.model.page + "/" + this.model.totalPages], myElements.pgup]]]);
  myElements.container.innerHTML = "";
  myElements.container.appendChild(layoutFragm);
  //couldn't CSS it. blame old browsers
  myElements.list.style.height = this.el.offsetHeight - 2 * topbar.offsetHeight + "px";
  self.subviews.breadcrumb.render();
  if (this.model.isEmpty) {
    this.renderEmpty();
  } else {
    helpers.each(this.model.items, function (item) {
      self.renderItem(item);
    });
  }
};
viewPrototypeMethods.renderItem = function (itemModel) {
  var self = this;
  var itemName = jungle.node(["a.eg-picker-name" + (itemModel.data.is_folder ? ".eg-folder" : ".eg-file"), {
    "title": itemModel.data.name
  }, ["span.eg-ico.eg-mime-" + itemModel.mime, {
    "data-ext": itemModel.ext
  }, ["span", itemModel.ext]], itemModel.data.name]);
  var checkboxSetup = "input[type=checkbox]";
  if (!itemModel.isSelectable) {
    checkboxSetup += itemModel.data.is_folder ? ".eg-not" : "[disabled=disabled][title=" + this.txt("This file cannot be selected") + "]";
  }
  var itemCheckbox = jungle.node([checkboxSetup]);
  itemCheckbox.checked = itemModel.selected;
  var itemNode = jungle.node(["li.eg-picker-item" + (itemModel.isSelectable ? "" : ".eg-disabled") + (itemModel.selected ? ".eg-selected" : ""), self.model.opts.select.multiple === false ? [] : itemCheckbox, itemName]);
  dom.addListener(itemName, "click", function (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    itemModel.defaultAction();
    return false;
  });
  dom.addListener(itemNode, "click", function () {
    itemModel.toggleSelect();
  });
  itemModel.onchange = function () {
    self.handlers.events("itemChange", itemModel);
    itemCheckbox.checked = itemModel.selected;
    itemNode.setAttribute("class", "eg-picker-item" + (itemModel.selected ? " eg-selected" : "") + (itemModel.isSelectable ? "" : " eg-disabled"));
    itemNode.setAttribute("aria-selected", itemModel.isCurrent);
    if (itemModel.isCurrent) {
      try {
        //IE8 dies on this randomly :/
        self.els.list.scrollTop = itemNode.offsetTop - self.els.list.offsetHeight;
      } catch (e) {}
      //itemNode.scrollIntoView(false);
    }
  };
  this.els.list.appendChild(itemNode);
};
viewPrototypeMethods.renderLoading = function () {
  if (this.els.list) {
    this.els.list.innerHTML = "";
    this.els.list.appendChild(jungle.tree([["div.eg-placeholder", ["div.eg-spinner"], this.txt("Loading")]]));
  }
};
var msgs = require(53);
viewPrototypeMethods.renderProblem = function (code, message) {
  message = msgs["" + code] || msgs[~(code / 100) + "XX"] || message || msgs["?"];
  if (this.els.list) {
    this.els.list.innerHTML = "";
    this.els.list.appendChild(jungle.tree([["div.eg-placeholder", ["div.eg-picker-error"], message]]));
  } else {
    this.handlers.close({
      message: message
    });
  }
};
viewPrototypeMethods.renderEmpty = function () {
  if (this.els.list) {
    this.els.list.innerHTML = "";
    if (this.model.viewState.searchOn) {
      this.els.list.appendChild(jungle.tree([["div.eg-search-no", ["p", this.txt("No search results found")]]]));
    } else {
      this.els.list.appendChild(jungle.tree([["div.eg-placeholder.eg-folder", ["div.eg-ico"], this.txt("This folder is empty")]]));
    }
  }
};

//=================================================================
// focus
//=================================================================

viewPrototypeMethods.hasFocus = function () {
  return currentGlobalKeyboadrFocus === this.uid;
};
viewPrototypeMethods.focused = function () {
  currentGlobalKeyboadrFocus = this.uid;
};

//=================================================================
// navigation
//=================================================================

viewPrototypeMethods.goUp = function () {
  this.model.goUp();
};
viewPrototypeMethods.confirmSelection = function () {
  var selected = this.model.getSelected();
  console.log();
  if (selected && selected.length) {
    this.handlers.selection.call(this, this.model.getSelected());
  } else if (this.model.opts.select.folder && !(this.model.forbidSelection || this.model.parentForbidsSelection)) {
    this.handlers.selection.call(this, [this.model.itemSelf]);
  }
};
viewPrototypeMethods.kbNav_up = function () {
  this.model.mvCurrent(-1);
};
viewPrototypeMethods.kbNav_down = function () {
  this.model.mvCurrent(1);
};
viewPrototypeMethods.kbNav_select = viewPrototypeMethods.kbNav_confirm = function () {
  var item = this.model.getCurrent();
  if (item) {
    item.toggleSelect();
  }
};
viewPrototypeMethods.kbNav_explore = function () {
  var item = this.model.getCurrent();
  if (item && item.data.is_folder) {
    item.defaultAction();
  }
};
View.prototype = viewPrototypeMethods;
module.exports = View;

},{"53":53,"58":58,"59":59,"64":64,"66":66,"68":68,"69":69,"71":71}],61:[function(require,module,exports){
"use strict";

var promises = require(62);
var helpers = require(66);
var dom = require(64);
var messages = require(67);
var decorators = require(35);
var ENDPOINTS = require(50);
var plugins = {};
module.exports = {
  define: function define(name, pluginClosure) {
    if (plugins[name]) {
      throw new Error("Plugin conflict. " + name + " already exists");
    } else {
      plugins[name] = pluginClosure;
    }
  },
  install: function install(root) {
    helpers.each(plugins, function (pluginClosure, name) {
      pluginClosure(root, {
        API: root.API,
        ENDPOINTS: ENDPOINTS,
        promises: promises,
        decorators: decorators,
        reusables: {
          helpers: helpers,
          dom: dom,
          messages: messages
        }
      });
    });
  }
};

},{"35":35,"50":50,"62":62,"64":64,"66":66,"67":67}],62:[function(require,module,exports){
"use strict";

//Native Promise wrapper to replace Q library
//Provides Q-compatible API using native Promises
//Uses conditional prototype modification with safety checks

// Add Q-compatible methods to Promise prototype only if not already present
// This is safer than the previous approach as it checks for existing methods
if (!Promise.prototype.fail) {
  Promise.prototype.fail = function (onRejected) {
    return this["catch"](onRejected);
  };
}
if (!Promise.prototype.delay) {
  Promise.prototype.delay = function (ms) {
    return this.then(function (value) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(value);
        }, ms);
      });
    });
  };
}

// Main Promises function - returns a resolved promise
var Promises = function Promises(value) {
  return Promise.resolve(value);
};

// Deferred pattern for Q compatibility
Promises.defer = function () {
  var resolve, reject;
  var promise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });
  return {
    promise: promise,
    resolve: resolve,
    reject: reject
  };
};

// Promise.all wrapper
Promises.all = function (array) {
  return Promise.all(array);
};

// Promise.allSettled wrapper
Promises.allSettled = function (array) {
  return Promise.allSettled(array);
};

// Q compatibility - when() method
Promises.when = function (value) {
  return Promise.resolve(value);
};

// Static delay method
Promises.delay = function (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
};

// Export the Promises wrapper
module.exports = Promises;

},{}],63:[function(require,module,exports){
"use strict";

var helpers = require(66);
var dom = require(64);
var jungle = require(72);
var texts = require(68);
require(69);
function openPrompt(node, setup) {
  if (!setup) {
    throw new Error("Setup required as a second argument");
  }
  var render, cleanup, ev;
  var txt = texts(setup.texts);
  cleanup = function cleanup() {
    ev.destroy();
    node.innerHTML = "";
  };
  var btOk = jungle([["span.eg-prompt-ok.eg-btn.eg-btn-prim", txt("Ok")]]).childNodes[0];
  var input = jungle([["input[type=text]"]]).childNodes[0];
  ev = dom.addListener(btOk, "click", function () {
    var val = input.value;
    cleanup();
    setup.result(input.value);
  });
  var bottomBarClass = setup.barAlign === "left" ? "" : ".eg-bar-right";
  var layoutFragm = jungle([["div.eg-theme.eg-widget.eg-prompt", ["a.eg-brand", {
    title: "egnyte.com"
  }], ["div.eg-ctlgrp", ["label.eg-prompt-ask", txt("question")], input], ["div.eg-bar" + bottomBarClass, [btOk]]]]);
  node.innerHTML = "";
  node.appendChild(layoutFragm);
  input.focus();
  return {
    close: cleanup
  };
}
;
module.exports = openPrompt;

},{"64":64,"66":66,"68":68,"69":69,"72":72}],64:[function(require,module,exports){
"use strict";

var vkey = require(28);
function addListener(elem, type, callback) {
  var handler;
  if (elem.addEventListener) {
    handler = callback;
    elem.addEventListener(type, callback, false);
  } else {
    handler = function handler(e) {
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
    destroy: function destroy() {
      removeListener(elem, type, handler);
    }
  };
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
  onKeys: function onKeys(elem, actions, hasFocus) {
    return addListener(elem, "keyup", function (ev) {
      if (ev.target.tagName && ev.target.tagName.toLowerCase() !== "input") {
        ev.preventDefault && ev.preventDefault();
      }
      ev.stopPropagation && ev.stopPropagation();
      if (hasFocus === true || hasFocus()) {
        if (actions[vkey[ev.keyCode]]) {
          actions[vkey[ev.keyCode]]();
        } else {
          actions["other"] && actions["other"]();
        }
      }
      return false;
    });
  },
  createFrame: function createFrame(url, scrolling) {
    var iframe = document.createElement("iframe");
    if (!scrolling) {
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
};

},{"28":28}],65:[function(require,module,exports){
"use strict";

var promises = require(62);
module.exports = function (interval, func, errorHandler) {
  var pointer,
    stopped = false,
    repeat = function repeat() {
      clearTimeout(pointer);
      pointer = setTimeout(_runner, 1);
    },
    _runner = function runner() {
      var currentPointer = pointer;
      promises({
        interval: interval,
        repeat: repeat
      }).then(func).fail(function (e) {
        if (errorHandler) {
          return errorHandler(e);
        } else {
          console && console.error("Error in scheduled function", e);
        }
      }).then(function () {
        //pointer changes only if repeat was called and there's no need to schedule next run this time
        if (!stopped && currentPointer === pointer) {
          pointer = setTimeout(_runner, interval);
        }
      });
    };
  _runner();
  return {
    stop: function stop() {
      stopped = true;
      clearTimeout(pointer);
    },
    forceRun: function forceRun() {
      stopped = false;
      return repeat();
    }
  };
};

},{"62":62}],66:[function(require,module,exports){
"use strict";

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
  });
  return found;
}
var disallowedChars = /[":<>|?*\\]/;
function normalizeURL(url) {
  return url.replace(/\/*$/, "");
}
;
function normalizePath(path) {
  return path.replace(/\/*$/, "") || "/";
}
;
function debounce(func, time) {
  var timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, time);
  };
}
module.exports = {
  //simple extend function
  extend: function extend(target) {
    var i, k;
    for (i = 1; i < arguments.length; i++) {
      if (arguments[i]) {
        for (k in arguments[i]) {
          if (arguments[i].hasOwnProperty(k) && typeof arguments[i][k] !== "undefined") {
            target[k] = arguments[i][k];
          }
        }
      }
    }
    return target;
  },
  noop: function noop() {},
  id: function id(a) {
    return a;
  },
  bindThis: function bindThis(that, func) {
    return function () {
      return func.apply(that, arguments);
    };
  },
  debounce: debounce,
  contains: contains,
  each: each,
  normalizeURL: normalizeURL,
  normalizePath: normalizePath,
  httpsURL: function httpsURL(url) {
    return "https://" + normalizeURL(url).replace(/^https?:\/\//, "");
  },
  encodeNameSafe: function encodeNameSafe(name) {
    if (!name) {
      throw new Error("No name given");
    }
    if (disallowedChars.test(name)) {
      throw new Error("Disallowed characters in path");
    }
    name = name.replace(/^\/\//, "/");
    return name;
  },
  encodeURIPath: function encodeURIPath(text) {
    return encodeURI(text).replace(/#/g, "%23");
  }
};

},{}],67:[function(require,module,exports){
"use strict";

var helpers = require(66);

//returns postMessage specific handler
function createMessageHandler(sourceOrigin, marker, callback) {
  return function (event) {
    if (!sourceOrigin || helpers.normalizeURL(event.origin) === helpers.normalizeURL(sourceOrigin)) {
      var message = event.data;
      if (typeof message === 'string' && message.substr(0, marker.length) === marker) {
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
      //the if is needed as some browsers will return undefined when accessing location is forbidden
      if (targetWindow.location.origin || targetWindow.location.protocol) {
        targetOrigin = targetWindow.location.origin || targetWindow.location.protocol + "//" + targetWindow.location.hostname + (targetWindow.location.port ? ":" + targetWindow.location.port : "");
      }
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
};

},{"66":66}],68:[function(require,module,exports){
"use strict";

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

},{}],69:[function(require,module,exports){
(function() { var head = document.getElementsByTagName('head')[0]; var style = document.createElement('style'); style.type = 'text/css';var css = ".eg-picker-back{padding:4px 10px;position:relative;color:#777}.eg-picker-back:hover{color:#4e4e4f}.eg-picker-back:before{content:\"\";display:block;left:4px;border-style:solid;border-width:0 0 3px 3px;transform:rotate(45deg);-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-webkit-transform:rotate(45deg);width:7px;height:7px;padding:0;position:absolute;bottom:10px}.eg-btn.eg-search-x{margin:1px;text-decoration:none !important;position:absolute;color:#777;font-size:36px;line-height:16px;transform:rotate(45deg);-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-webkit-transform:rotate(45deg);border-style:solid}.eg-btn.eg-search-x:hover{color:#4e4e4f}.eg-search-ico:before{display:block;content:\"\";width:7.2px;height:7.2px;border-width:3px;border-style:solid;background:transparent;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%}.eg-search-ico:after{content:\"\";position:absolute;top:14.4px;left:14.4px;border-left-width:3px;border-left-style:solid;height:5.76px;margin:0;-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}@-webkit-keyframes egspin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes egspin{to{transform:rotate(360deg)}}.eg-placeholder{position:absolute;width:100%;top:50%;bottom:50%;margin-top:-34px;text-align:center;color:#777}.eg-placeholder>div{margin:0 auto 5px}.eg-placeholder>.eg-spinner{content:\"\";-webkit-animation:egspin 1s infinite linear;animation:egspin 1s infinite linear;width:30px;height:30px;border:solid 7px;border-radius:50%;border-color:transparent transparent #dbdbdb}.eg-picker-error:before{content:\"?!\";font-size:32px;border:2px solid #5e5f60;padding:0 10px}.eg-ico{margin-right:10px;position:relative;top:-2px}.eg-mime-audio{background:#94cbff}.eg-mime-video{background:#8f6bd1}.eg-mime-pdf{background:#e64e40}.eg-mime-word_processing{background:#4ca0e6}.eg-mime-spreadsheet{background:#6bd17f}.eg-mime-presentation{background:#fa8639}.eg-mime-cad{background:#f2d725}.eg-mime-text{background:#9e9e9e}.eg-mime-image{background:#d16bd0}.eg-mime-code{background:#a5d16b}.eg-mime-archive{background:#d19b6b}.eg-mime-goog{background:#0266c8}.eg-mime-unknown{background:#dbdbdb}.eg-file .eg-ico{width:40px;height:40px;text-align:right}.eg-file .eg-ico>span{text-align:center;font-size:13.33333333px;line-height:18px;font-weight:300;margin:10px 0;height:20px;width:32px;background:rgba(0,0,0,0.15);color:#fff}.eg-folder .eg-ico{background:#fee999;border-top:4.8px #f1dc8e solid;margin-top:8.8px;height:24.6px;overflow:visible;border-radius:2px;width:38px}.eg-folder .eg-ico:before{display:block;position:absolute;top:-7.2px;border-radius:3px;background:#f1dc8e;content:\" \";width:16px;height:6px}.eg-folder .eg-ico>span{display:none}.eg-btn{display:inline-block;line-height:20px;height:20px;text-align:center;cursor:pointer;margin:0 8px}span.eg-btn{padding:4px 15px;background:#fafafa;border:1px solid #ccc;border-radius:2px}span.eg-btn:hover{-webkit-box-shadow:inset 0 -20px 50px -60px #000;box-shadow:inset 0 -20px 50px -60px #000}span.eg-btn:active{-webkit-box-shadow:inset 0 1px 5px -4px #000;box-shadow:inset 0 1px 5px -4px #000}span.eg-btn[disabled]{opacity:.3}a.eg-btn{font-weight:600;padding:4px;border:1px solid transparent;text-decoration:underline}.eg-btn.eg-btn-prim{background:#3191f2;border-color:#2b82d9;color:#fff}.eg-box,.eg-widget,.eg-bar{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;overflow:hidden}.eg-in *{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle}.eg-widget{background:#fff;border:1px solid #dbdbdb;padding:0;color:#5e5f60;font-size:12px;font-family:'Open Sans',sans-serif}.eg-widget input{padding:0}.eg-widget a{cursor:pointer}.eg-widget a:hover{text-decoration:underline}.eg-widget .eg-brand{background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAD1BMVEVLmJRkpqN9trS51tP6/fqnSbSVAAAAfklEQVQoka2OwRGAIAwEiTYQZyiABwX4oAHw+q9JEsgojr7kPnA7Se6cmyfiB/D5H6CjgWSHI7IAj9L8AiAQ62MTqEsJNqH/7JV2rVDtt1DxQ5N0X+hJYWwKDLYIiJePEHDVWGtABd5ySQLkRgJ3wA1QB44thb5jX8C2uXk6AXu0F4Px6fa6AAAAAElFTkSuQmCC') no-repeat center;width:50px;height:32px;margin:0;float:left}.eg-bar{z-index:1;height:50px;padding:10px 10px 0;background:#f1f1f1;border:0 solid #dbdbdb;border-width:1px 0 0 0}.eg-bar.eg-top{box-shadow:0 1px 3px 0 #f1f1f1;border-width:0 0 1px 0;padding-left:0;background:#fff}.eg-bar>*{display:block;float:left}.eg-bar-right>*{float:right}.eg-ctlgrp{padding:20px}.eg-ctlgrp>*{width:99%;margin:10px 0}.eg-not{visibility:hidden}.eg-prompt{padding-top:20px}.eg-picker{height:100%;min-height:300px}.eg-picker input[type=checkbox]{margin:10px 20px}.eg-picker a.eg-file:hover{text-decoration:none}.eg-picker ul{padding:0;margin:0;min-height:200px;overflow-y:scroll}.eg-picker-pager{float:right}.eg-bar-right>.eg-picker-pager{float:left}.eg-picker-path{min-width:60%;width:calc( 100% - 110px );line-height:30px;color:#777;font-size:14px}.eg-picker-path>a{margin:0 2px;white-space:nowrap;display:inline-block;overflow:hidden;text-overflow:ellipsis}.eg-picker-path>a:last-child{color:#5e5f60}.eg-picker-item{line-height:40px;list-style:none;padding:4px 0;border-bottom:1px solid #f2f3f3}.eg-picker-item.eg-selected{background:#EEF5FD;outline:1px solid #dbdbdb}.eg-picker-item[aria-selected=\"true\"]{background:#d4e7fe}.eg-picker-item *{display:inline-block}.eg-picker-item>a{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:300px;max-width:calc(100% - 88px)}.eg-picker-item [disabled]~a,.eg-picker-item.eg-disabled>a{opacity:.6}.eg-picker-item.eg-disabled>a.eg-file{cursor:default}.eg-picker-name{margin-left:4px}.eg-search{background:#fff;width:50px;position:absolute;top:-1px;right:0;z-index:3;transition:width .5s ease;-webkit-transition:width .5s ease;-moz-transition:width .5s ease}.eg-search *{visibility:hidden}.eg-search[aria-expanded]{width:100%}.eg-search[aria-expanded] *{visibility:visible}.eg-search-inpt{width:calc(100% - 55px);padding-left:40px}.eg-search-inpt input{font-family:'Open Sans',sans-serif;width:100%;padding:5px;border-radius:5px;border:1px solid #2b82d9;outline:none}.eg-btn.eg-search-ico{visibility:visible;position:absolute;right:10px}.eg-btn.eg-search-ico:hover{color:#4e4e4f}.eg-search-no{padding:20px}";if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style);}())
},{}],70:[function(require,module,exports){
"use strict";

var helpers = require(66);
var plugins = require(61);
var defaults = require(29);
module.exports = {
  init: function init(egnyteDomainURL, opts) {
    var options = helpers.extend({}, defaults, opts);
    options.egnyteDomainURL = egnyteDomainURL ? helpers.normalizeURL(egnyteDomainURL) : null;
    var exporting = {
      domain: options.egnyteDomainURL,
      setDomain: function setDomain(d) {
        this.domain = options.egnyteDomainURL = helpers.normalizeURL(d);
      },
      API: require(31)(options)
    };
    plugins.install(exporting);
    return exporting;
  },
  plugin: plugins.define
};

},{"29":29,"31":31,"61":61,"66":66}],71:[function(require,module,exports){
"use strict";

var jungle = require(72);
module.exports = {
  tree: jungle,
  node: function node(i) {
    return jungle([i]).childNodes[0];
  }
};

},{"72":72}],72:[function(require,module,exports){
"use strict";

/**
 * zenjungle - HTML via JSON with elements of Zen Coding
 *
 * https://github.com/radmen/zenjungle
 * Copyright (c) 2012 Radoslaw Mejer <radmen@gmail.com>
 */

var zenjungle = function () {
  // helpers
  var is_object = function is_object(object) {
      return !!object && '[object Object]' == Object.prototype.toString.call(object) && !object.nodeType;
    },
    is_array = function is_array(object) {
      return '[object Array]' == Object.prototype.toString.call(object);
    },
    each = function each(object, callback) {
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
    merge = function merge() {
      var merged = {};
      each(arguments, function (arg) {
        each(arg, function (value, key) {
          merged[key] = value;
        });
      });
      return merged;
    };

  // converts some patterns to properties
  var zen = function zen(string) {
    var replace = {
        '\\[([a-z\\-]+)=([^\\]]+)\\]': function aZ(match) {
          var prop = {};
          prop[match[1]] = match[2].replace(/^["']/, '').replace(/["']$/, '');
          return prop;
        },
        '#([a-zA-Z][a-zA-Z0-9\\-_]*)': function aZAZAZAZ09_(match) {
          return {
            'id': match[1]
          };
        },
        '(\\.[a-zA-Z][a-zA-Z0-9\\-_]*)+': function aZAZAZAZ09_(match) {
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
  };
  var _monkeys = function monkeys(what, where) {
    where = where || document.createDocumentFragment();
    each(what, function (element) {
      var zenned, props, new_el;
      if (is_array(element)) {
        if ('string' === typeof element[0]) {
          zenned = zen(element.shift());
          props = is_object(element[0]) ? element.shift() : {};
          new_el = document.createElement(zenned[0]);
          each(merge(zenned[1], props), function (value, key) {
            new_el.setAttribute(key, value);
          });
          where.appendChild(new_el);
          _monkeys(element, new_el);
        } else {
          _monkeys(element, where);
        }
      } else if (element.nodeType) {
        where.appendChild(element);
      } else if ('string' === typeof element || 'number' === typeof element) {
        where.appendChild(document.createTextNode(element));
      }
    });
    return where;
  };
  return _monkeys;
}();
if (typeof module !== "undefined") {
  module.exports = zenjungle;
}

},{}]},{},[30])(30)
});
