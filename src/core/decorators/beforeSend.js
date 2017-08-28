module.exports = {
    name: "beforeSend",
    execute(opts, input){
        return input.beforeSend(opts, input)
    }
}
