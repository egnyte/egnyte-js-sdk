const mkerr = require("./errors/mkerr")
const helpers = require("./helpers")


module.exports = {
    process(originalInput, guarantees) {
        let input = Object.assign({}, originalInput)
        if (guarantees.requires) {
            guarantees.requires.forEach(key => {
                if (input[key] === undefined) {
                    throw mkerr({
                        message: `Invalid input, ${key} field required`,
                        hint: `${key} field required`
                    })
                }
            })
        }
        if (guarantees.optional) {
            guarantees.optional.forEach(key => {
                if (key in input && input[key] === undefined) {
                    helpers.hintDeveloper(`${key} field was explicitly passed an undefined value. It's likely an accident. Avoid specifying the property at all if it's undefined.`)
                }
            })
        }
        if (guarantees.fsIdentification) {
            if (!(input.fileId || input.folderId || input.path)) {
                throw mkerr({
                    message: `Identify a file or folder. One of the fields must be specified: fileId folderId path`,
                    hint: `Identify a file or folder. One of the fields must be specified: fileId folderId path`
                })
            } else {
                input = handleFsIdentification(input)
            }
        }
        if (guarantees.permScopeIdentification) {
            if (!(input.userPerms || input.groupPerms)) {
                throw mkerr({
                    message: `Identify a user and group. One or more of the fields must be specified: userPerms groupPerms`,
                    hint: `Identify a user and group. One or more of the fields must be specified: userPerms groupPerms`
                })
            } else {
                input = handlePermScopeIdentification(input)
            }
        }
        return input
    }
}

const goodId = /^[0-9a-z\-]+$/i
function detectIncorrectId(key, id){
    if(!goodId.test(id)){
        throw mkerr({
            message: `Invalid file or folder identification, ${key} field seems to contain something else than an ID`,
            hint: `${key} field expected to match ${goodId.toString()}`
        })
    }
}

function handleFsIdentification(input){
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

function detectIncorrectPermScope (key, value) {
    if (!value || typeof value !== "object" || Object.keys(value).length === 0) {
        throw mkerr({
            message: `Invalid permission scope identification, ${key} field should be an non empty object`,
            hint: `Invalid permission scope identification, ${key} field should be an non empty object`
        })
    }
}

function handlePermScopeIdentification (input) {
    input.permScope = {};
    if(input.userPerms){
        detectIncorrectPermScope("userPerms", input.userPerms);
        input.permScope.userPerms = input.userPerms

    }
    if(input.groupPerms){
        detectIncorrectPermScope("groupPerms", input.groupPerms);
        input.permScope.groupPerms = input.groupPerms
    }
    return input;
}