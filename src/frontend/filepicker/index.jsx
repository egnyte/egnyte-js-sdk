// accept input and pass to the app
import filePicker from "./app.jsx"

export default function init(core) {
    core.filePicker = (containerNode, options) => {
        // TODO: options validation and authentication mechanisms to be added here
        filePicker(containerNode, options, core)
    }

}
