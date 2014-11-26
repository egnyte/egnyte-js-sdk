var slim = require("./slim");
var filepicker = require("./lib/filepicker/byapi")

slim.plugin("filePicker", function (root, resources) {
    root.filePicker = filepicker(resources.API);
});

module.exports = slim;