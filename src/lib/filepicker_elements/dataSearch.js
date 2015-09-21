var helpers = require("../reusables/helpers");

module.exports = function (opts, model) {
    var page = 1;
    var totalPages = 1;
    var rawItems;
    var currentPath;



    model.search = function (query) {
        var self = this;
        if (!self.processing) {
            self.processing = true;
            self.onloading();
            searchImplementation(query).then(function (data) {
                self._itemsUpdated(data)
            }).fail(function (e) {
                self._itemsUpdated()
                self.onerror(e);
            });
        }
    }


}
