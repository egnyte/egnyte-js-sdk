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



var defaultCount = 20;

//options.start
//options.interval >2000
//options.emit
//options.current
//returns {stop:function}
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
    listen: function (options) {
        var self = this;
        var requestEngine = this.requestEngine;
        var decorate = this.getDecorator();

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
                //start looping!
                return every(Math.max(options.interval || 30000, 2000), function (controller) {
                    var count = options.count || defaultCount;
                    return requestEngine.promiseRequest(decorate({
                        method: "GET",
                        url: requestEngine.getEndpoint() + ENDPOINTS_events,
                        params: {
                            id: start,
                            count: count
                        }
                    })).then(function (result) {
                        if (result.body) {
                            start = result.body.latest_id;
                            helpers.each(result.body.events, function (e) {
                                setTimeout(function () {
                                    options.emit(e);
                                }, 0)
                            });
                            if (options.current) {
                                options.current(start);
                            }
                            if (result.body.events.length >= count) {
                                controller.repeat();
                            }
                        }
                        if (options.heartbeat) {
                            options.heartbeat(result);
                        }
                    });
                })

            });
    }

};

module.exports = Events;