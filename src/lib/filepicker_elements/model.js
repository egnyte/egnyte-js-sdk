var helpers = require("../reusables/helpers");
var exts = require("./exts");




//Item model
function Item(data, parent) {
    this.data = data;
    if (!this.data.is_folder) {
        this.ext = exts.getExt(data.name).substr(0, 3);
        this.mime = exts.getMime(data.name);
    } else {
        this.ext = "";
        this.mime = "unknown"
    }
    this.isSelectable = ((parent.opts.select.folder && data.is_folder) || (parent.opts.select.file && !data.is_folder)) && !parent.forbidSelection;
    this.parent = parent;
    this.isCurrent = false;
}

Item.prototype.defaultAction = function () {
    if (this.data.is_folder) {
        this.parent.fetch(this.data.path);
    } else {
        this.toggleSelect();
    }
};

Item.prototype.toggleSelect = function () {
    if (this.isSelectable) {
        if (!this.parent.opts.select.multiple) {
            this.parent.deselect();
        }
        this.selected = !this.selected;
        this.onchange();
        this.parent.onchange();
    }
};

//Collection
function Model(API, opts) {
    this.opts = opts;
    this.API = API;
    this.page = 1;
    this.pageSize = 200;

    if (opts.filterExtensions) {
        this.fileFilter = exts.getExtensionFilter(opts.filterExtensions);
    }
    // no defaults needed
    //    this.rawItems = [];
    //    this.hasPages = false;
}


Model.prototype.onloading = helpers.noop;
Model.prototype.onupdate = helpers.noop;
Model.prototype.onerror = helpers.noop;

Model.prototype._set = function (m) {
    var self = this;
    this.page = 1;
    this.rawItems = [];
    if (m) {
        this.path = m.path;

        helpers.each(m.folders, function (f) {
            self.rawItems.push(f);
        });
        //ignore files if they're not selectable
        if (this.opts.select.file) {
            helpers.each(m.files, function (f) {
                if (!self.fileFilter || self.fileFilter(f)) {
                    self.rawItems.push(f);
                }
            });
        }
    }
    //force disabled selection on root or other path
    this.forbidSelection = helpers.contains(this.opts.select.forbidden, this.path);
    this.totalPages = ~~(this.rawItems.length / this.pageSize) + 1;
    this.isMultiselectable = (this.opts.select.multiple);
    this._buildItems();

};

Model.prototype._buildItems = function () {
    var self = this;
    this.currentItem = -1;
    this.items = [];
    this.hasPages = (this.rawItems.length > this.pageSize);
    if (this.rawItems.length === 0) {
        this.isEmpty = true;
    } else {
        this.isEmpty = false;
        var pageArr = this.rawItems.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
        helpers.each(pageArr, function (item) {
            self.items.push(new Item(item, self));
        });
    }

    this.onupdate();
    this.onchange();
}

Model.prototype.fetch = function (path) {
    var self = this;
    if (self.processing) {
        return;
    }
    self.processing = true;
    if (path) {
        self.path = path;
    }
    self.onloading();
    self.API.storage.get(self.path).then(function (m) {
        self.processing = false;
        self._set(m);
    }).fail(function (e) {
        self.processing = false;
        self._set();
        self.onerror(e);
    });
}

Model.prototype.switchPage = function (offset) {
    var newPage = this.page + offset;
    if (newPage <= this.totalPages && newPage > 0) {
        this.page = newPage;
        this._buildItems();
    }
}


Model.prototype.goUp = function () {
    var path = this.path.replace(/\/[^\/]+\/?$/i, "") || "/";

    if (path !== this.path) {
        this.fetch(path);
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