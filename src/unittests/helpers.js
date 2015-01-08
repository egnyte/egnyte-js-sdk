var helpers = require("../lib/reusables/helpers");

exports.containsWorksOnArrays = function (test) {
    test.expect(3);
    test.equal(helpers.contains([1,2,3,4],3), true);
    test.equal(helpers.contains([1,2,3,4],33), false);
    test.equal(helpers.contains([1,2,3,4],"3"), false);
   
    test.done();
};

