const helpers = require("../helpers")
module.exports = function mkerr(fields, error){
    error = error || Error(fields.message)
    fields.statusCode = fields.statusCode || 0
    helpers.hintDeveloper(fields.hint)
    return Object.assign(error, fields)
};
