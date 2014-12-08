var slim = require("./slim");
var filepicker = require("./lib/filepicker_elements/index")
var prompt = require("./lib/prompt/index")
var authPrompt = require("./lib/api_elements/authPrompt")

slim.plugin("filePicker", function (root, resources) {
    root.filePicker = filepicker(resources.API);
});
slim.plugin("authPrompt", authPrompt);
slim.plugin("prompt", function (root, resources) {
    root.prompt = prompt;
});

module.exports = slim;