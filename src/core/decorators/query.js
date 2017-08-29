module.exports = {
    name: "queryParams",
    execute(opts, input){
        Object.assign(opts.params, input.queryParams)
        return opts
    }
}
