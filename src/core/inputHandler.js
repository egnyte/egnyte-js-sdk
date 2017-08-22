const mkerr = require("./error/mkerr")
const helpers = require("./helpers")


module.exports = {
    process(originalInput, guarantees) {
        const input = Object.assign({}, originalInput)
        if (guarantees.requires) {
            guarantees.requires.forEach(key => {
                if (typeof input[key] === undefined) {
                    throw mkerr({
                        message: `Invalid input, see console warnings for details`,
                        hint: `${key} field required`
                    })
                }
            })
        }
        if (guarantees.fsIdentification) {
            if (!(input.fileId || input.folderId || input.path)) {
                throw mkerr({
                    message: `Invalid file or folder identification, see console warnings for details`,
                    hint: `Identify a file or folder. One of the fields must be specified: fileId folderId path`
                })
            } else {
                input = handleIdentification(input)
            }
        }
        return input
    }
}

const goodId = /^[0-9a-z\-]+$/i
function detectIncorrectId(key, id){
    if(!goodId.test(id)){
        throw mkerr({
            message: `Invalid file or folder identification, see console warnings for details`,
            hint: `${key} field seems to contain something else than an ID`
        })
    }
}

function handleIdentification(input){
    if(input.fileId){
        detectIncorrectId("fileId", input.fileId)
        input.pathFromRoot = "/ids/file/"+input.fileId
        return input
    }
    if(input.folderId){
        detectIncorrectId("folderId", input.folderId)
        input.pathFromRoot = "/ids/file/"+input.folderId
        return input
    }
    if(input.path){
        input.pathFromRoot = helpers.encodePathComponents(input.path)
        return input
    }
}
