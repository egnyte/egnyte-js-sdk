var RequestEngine = require("../lib/api_elements/reqengine");
var AuthEngine = require("../lib/api_elements/auth");
var options = require("../defaults");



var auth = new AuthEngine(options);
var requestEngine = new RequestEngine(auth, options);


exports.handleAddrNotFoundInDNS = function (test) {
    test.expect(3);
    test.doesNotThrow(function () {
        requestEngine.promiseRequest({
            url: "https://asdfghjkjhgfdsasdfghjhgfdsqwertytewq.pl",
            method: "GET"
        }, null, !!"work without auth").fail(function (error) {
            test.equal((typeof error), "object");
            test.equal(error.statusCode, 0);
            test.done();
        });
    }, "throws", "requestEngine.promiseRequest to an address that doesn't exist")

};