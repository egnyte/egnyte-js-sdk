beforeEach(function () {
    jasmine.addMatchers({
        toAutoFail: function () {
            return {
                compare: function (nothing, error) {
                    return {
                        pass: false,
                        message: (error.statusCode ? "[ HTTP" + error.statusCode+" ]" : "[ JS ]") + " " + error
                    };
                }
            };
        }
    });

});