"use strict";

//template engine based upon JsonML
var dom = require("../reusables/dom");
var helpers = require("../reusables/helpers");
var texts = require("../reusables/texts");
var jungle = require("../../vendor/jungleWrapper");
var SubvBread = require("./subvBread");
var SubvSearch = require("./subvSearch");

require("../styles/main.less");

var fontLoaded = false;

var currentGlobalKeyboadrFocus = "no";

function View(opts, txtOverride) {
    var self = this;
    this.uid = Math.random();
    currentGlobalKeyboadrFocus = this.uid;
    this.el = opts.el;
    this.evs = [];
    var myElements = this.els = {};

    if (!opts.noFont) {
        renderFont();
    }

    this.txt = texts(txtOverride);

    this.bottomBarClass = (opts.barAlign === "left") ? "" : ".eg-bar-right";

    this.handlers = helpers.extend({
        selection: helpers.noop,
        events: helpers.noop,
        close: helpers.noop,
        error: null
    }, opts.handlers);

    //action handlers
    //this.selection = helpers.extend(this.selection, opts.selection);
    this.model = opts.model;

    //bind to model events
    this.model.onloading = helpers.bindThis(self, self.renderLoading);
    this.model.onupdate = function () {
        self.handlers.events("beforeRender", self.model);
        self.render();
        self.handlers.events("render", self.model);
        if (self.handlers.ready) {
            var runReady = self.handlers.ready;
            self.handlers.ready = null;
            setTimeout(runReady, 0);
        }
    }
    this.model.onerror = helpers.bindThis(this, this.errorHandler);
    self.kbNav_up = helpers.bindThis(self, self.kbNav_up);
    self.kbNav_down = helpers.bindThis(self, self.kbNav_down);
    self.kbNav_select = helpers.bindThis(self, self.kbNav_select);
    self.kbNav_explore = helpers.bindThis(self, self.kbNav_explore);
    self.model.goUp = helpers.bindThis(self.model, self.model.goUp);
    self.confirmSelection = helpers.bindThis(self, self.confirmSelection);
    self.handlers.close = helpers.bindThis(self, self.handlers.close);

    this.model.onchange = function () {
        if (self.model.getSelected().length > 0 || (self.model.opts.select.folder && !(self.model.forbidSelection || self.model.parentForbidsSelection))) {
            self.els.ok.removeAttribute("disabled");
        } else {
            self.els.ok.setAttribute("disabled", "");
        }
    }

    //create reusable view elements
    myElements.container = jungle.node(["div.eg-in"]);
    myElements.close = jungle.node(["a.eg-picker-close.eg-btn", this.txt("Cancel")]);
    myElements.ok = jungle.node(["span.eg-picker-ok.eg-btn.eg-btn-prim[tabindex=0][role=button]", this.txt("OK")]);
    myElements.pgup = jungle.node(["span.eg-picker-pgup.eg-btn", ">"]);
    myElements.pgdown = jungle.node(["span.eg-picker-pgup.eg-btn", "<"]);


    //bind events and store references to unbind later
    this.handleClick(this.el, self.focused); //maintains focus when multiple instances exist

    this.handleClick(myElements.close, function () {
        self.handlers.close();
    });
    this.handleClick(myElements.ok, self.confirmSelection);
    this.evs.push(dom.onKeys(myElements.ok, {
        "<space>": self.confirmSelection
    }, true));

    this.handleClick(myElements.pgup, function (e) {
        self.model.switchPage(1);
    });
    this.handleClick(myElements.pgdown, function (e) {
        self.model.switchPage(-1);
    });

    if (opts.keys !== false) {
        var keybinding = helpers.extend({
            "up": "<up>",
            "down": "<down>",
            "select": "<space>",
            "explore": "<right>",
            "back": "<left>",
            "confirm": "none",
            "close": "<escape>"
        }, opts.keys);
        var keys = {};
        keys[keybinding["up"]] = self.kbNav_up;
        keys[keybinding["down"]] = self.kbNav_down;
        keys[keybinding["select"]] = self.kbNav_select;
        keys[keybinding["explore"]] = self.kbNav_explore;
        keys[keybinding["back"]] = self.model.goUp;
        keys[keybinding["confirm"]] = self.confirmSelection;
        keys[keybinding["close"]] = self.handlers.close;

        document.activeElement && document.activeElement.blur && document.activeElement.blur();
        this.evs.push(dom.onKeys(document, keys, helpers.bindThis(self, self.hasFocus)));
    }

    //initialize subviews
    self.subviews = {
        breadcrumb: new SubvBread(this),
        search: new SubvSearch(this)
    }

    this.buildLayout();
}

var viewPrototypeMethods = {};

viewPrototypeMethods.destroy = function () {
    helpers.each(this.evs, function (ev) {
        ev.destroy();
    });
    this.evs = null;
    this.el.innerHTML = "";
    this.el = null;
    this.els = null;
    this.model = null;
    this.handlers = null;
}

viewPrototypeMethods.handleClick = function (el, method) {
    this.evs.push(dom.addListener(el, "click", helpers.bindThis(this, method)));
}

viewPrototypeMethods.errorHandler = function (e) {
    if (this.handlers.error) {
        var message = this.handlers.error(e);
        if (typeof message === "string") {
            this.renderProblem("*", message);
            return;
        } else {
            if (message === false) {
                return;
            }
        }
    }
    this.renderProblem((e.RATE) ? "R" : e.statusCode, e.message);
}


//=================================================================
// rendering
//=================================================================

//all this mess is because IE8 dies on @include in css
function renderFont() {
    if (!fontLoaded) {
        (document.getElementsByTagName("head")[0]).appendChild(jungle.tree([
            ["link", {
                href: "https://fonts.googleapis.com/css?family=Open+Sans:400,600",
                type: "text/css",
                rel: "stylesheet"
            }]
        ]));
        fontLoaded = true;
    }
}

viewPrototypeMethods.buildLayout = function () {
    var self = this;
    var myElements = this.els;

    var search = self.subviews.search.getTree();

    var layoutFragm = jungle.tree([
        ["div.eg-theme.eg-picker.eg-widget", search,
            myElements.container
        ]
    ]);

    this.el.innerHTML = "";
    this.el.appendChild(layoutFragm);

}

viewPrototypeMethods.render = function () {
    var self = this;
    var myElements = this.els;

    myElements.list = document.createElement("ul");

    var topbar = self.subviews.breadcrumb.getTree();

    var layoutFragm = jungle.tree([

        topbar,
        myElements.list, ["div.eg-bar" + this.bottomBarClass, ["a.eg-brand", {
                title: "egnyte.com"
            }],
            myElements.ok,
            myElements.close, ["div.eg-picker-pager" + (this.model.hasPages ? "" : ".eg-not"),
                myElements.pgdown, ["span", this.model.page + "/" + this.model.totalPages],
                myElements.pgup
            ]
        ]

    ]);

    myElements.container.innerHTML = "";
    myElements.container.appendChild(layoutFragm);
    //couldn't CSS it. blame old browsers
    myElements.list.style.height = (this.el.offsetHeight - 2 * topbar.offsetHeight) + "px";

    self.subviews.breadcrumb.render();

    if (this.model.isEmpty) {
        this.renderEmpty();
    } else {
        helpers.each(this.model.items, function (item) {
            self.renderItem(item);
        });
    }


}


viewPrototypeMethods.renderItem = function (itemModel) {
    var self = this;

    var itemName = jungle.node(["a.eg-picker-name" + (itemModel.data.is_folder ? ".eg-folder" : ".eg-file"), {
            "title": itemModel.data.name,
        },
        ["span.eg-ico.eg-mime-" + itemModel.mime, {
                "data-ext": itemModel.ext
            },
            ["span", itemModel.ext]
        ], itemModel.data.name
    ]);

    var checkboxSetup = "input[type=checkbox]";
    if (!itemModel.isSelectable) {
        checkboxSetup += (itemModel.data.is_folder ? ".eg-not" : "[disabled=disabled][title=" +
            this.txt("This file cannot be selected") +
            "]");
    }

    var itemCheckbox = jungle.node([checkboxSetup]);
    itemCheckbox.checked = itemModel.selected;

    var itemNode = jungle.node(["li.eg-picker-item" +
            (itemModel.isSelectable?"":".eg-disabled") +
            (itemModel.selected?".eg-selected":""),
        (self.model.opts.select.multiple === false)? [] : itemCheckbox,
        itemName
    ]);

    dom.addListener(itemName, "click", function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        itemModel.defaultAction();
        return false;
    });

    dom.addListener(itemNode, "click", function () {
        itemModel.toggleSelect();
    });

    itemModel.onchange = function () {
        self.handlers.events("itemChange", itemModel);
        itemCheckbox.checked = itemModel.selected;
        itemNode.setAttribute("class", "eg-picker-item" +
            (itemModel.selected?" eg-selected":"") +
            (itemModel.isSelectable?"":" eg-disabled")
        );
        itemNode.setAttribute("aria-selected", itemModel.isCurrent);
        if (itemModel.isCurrent) {
            try { //IE8 dies on this randomly :/
                self.els.list.scrollTop = itemNode.offsetTop - self.els.list.offsetHeight
            } catch (e) {}
            //itemNode.scrollIntoView(false);
        }
    };

    this.els.list.appendChild(itemNode);
}




viewPrototypeMethods.renderLoading = function () {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle.tree([
            ["div.eg-placeholder", ["div.eg-spinner"], this.txt("Loading")]
        ]));
    }
}


var msgs = require("./errormsg.js");

viewPrototypeMethods.renderProblem = function (code, message) {
    message = msgs["" + code] || msgs[~(code / 100) + "XX"] || message || msgs["?"];
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle.tree([
            ["div.eg-placeholder", ["div.eg-picker-error"], message]
        ]));
    } else {
        this.handlers.close({
            message: message
        });
    }
}
viewPrototypeMethods.renderEmpty = function () {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        if (this.model.viewState.searchOn) {
            this.els.list.appendChild(jungle.tree([
                ["div.eg-search-no", ["p", this.txt("No search results found")]]
            ]));
        } else {

            this.els.list.appendChild(jungle.tree([
                ["div.eg-placeholder.eg-folder", ["div.eg-ico"], this.txt("This folder is empty")]
            ]));
        }
    }
}

//=================================================================
// focus
//=================================================================

viewPrototypeMethods.hasFocus = function () {
    return currentGlobalKeyboadrFocus === this.uid;
}
viewPrototypeMethods.focused = function () {
    currentGlobalKeyboadrFocus = this.uid;
}

//=================================================================
// navigation
//=================================================================

viewPrototypeMethods.goUp = function () {
    this.model.goUp();
}
viewPrototypeMethods.confirmSelection = function () {
    var selected = this.model.getSelected();
    console.log();
    if (selected && selected.length) {
        this.handlers.selection.call(this, this.model.getSelected());
    } else if (this.model.opts.select.folder && !(this.model.forbidSelection || this.model.parentForbidsSelection)) {
        this.handlers.selection.call(this, [this.model.itemSelf])
    }
}

viewPrototypeMethods.kbNav_up = function () {
    this.model.mvCurrent(-1);
}

viewPrototypeMethods.kbNav_down = function () {
    this.model.mvCurrent(1);
}
viewPrototypeMethods.kbNav_select = viewPrototypeMethods.kbNav_confirm = function () {
    var item = this.model.getCurrent();
    if (item) {
        item.toggleSelect();
    }
}


viewPrototypeMethods.kbNav_explore = function () {
    var item = this.model.getCurrent();
    if (item && item.data.is_folder) {
        item.defaultAction();
    }
}

View.prototype = viewPrototypeMethods;

module.exports = View;
