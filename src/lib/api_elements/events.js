var promises = require("q");
var helpers = require('../reusables/helpers');
var every = require('../reusables/every');
var decorators = require("./decorators");

var ENDPOINTS_events = require("../enum/endpoints").events;
var ENDPOINTS_eventscursor = require("../enum/endpoints").eventscursor;

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
    getCursor: function () {
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
    getUpdate: function (options) {
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
                    }, 0)
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
    listen: function (options) {
        var self = this;

        return promises(true)
            .then(function () {
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
                }, options.error)

            });
    }

};

module.exports = Events;