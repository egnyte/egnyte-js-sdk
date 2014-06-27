var errorify = require("../lib/api_elements/errorify");

exports.errorMessageJSONFormat = function (test) {
    test.expect(4);
    test.equal(errorify({
        error: new Error('{"message":"foo"}'),
        response: {
            statusCode: 403
        }
    }).message, "foo");
    test.equal(errorify({
        error: new Error('{"msg":"foo"}'),
        response: {
            statusCode: 403
        }
    }).message, "foo");
    test.equal(errorify({
        error: new Error('{"deeper":{"distraction":[1,2,3],"msg":"foo"}}'),
        response: {
            statusCode: 403
        }
    }).message, "foo");
    test.equal(errorify({
        error: new Error('{"errorMessage":"foo"}'),
        response: {
            statusCode: 403
        }
    }).message, "foo");
    test.done();
};


exports.errorMessageHTML = function (test) {
    test.expect(4);
    test.equal(errorify({
        error: new Error('<h1>foo</h1>'),
        response: {
            statusCode: 403
        }
    }).message, "foo");
    test.equal(errorify({
        error: new Error('<html><head>etcetera'),
        response: {
            statusCode: 403
        }
    }).message, "<html><head>etcetera");
    test.equal(errorify({
        error: new Error('<html><head>etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera etcetera '),
        response: {
            statusCode: 404
        }
    }).message, "Not found");
    test.equal(errorify({
        error: new Error('Normal Error')
    }).message, "Normal Error");
    test.done();
};

