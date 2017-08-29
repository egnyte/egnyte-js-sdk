module.exports = function(config) {
    config.set({
        basePath: "",

        browsers: ["Chrome"],

        frameworks: ["mocha"],

        reporters: ["mocha"],

        singleRun: true,

        files: [
            "node_modules/chai/chai.js",
            "node_modules/dirty-chai/lib/dirty-chai.js",
            "test/conf/apiaccess.js",
            "dist/egnyte.js",
            "test/init.browser.js",
            "test/api/*.js"
        ],

        logLevel: config.LOG_INFO,

        colors: true,

        client: {
            mocha: {
                ui: "bdd",
                timeout: 10000
            }
        }
    });
};