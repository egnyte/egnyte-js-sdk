var util = require("util");

function StreamsExtendedStorage() {
    StreamsExtendedStorage.super_.apply(this, arguments);
};


module.exports = function (Storage) {

    util.inherits(StreamsExtendedStorage, Storage);

    StreamsExtendedStorage.prototype.download = function () {};
    StreamsExtendedStorage.prototype.storeFile = function () {};


    return StreamsExtendedStorage;

};