var helpers = require("../reusables/helpers");


var fileext = /.*\.([a-z0-9]*)$/i;

function getExt(name) {
    if (fileext.test(name)) {
        return name.replace(fileext, "$1");
    } else {
        return "";
    }
}


//Item model
function Item(data, parent) {
    this.data = data;
    if (!this.data.is_folder) {
        this.ext = getExt(data.name);
    } else {
        this.ext = "";
    }
    this.isSelectable = ((parent.opts.select.folder && data.is_folder) || (parent.opts.select.file && !data.is_folder));
    this.parent = parent;
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

    // Waiting for requirements
    //    else {
    //        //when folders arent selectable, default to opening too
    //        if (this.data.is_folder) {
    //            this.parent.fetch(this.data.path);
    //        }
    //    }
};

//Collection
function Model(API, opts) {
    this.opts = opts;
    this.API = API;
}


Model.prototype.onloading = helpers.noop;
Model.prototype.onupdate = helpers.noop;
Model.prototype.onerror = helpers.noop;

Model.prototype.set = function (m) {
    var self = this;
    this.path = m.path;
    this.items = [];
    helpers.each(m.folders, function (f) {
        self.items.push(new Item(f, self));
    });
    //ignore files if they're not selectable
    if (this.opts.select.file) {
        helpers.each(m.files, function (f) {
            self.items.push(new Item(f, self));
        });
    }

    this.isEmpty = (this.items.length === 0);
    this.isMultiselectable = (this.opts.select.multiple);

    this.onupdate();
    this.onchange();
};

Model.prototype.fetch = function (path) {
    var self = this;
    if (path) {
        this.path = path;
    }
    self.onloading();
    self.API.storage.get(this.path).then(function (m) {
        self.set(m);
    }).error(function (e) {
        self.onerror(e.error || e);
    });
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

module.exports = Model;