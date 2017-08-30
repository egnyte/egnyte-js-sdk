const filePickerInit = require("./filepicker/index.jsx").init
console.log(require("./filepicker/index.jsx"))
module.exports = {
    init(core) {
        filePickerInit(core)
    }
}
