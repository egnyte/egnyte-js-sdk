var promises = require("../promises-native");
var helpers = require("../reusables/helpers");
var dom = require("../reusables/dom");
var messages = require("../reusables/messages");
var errorify = require("./errorify");
var axios = require("axios");
var PassThrough = require("stream").PassThrough;

// Configuration for stream endpoint detection
// These URL patterns indicate streaming endpoints
var STREAM_ENDPOINT_PATTERNS = ["/v1/fs-content", "/v1/fs-content-chunked"];

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
  callback(
    null,
    {
      statusCode: response.status,
      statusMessage: response.statusText,
      headers: response.headers,
      body: response.data,
      request: response.request,
    },
    response.data
  );
}

// Helper function to handle axios errors consistently
function handleAxiosError(error, callback) {
  if (error.response) {
    // Server responded with error status
    callback(
      null,
      {
        statusCode: error.response.status,
        statusMessage: error.response.statusText,
        headers: error.response.headers,
        body: error.response.data,
        request: error.response.request,
      },
      error.response.data
    );
  } else if (error.request) {
    // Request was made but no response received
    callback(error, { statusCode: 0, statusMessage: error.message }, null);
  } else {
    // Error in request setup
    callback(error, { statusCode: 0, statusMessage: error.message }, null);
  }
}

// Axios wrapper to provide request-like interface
// Compatible with axios 1.x latest features
function axiosWrapper(options, callback) {
  if (typeof options === "string") {
    options = { url: options };
  }

  // Support both 'url' and 'uri' for compatibility with request library
  var url = options.url || options.uri;
  var baseURL = options.baseURL;

  // Axios requires absolute URLs in Node.js
  // If URL starts with /, it's relative - extract baseURL from it if it looks like a full path
  if (typeof url === "string" && url.charAt(0) === "/" && !baseURL) {
    // Check if this is a mock URL pattern like /mock/pubapi/...
    // In that case, use a dummy base URL
    if (url.indexOf("/mock/") === 0 || url.indexOf("/pubapi/") === 0) {
      baseURL = "http://localhost";
    }
  }

  var axiosConfig = {
    url: url,
    baseURL: baseURL,
    method: (options.method || "GET").toUpperCase(),
    headers: options.headers || {},
    params: options.qs,
    data: options.body || options.form || options.json,
    timeout: options.timeout || 0,
    maxRedirects: options.maxRedirects !== undefined ? options.maxRedirects : 5,
    validateStatus: function () {
      return true; // Don't throw on any status code - handle all responses
    },
    // Axios 1.x specific options for better compatibility
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    // Force JSON parsing for all responses
    transformResponse: [
      function (data) {
        if (typeof data === "string") {
          try {
            return JSON.parse(data);
          } catch (e) {
            return data;
          }
        }
        return data;
      },
    ],
  };

  // Set content-type for JSON
  if (options.json && !axiosConfig.headers["Content-Type"]) {
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
    var isStreamUpload =
      options.isStreamUpload ||
      ((axiosConfig.method === "POST" || axiosConfig.method === "PUT") &&
        !axiosConfig.data &&
        isStreamEndpoint(axiosConfig.url));

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
          axiosConfig.transformRequest = [
            function (data) {
              return data;
            },
          ];
        }

        axios(axiosConfig)
          .then(function (response) {
            handleAxiosSuccess(response, callback);
          })
          .catch(function (error) {
            handleAxiosError(error, callback);
          });
      });

      streamProxy.on("error", function (error) {
        callback(error, { statusCode: 0, statusMessage: error.message }, null);
      });

      // Return the PassThrough stream which acts like a writable stream
      // This allows code like stream.pipe(req) to work
      return streamProxy;
    } else {
      // Regular callback-style request (not stream upload)
      // Make the request immediately
      axios(axiosConfig)
        .then(function (response) {
          handleAxiosSuccess(response, callback);
        })
        .catch(function (error) {
          handleAxiosError(error, callback);
        });

      // Return a mock request object for compatibility
      return {
        abort: function () {},
      };
    }
  } else {
    // No callback - could be streaming downloads or promise-based requests
    // Check if this is a stream request by looking at the URL or options
    // Allow explicit override via options.isStreamRequest
    var isStreamRequest =
      options.isStreamRequest || isStreamEndpoint(axiosConfig.url);

    if (isStreamRequest) {
      // Return a readable stream that emits 'response' event
      var downloadStream = new PassThrough();

      // For downloads, we need responseType to be 'stream' in Node.js
      if (typeof window === "undefined") {
        axiosConfig.responseType = "stream";
      }

      axios(axiosConfig)
        .then(function (response) {
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
        })
        .catch(function (error) {
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

  this.requestHandler = options.httpRequest
    ? options.httpRequest
    : axiosWrapper;

  this.quota = {
    startOfTheSecond: 0,
    calls: 0,
    retrying: 0,
  };
  this.queue = [];

  this.queueHandler = helpers.bindThis(this, _rollQueue);

  auth.addRequestEngine(this);
}

var enginePrototypeMethods = {
  Promise: promises,
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

enginePrototypeMethods.sendRequest = function (
  opts,
  callback,
  forceNoAuth,
  forceNoRetry
) {
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
      opts.headers["Authorization"] =
        this.auth.type + " " + this.auth.getToken();
    }
    if (!callback) {
      return self.requestHandler(opts);
    } else {
      var timer;
      var retry = function () {
        self.sendRequest(
          originalOpts,
          self.retryHandler(callback, retry, timer, forceNoRetry)
        );
      };
      if (self.timerStart) {
        timer = self.timerStart(
          originalOpts.method,
          originalOpts.url || originalOpts.uri
        );
      }

      return self.requestHandler(
        opts,
        self.retryHandler(callback, retry, timer, forceNoRetry)
      );
    }
  } else {
    callback.call(
      this,
      new Error("Not authorized"),
      {
        statusCode: 0,
      },
      null
    );
  }
};

enginePrototypeMethods.retryHandler = function (
  callback,
  retry,
  timer,
  forceNoRetry
) {
  var self = this;
  return function (error, response, body) {
    //build an error object for http errors
    if (!error && response.statusCode >= 400 && response.statusCode < 600) {
      var errorMessage = "HTTP " + response.statusCode + " error"; // Default error message
      if (body !== null && body !== undefined) {
        if (typeof body === "object") {
          try {
            errorMessage = JSON.stringify(body);
          } catch (e) {
            // Handle circular references or non-serializable objects
            errorMessage = "HTTP " + response.statusCode + " error";
          }
        } else {
          errorMessage = String(body);
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
      masheryCode =
        typeof masheryCode === "array" ? masheryCode[0] : masheryCode;
    }

    if (
      response &&
      self.options.handleQuota &&
      response.statusCode === 403 &&
      retryAfter &&
      !forceNoRetry
    ) {
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
      if (
        response &&
        //Checking for failed auth responses
        //(ノಠ益ಠ)ノ彡┻━┻
        self.options.onInvalidToken &&
        (response.statusCode === 401 ||
          (response.statusCode === 403 &&
            masheryCode === "ERR_403_DEVELOPER_INACTIVE"))
      ) {
        self.auth.dropToken();
        self.options.onInvalidToken();
      }
      if (self.timerEnd) {
        var statusCode = (response && response.statusCode) || 0;
        self.timerEnd(timer, statusCode);
      }
      callback.call(this, error, response, body);
    }
  };
};

enginePrototypeMethods.retrieveStreamFromRequest = function (opts) {
  var defer = promises.defer();
  var self = this;
  var requestFunction = function () {
    try {
      var req = self.sendRequest(opts);
      defer.resolve(req);
    } catch (error) {
      defer.reject(
        errorify({
          error: error,
        })
      );
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

enginePrototypeMethods.promiseRequest = function (
  opts,
  requestHandler,
  forceNoAuth,
  forceNoRetry
) {
  var defer = promises.defer();
  var self = this;
  var requestFunction = function () {
    try {
      var req = self.sendRequest(
        opts,
        function (error, response, body) {
          if (error) {
            defer.reject(
              errorify({
                error: error,
                response: response,
                body: body,
              })
            );
          } else {
            defer.resolve({
              response: response,
              body: body,
            });
          }
        },
        forceNoAuth,
        forceNoRetry
      );
      requestHandler && requestHandler(req);
    } catch (error) {
      defer.reject(
        errorify({
          error: error,
        })
      );
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
