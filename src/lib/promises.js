//wrapper for any promises library
var pinkySwear = require('pinkyswear');

module.exports = {
    "defer" : function(){
        var promise = pinkySwear();
        return {
            promise: promise,
            resolve: function(result){
                promise(true,[result]);
            },
            reject: function(result){
                promise(true,[result]);
            }
        }
    }
}