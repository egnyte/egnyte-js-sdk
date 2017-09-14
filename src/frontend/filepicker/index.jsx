// accept input and pass to the app
import filePicker from "./app.jsx"

export function init(core) {
    core.filePicker = (containerNode, options) => {
        options.perPage = options.perPage || 100 

        // TODO: options validation and authentication mechanisms to be added here
        filePicker(containerNode, options, core)
    }

}
