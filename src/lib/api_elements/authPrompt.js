var prompt = require("../prompt/index")
var helpers = require("../reusables/helpers")

function egmitifyDomain(domain) {
    if (domain.indexOf('.') === -1) {
        domain += '.egnyte.com';
    }
    return domain;
}

module.exports = function (root, resources) {
    root.API.auth.requestTokenIframeWithPrompt = function (targetNode, callback, denied, emptyPageURL) {
        prompt(targetNode, {
            texts: {
                question: "Your egnyte domain address"
            },
            result: function (choice) {
                root.setDomain(helpers.httpsURL(egmitifyDomain(choice)));
                root.API.auth.requestTokenIframe(targetNode, callback, denied, emptyPageURL);
            }
        });
    }
};