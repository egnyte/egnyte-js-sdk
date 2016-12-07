var helpers = require("../reusables/helpers");
var exts = require("./exts");
var Item = require("./submItem");
var folderFetchProvider = require("./dataFolder");
var searchProvider = require("./dataSearch");

//Collection
function Model(API, opts) {
    this.opts = opts;
    this.page = 1;
    this.isMultiselectable = (this.opts.select.multiple);
    this.viewState={}

    var dataProviderSettings = {
        API: API,
        pageSize: 100,
        filesOn: opts.select.filesRemainVisible || opts.select.file,
        fileFilter: opts.filterExtensions && exts.getExtensionFilter(opts.filterExtensions)
    };
    //creates this.fetch and this.goUp
    folderFetchProvider(dataProviderSettings, this);
    //creates this.search
    searchProvider(dataProviderSettings, this);

}


Model.prototype.onloading = helpers.noop;
Model.prototype.onupdate = helpers.noop;
Model.prototype.onerror = helpers.noop;



Model.prototype._itemsUpdated = function (data) {
    var self = this;
    self.processing = false;
    self.dataSrc = data;
    this.currentItem = -1;
    var pathArray = helpers.normalizePath(this.path).split("/");
    pathArray.pop();
    this.parentForbidsSelection = pathArray.length > 0 ? helpers.contains(this.opts.select.forbidden, pathArray.join("/") || "/") : false;
    if (data) {
        //force disabled selection on root or other path
        this.forbidSelection = helpers.contains(this.opts.select.forbidden, helpers.normalizePath(this.path));
        this.items = [];
        helpers.each(data.items, function (item) {
            self.items.push(new Item(item, self));
        });
        this.isEmpty = data.items.length === 0;
        this.hasPages = data.totalPages > 1;
        this.totalPages = data.totalPages;
        this.page = data.page;
        this.itemSelf = data.itemSelf;
    } else {
        this.items = [];
        this.isEmpty = true;
        this.hasPages = false;
    }

    this.onupdate();
    this.onchange();

}

Model.prototype.switchPage = function (offset) {
    var self = this;
    if (!self.processing && self.dataSrc.canJump(offset)) {
        self.processing = true;
        self.dataSrc.switchPage(offset).then(function (data) {
            self._itemsUpdated(data)
        }, function (e) {
            self._itemsUpdated()
            self.onerror(e);
        }).fail(self.onerror);
    }
}



Model.prototype.getSelected = function () {
    var selected = [];
    helpers.each(this.items, function (item) {
        if (item.selected) {
            selected.push(item.data);
        }
    });
    return selected;
}

Model.prototype.deselect = function () {
    helpers.each(this.items, function (item) {
        if (item.selected) {
            item.selected = false;
            item.onchange();
        }
    });
}
Model.prototype.setAllSelection = function (selected) {
    helpers.each(this.items, function (item) {
        item.selected = selected;
        item.onchange();
    });
    this.onchange();
}

Model.prototype.mvCurrent = function (offset) {
    if (this.currentItem + offset < this.items.length && this.currentItem + offset >= 0) {
        if (this.items[this.currentItem]) {
            this.items[this.currentItem].isCurrent = false;
            this.items[this.currentItem].onchange();
        }
        this.currentItem += offset;
        this.items[this.currentItem].isCurrent = true;
        this.items[this.currentItem].onchange();
    }
}

Model.prototype.getCurrent = function () {
    return this.items[this.currentItem];
}

module.exports = Model;
