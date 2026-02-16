//Native Promise wrapper to replace Q library
//Provides Q-compatible API using native Promises
//Uses conditional prototype modification with safety checks

// Add Q-compatible methods to Promise prototype only if not already present
// This is safer than the previous approach as it checks for existing methods
if (!Promise.prototype.fail) {
  Promise.prototype.fail = function (onRejected) {
    return this.catch(onRejected);
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
var Promises = function (value) {
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
    reject: reject,
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
