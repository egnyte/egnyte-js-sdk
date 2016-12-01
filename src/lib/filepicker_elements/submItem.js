var exts = require("./exts");

//Item model
function Item(data, parent) {
    this.data = data;
    if (!this.data.is_folder) {
        this.ext = exts.getExt(data.name).substr(0, 3);
        this.mime = exts.getMime(data.name);
    } else {
        this.ext = "";
        this.mime = "folder";
    }
    this.isSelectable = (!data.disabled) && ((parent.opts.select.folder && data.is_folder) || (parent.opts.select.file && !data.is_folder)) && !parent.forbidSelection;
    this.parent = parent;
    this.isCurrent = false;
}

Item.prototype.defaultAction = function() {
    if (this.data.is_folder) {
        this.parent.fetch(this.data.path);
    } else {
        this.toggleSelect();
    }
};

Item.prototype.toggleSelect = function() {
    if (this.isSelectable) {
        if (!this.parent.opts.select.multiple) {
            this.parent.deselect();
        }
        this.selected = !this.selected;
        this.onchange();
        this.parent.onchange();
    }
};

module.exports = Item;
