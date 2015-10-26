var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");

var ENDPOINTS_search = require("../enum/endpoints").search;


function Search(requestEngine) {
    this.requestEngine = requestEngine;
    this.count = 10;
    decorators.install(this);
}


var searchProto = {};
searchProto.itemsPerPage = function(count) {
    this.count = count || 10;
}
searchProto.query = function(query, page) {
    var self = this;
    var requestEngine = self.requestEngine;
    var decorate = self.getDecorator();
    return promises(true).then(function() {
        var qs = [
            "query=" + encodeURIComponent(query),
            "offset=" + (~~(page) * self.count),
            "count=" + self.count,
        ];
        var querystring = "?" + qs.join("&");
        var opts = {
            method: "GET",
            url: requestEngine.getEndpoint() + ENDPOINTS_search + querystring
        };
        return requestEngine.promiseRequest(decorate(opts));
    }).then(function(result) { //result.response result.body
        return result.body;
    });

};

searchProto.getResults = function(query) {
    var self = this;
    return self.query(query)
        .then(function(body) {
            return {
                page: function(number) {
                    return self.query(query, number)
                        .then(function(body) {
                            return body.results;
                        });
                },
                totalPages: Math.round(body.total_count/self.count),
                sample: body.results,
                totalCount: body.total_count
            }
        });
};


Search.prototype = searchProto;

module.exports = Search;
