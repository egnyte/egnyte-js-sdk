module.exports = {
    name: "customizeRequest",
    execute(opts, input){
        return Object.assign(opts, input.customizeRequest)
    }
}
