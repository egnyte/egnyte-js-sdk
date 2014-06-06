jasmine.addMatchers({
    toAutoFail: function () {
        return {
            compare: function (actual, expected) {
                return {
                    pass: false,
                    message: 'this not to happen. ' + expected
                };
            }
        };
    }
});