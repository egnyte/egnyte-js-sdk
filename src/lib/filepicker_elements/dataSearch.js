var helpers = require("../reusables/helpers");

module.exports = function (opts, model) {
    var currentQuery;
    var currentResult;
    var page;

    opts.API.search.itemsPerPage(opts.pageSize)


    function searchImplementation(query) {
        currentQuery = query;
        return opts.API.search.getResults(query).then(function (response) {
            currentResult = response;
            page = 0;
            return buildDataObj(response.sample);
        });
    }

    function canJump(offset) {
        var newPage = page + offset;
        return (newPage <= currentResult.totalPages && newPage > 0)
    }

    function switchPage(offset) {
        if (canJump(offset)) {
            page += offset;
        }
        return currentResult.page(page).then(buildDataObj);
    }

    function buildDataObj(items) {
        if (opts.fileFilter) {
            helpers.each(items, function (item) {
                if (!opts.fileFilter(item)) {
                    item.disabled = true;
                }
            });
        }
        return {
            canJump: canJump,
            switchPage: switchPage,
            page: page + 1,
            totalPages: currentResult.totalPages,
            items: items
        };
    }

    model.search = function (query) {
        var self = this;
        if (!self.processing) {
            self.processing = true;
            this.viewState.searchOn=true;
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
