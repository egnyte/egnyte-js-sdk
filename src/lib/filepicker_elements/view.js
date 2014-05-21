//template engine based upon JsonML
var dom = require("../reusables/dom");
var helpers = require("../reusables/helpers");
var jungle = require("../../vendor/zenjungle");

require("./view.less");

var moduleClass = "eg-filepicker";

var fileext = /.*\.([a-z]*)$/i;

function getExt(name) {
    if (fileext.test(name)) {
        return name.replace(fileext, "$1");
    } else {
        return "";
    }
}

function View(opts) {
    this.el = opts.el;

    this.handlers = helpers.extend(this.handlers, opts.handlers);
    this.model = opts.model;

    var back = jungle([["span",
        {
            class: "eg-filepicker-back eg-btn"
        }, "<"]]);
    this.els.back = back.children[0];
    var close = jungle([["span",
        {
            class: "eg-filepicker-close eg-btn"
        }, "x"]]);
    this.els.close = close.children[0];

    var that = this;

    dom.addListener(this.els.back, "click", function (e) {
        that.handlers.back.call(that, e);
    });
    dom.addListener(this.els.close, "click", function (e) {
        that.handlers.close.call(that, e);
    });

}

var noop = function () {};

View.prototype.els = {};
View.prototype.model = {};
View.prototype.handlers = {
    item: noop,
    back: noop,
    folder: noop,
    file: noop,
    close: noop
};

View.prototype.renderItem = function (itemModel, handler) {
    var that = this;
    var ext = (itemModel.is_folder) ? "" : getExt(itemModel.name);
    var itemFragm = jungle([["li.eg-filepicker-item",
        ["span.eg-filepicker-ico-" + ((itemModel.is_folder) ? "folder" : "file"),
            {
                "data-ext": ext
            },
            ["span", ext]
        ],
        ["span.eg-filepicker-name", itemModel.name]
    ]]);
    var itemNode = itemFragm.children[0];

    dom.addListener(itemNode, "click", function (e) {
        handler.call(that, itemModel, e);
    });

    this.els.list.appendChild(itemFragm);
}

View.prototype.loading = function () {
    var that = this;
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-spinner",["div"], "loading"]]));
    }
}

View.prototype.destroy = function () {
    this.el.innerHTML = "";
    this.el = null;
    this.model = null;
    this.handlers = null;
}


View.prototype.render = function (node) {
    var that = this;

    if (node) {
        this.el = node;
    }
    this.els.list = document.createElement("ul");

    var listFragm = jungle([["div.eg-filepicker",
        this.els.close,
        ["div.eg-filepicker-breadcrumb",
            this.els.back,
            ["span.eg-filepicker-path", this.model.path]
        ],
        this.els.list

    ]]);

    this.el.innerHTML = "";
    this.el.appendChild(listFragm);


    helpers.each(this.model.folders, function (folder) {
        that.renderItem(folder, that.handlers.folder)
    });

    helpers.each(this.model.files, function (file) {
        that.renderItem(file, that.handlers.file);
    });


}


module.exports = View;