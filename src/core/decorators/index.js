const mkerr = require("../errors/mkerr")

// IMPORTANT: order matters. Make sure customize is at the end and beforeSend is last
//   so it doesn't get overwritten
const activeDecorators = [
    // put more here, not below
    require("./customize"),
    require("./beforeSend")
]

module.exports = {
    configure(input) {
        return (opts) => {
            opts = activeDecorators.reduce((optsModified, decorator) => {
                if (decorator.name in input) {
                    const updatedOpts = decorator.execute(optsModified, input)
                    if (!updatedOpts) {
                        throw mkerr({
                            message: `Decorator from ${decorator.name} didn't return the options object`
                        })
                    }
                    return updatedOpts
                } else {
                    return optsModified
                }
            }, opts)
            return opts
        }
    }
}
