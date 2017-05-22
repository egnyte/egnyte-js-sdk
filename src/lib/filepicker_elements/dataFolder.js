var helpers = require("../reusables/helpers");

module.exports = function (opts, model) {
    var page = 1;
    var totalPages = 1;
    var rawItems;
    var rawItemSelf;
    var currentPath;


    function fetchImplementation(path) {
        if (path) {
            currentPath = path;
        }
        return opts.API.storage.path(currentPath).get().then(function (m) {
            return setData(m);
        });
    }

    function canJump(offset) {
        var newPage = page + offset;
        return (newPage <= totalPages && newPage > 0)
    }

    function switchPage(offset) {
        if (canJump(offset)) {
            page += offset;
        }
        return opts.API.manual.promise(buildDataObj());
    }

    function buildDataObj() {
        var pageArr = rawItems.slice((page - 1) * opts.pageSize, page * opts.pageSize);

        return {
            canJump: canJump,
            switchPage: switchPage,
            page: page,
            totalPages: totalPages,
            items: pageArr,
            itemSelf: rawItemSelf
        };
    }

    function setData(m) {
        page = 1;
        rawItems = [];
        rawItemSelf = null;
        if (m) {
            currentPath = m.path;

            helpers.each(m.folders, function (f) {
                rawItems.push(f);
            });
            //ignore files if they're not selectable
            if (opts.filesOn) {
                helpers.each(m.files, function (f) {
                    if (!opts.fileFilter || opts.fileFilter(f)) {
                        rawItems.push(f);
                    }
                });
            }
            rawItemSelf = m
            delete rawItemSelf.files
            delete rawItemSelf.folders
        }

        totalPages = ~~(rawItems.length / opts.pageSize) + 1;

        return buildDataObj();


    }

    model.fetch = function (path) {
        var self = this;
        if (!self.processing) {
            self.processing = true;
            if (path) {
                self.path = path;
            }
            this.viewState.searchOn=false;
            self.onloading();
            fetchImplementation(self.path).then(function (data) {
                self._itemsUpdated(data)
                model.opts.handlers.navigation({
                    path: model.path,
                    folder_id: model.itemSelf.folder_id,
                    forbidSelection: model.forbidSelection
                });
            }).fail(function (e) {
                self._itemsUpdated()
                self.onerror(e);
            });
        }
    }


    model.goUp = function () {
        var path = this.path.replace(/\/[^\/]+\/?$/i, "") || "/";

        if (path !== this.path) {
            this.fetch(path);
        }
    }





}
