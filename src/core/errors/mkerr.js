module.exports = function mkerr(fields, error){
    error = error || Error(fields.message)
    return Object.assign(error, fields)
};
