"use strict";

//template engine based upon JsonML
var dom = require("../reusables/dom");
var helpers = require("../reusables/helpers");
var jungle = require("../../vendor/zenjungle");

require("./view.less");

var moduleClass = "eg-filepicker";



function View(opts) {
    var self = this;
    this.el = opts.el;
    this.els = {};

    this.handlers = helpers.extend({
        selection: helpers.noop,
        close: helpers.noop
    }, opts.handlers);
    this.selection = helpers.extend(this.selection, opts.selection);
    this.model = opts.model;
    //bind to model changes
    this.model.onloading = function () {
        self.loading();
    }
    this.model.onupdate = function () {
        self.render();
        if (self.handlers.ready) {
            var runReady = self.handlers.ready;
            self.handlers.ready = null;
            setTimeout(runReady, 0);
        }
    }
    this.model.onerror = function () {
        //handle error messaging
    }

    //create reusable view elements
    var back = jungle([["span",
        {
            "class": "eg-filepicker-back eg-btn"
        }, "<"]]);
    this.els.back = back.childNodes[0];
    var close = jungle([["span",
        {
            "class": "eg-filepicker-close eg-btn"
        }, "x"]]);
    this.els.close = close.childNodes[0];

    var ok = jungle([["span",
        {
            "class": "eg-filepicker-ok eg-btn"
        }, "ok"]]);
    this.els.ok = ok.childNodes[0];

    var that = this;

    dom.addListener(this.els.back, "click", function (e) {
        that.model.goUp();
    });
    dom.addListener(this.els.close, "click", function (e) {
        that.handlers.close.call(that, e);
    });
    dom.addListener(this.els.ok, "click", function (e) {
        that.handlers.selection.call(that, that.model.getSelected());
    });

}

View.prototype.render = function () {
    var self = this;

    this.els.list = document.createElement("ul");

    var layoutFragm = jungle([["div.eg-filepicker",
        this.els.close,
        ["div.eg-filepicker-bar",
            this.els.back,
            ["span.eg-filepicker-path", this.model.path]
        ],
        this.els.list,
        ["div.eg-filepicker-bar",
            this.els.ok
        ]
    ]]);
    

    this.el.innerHTML = "";
    this.el.appendChild(layoutFragm);

    helpers.each(this.model.items, function (item) {
        self.renderItem(item);
    });


}

View.prototype.renderItem = function (itemModel) {
    var self = this;

    var itemName = jungle([["span.eg-filepicker-name", itemModel.data.name]]).childNodes[0];
    var itemCheckbox = jungle([["input[type=checkbox]" + (itemModel.isSelectable ? "" : ".eg-not")]]).childNodes[0];
    itemCheckbox.checked = itemModel.selected;

    itemModel.onchange = function () {
        itemCheckbox.checked = itemModel.selected;
    };

    var itemFragm = jungle([["li.eg-filepicker-item",
        itemCheckbox,
        ["span.eg-filepicker-ico-" + ((itemModel.data.is_folder) ? "folder" : "file"),
            {
                "data-ext": itemModel.ext
            },
            ["span", itemModel.ext]
        ],
        itemName
    ]]);
    var itemNode = itemFragm.childNodes[0];

    dom.addListener(itemName, "click", function (e) {
        e.stopPropagation();
        itemModel.defaultAction();
        return false;
    });

    dom.addListener(itemNode, "click", function (e) {
        itemModel.toggleSelect();
    });

    this.els.list.appendChild(itemFragm);
}



View.prototype.loading = function () {
    var that = this;
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-spinner", ["div"], "loading"]]));
    }
}

View.prototype.destroy = function () {
    this.el.innerHTML = "";
    this.el = null;
    this.els = null;
    this.model = null;
    this.handlers = null;
}





module.exports = View;