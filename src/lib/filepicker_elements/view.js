"use strict";

//template engine based upon JsonML
var dom = require("../reusables/dom");
var helpers = require("../reusables/helpers");
var texts = require("../reusables/texts");
var jungle = require("../../vendor/zenjungle");

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

    this.model.onchange = function () {
        if (self.model.getSelected().length > 0) {
            self.els.ok.removeAttribute("disabled");
        } else {
            self.els.ok.setAttribute("disabled", "");
        }
    }

    //create reusable view elements
    myElements.back = jungle([["a.eg-picker-back.eg-btn[title=back]"]]).childNodes[0];
    myElements.close = jungle([["a.eg-picker-close.eg-btn", this.txt("Cancel")]]).childNodes[0];
    myElements.ok = jungle([["span.eg-picker-ok.eg-btn.eg-btn-prim", this.txt("Ok")]]).childNodes[0];
    myElements.pgup = jungle([["span.eg-picker-pgup.eg-btn", ">"]]).childNodes[0];
    myElements.pgdown = jungle([["span.eg-picker-pgup.eg-btn", "<"]]).childNodes[0];
    myElements.crumb = jungle([["span.eg-picker-path"]]).childNodes[0];
    myElements.selectAll = jungle([["input[type=checkbox]", {
        title: this.txt("Select all")
    }]]).childNodes[0];

    //bind events and store references to unbind later
    this.handleClick(this.el, self.focused); //maintains focus when multiple instances exist
    this.handleClick(myElements.back, self.goUp);
    this.handleClick(myElements.close, function () {
        self.handlers.close();
    });
    this.handleClick(myElements.ok, self.confirmSelection);
    this.handleClick(myElements.crumb, self.crumbNav);
    this.handleClick(myElements.selectAll, function (e) {
        self.model.setAllSelection(!!e.target.checked);
    });
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
        keys[keybinding["up"]] = helpers.bindThis(self, self.kbNav_up);
        keys[keybinding["down"]] = helpers.bindThis(self, self.kbNav_down);
        keys[keybinding["select"]] = helpers.bindThis(self, self.kbNav_select);
        keys[keybinding["explore"]] = helpers.bindThis(self, self.kbNav_explore);
        keys[keybinding["back"]] = helpers.bindThis(self.model, self.model.goUp);
        keys[keybinding["confirm"]] = helpers.bindThis(self, self.confirmSelection);
        keys[keybinding["close"]] = helpers.bindThis(self, self.handlers.close);

        document.activeElement && document.activeElement.blur();
        this.evs.push(dom.onKeys(document, keys, helpers.bindThis(self, self.hasFocus)));
    }

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
        (document.getElementsByTagName("head")[0]).appendChild(jungle([
            ["link", {
                    href: "https://fonts.googleapis.com/css?family=Open+Sans:400,600",
                    type: "text/css",
                    rel: "stylesheet"
                }
            ]
        ]));
        fontLoaded = true;
    }
}

viewPrototypeMethods.render = function () {
    var self = this;
    var myElements = this.els;

    myElements.list = document.createElement("ul");

    var topbar = ["div.eg-bar.eg-top"];
    if (this.model.isMultiselectable) {
        myElements.selectAll.checked = false;
        topbar.push(myElements.selectAll);
    }
    topbar.push(myElements.back);
    topbar.push(myElements.crumb);

    topbar = jungle([topbar]).childNodes[0];

    var layoutFragm = jungle([["div.eg-theme.eg-picker.eg-widget",
        ["a.eg-brand",{title:"egnyte.com"}],
        topbar,
        myElements.list,
        ["div.eg-bar" + this.bottomBarClass,
            myElements.ok,
            myElements.close,
            ["div.eg-picker-pager" + (this.model.hasPages ? "" : ".eg-not"),
                myElements.pgdown,
                ["span", this.model.page + "/" + this.model.totalPages],
                myElements.pgup
            ]
        ]
    ]]);

    this.el.innerHTML = "";
    this.el.appendChild(layoutFragm);
    //couldn't CSS it. blame old browsers
    myElements.list.style.height = (this.el.offsetHeight - 2 * topbar.offsetHeight) + "px";

    this.breadcrumbify(this.model.path);

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

    var itemName = jungle([["a.eg-picker-name" + (itemModel.data.is_folder ? ".eg-folder" : ".eg-file"),
        {
            "title": itemModel.data.name,
        },
        ["span.eg-ico.eg-mime-" + itemModel.mime,
            {
                "data-ext": itemModel.ext
            },
            ["span", itemModel.ext]
        ], itemModel.data.name]]).childNodes[0];

    var itemCheckbox = jungle([["input[type=checkbox]" + (itemModel.isSelectable ? "" : ".eg-not")]]).childNodes[0];
    itemCheckbox.checked = itemModel.selected;



    var itemNode = jungle([["li.eg-picker-item",
        itemCheckbox,
        itemName
    ]]).childNodes[0];

    dom.addListener(itemName, "click", function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        itemModel.defaultAction();
        return false;
    });

    dom.addListener(itemNode, "click", function (e) {
        itemModel.toggleSelect();
    });

    itemModel.onchange = function () {
        self.handlers.events("itemChange", itemModel);
        itemCheckbox.checked = itemModel.selected;
        itemNode.setAttribute("aria-selected", itemModel.isCurrent);
        if (itemModel.isCurrent) {
            try { //IE8 dies on this randomly :/
                self.els.list.scrollTop = itemNode.offsetTop - self.els.list.offsetHeight
            } catch (e) {};
            //itemNode.scrollIntoView(false);
        }
    };

    this.els.list.appendChild(itemNode);
}


viewPrototypeMethods.breadcrumbify = function (path) {
    var currentPath = "/";
    path = path || currentPath; //in case path was not provided, go for root
    
    var list = path.split("/");
    var crumbItems = [];
    var maxSpace = ~~ (100 / list.length); //assigns maximum space for text
    helpers.each(list, function (folder, num) {
        if (folder) {
            currentPath += folder + "/";
            num > 1 && (crumbItems.push(["span", "/"]));
            crumbItems.push(["a", {
                    "data-path": currentPath,
                    "title": folder,
                    "style": "max-width:" + maxSpace + "%"
                },
                folder]);

        } else {
            if (num === 0) {
                crumbItems.push(["a", {
                    "data-path": currentPath
                }, "/"]);
            }
        }
    });
    this.els.crumb.innerHTML = "";
    this.els.crumb.appendChild(jungle([crumbItems]));

}



viewPrototypeMethods.renderLoading = function () {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-placeholder", ["div.eg-spinner"], this.txt("Loading")]]));
    }
}


var msgs = require("./errormsg.js");

viewPrototypeMethods.renderProblem = function (code, message) {
    message = msgs["" + code] || msgs[~(code / 100) + "XX"] || message || msgs["?"];
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-placeholder", ["div.eg-picker-error"], message]]));
    } else {
        this.handlers.close({
            message: message
        });
    }
}
viewPrototypeMethods.renderEmpty = function () {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-placeholder.eg-folder", ["div.eg-ico"], this.txt("This folder is empty")]]));
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
    if (selected && selected.length) {
        this.handlers.selection.call(this, this.model.getSelected());
    }
}

viewPrototypeMethods.crumbNav = function (e) {
    var path = e.target.getAttribute("data-path");
    if (path) {
        this.model.fetch(path);
    }
}

viewPrototypeMethods.kbNav_up = function () {
    this.model.mvCurrent(-1);
}

viewPrototypeMethods.kbNav_down = function () {
    this.model.mvCurrent(1);
}
viewPrototypeMethods.kbNav_select = function () {
    this.model.getCurrent().toggleSelect();
}
viewPrototypeMethods.kbNav_confirm = function () {
    this.model.getCurrent().toggleSelect();
}

viewPrototypeMethods.kbNav_explore = function () {
    var item = this.model.getCurrent();
    if (item.data.is_folder) {
        item.defaultAction();
    }
}

View.prototype = viewPrototypeMethods;

module.exports = View;