var Egnyte = require("../src/slim.js");

exports.someTest = function (test) {
    test.expect(1);
    test.equal("foo", "foo");
    
    test.done();
};
