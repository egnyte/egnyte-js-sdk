var helpers = require("../reusables/helpers");

module.exports = function (opts, model) {
    var currentQuery;
    var previousQuery;
    var currentResult;
    var page;

    opts.API.search.itemsPerPage(opts.pageSize)


    function searchImplementation(query) {
        currentQuery = query;
        return opts.API.search.getResults(query).then(function (response) {
            //if no query was started in the meantime
            if (currentQuery === query) {
                currentResult = response;
                page = 0;
                return buildDataObj(response.sample);
            }
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

    model.cancelSearch = function () {
        currentQuery=null;
        previousQuery=null;
        this.processing = false;
        //hide search results by reloading current folder
        this.fetch();
    }
    model.search = function (query) {
        var self = this;
        if (previousQuery !== query) {
            self.processing = true;
            this.viewState.searchOn = true;
            self.onloading();
            previousQuery = query;
            searchImplementation(query).then(function (data) {
                if (data) {
                    self._itemsUpdated(data)
                }
            }).fail(function (e) {
                self._itemsUpdated()
                self.onerror(e);
            });
        }
    }


}
