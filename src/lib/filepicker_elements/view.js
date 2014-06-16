"use strict";

//template engine based upon JsonML
var dom = require("../reusables/dom");
var helpers = require("../reusables/helpers");
var texts = require("../reusables/texts");
var jungle = require("../../vendor/zenjungle");

require("./view.less");

var currentGlobalKeyboadrFocus = "no";


function View(opts, txtOverride) {
    var self = this;
    this.uid = Math.random();
    currentGlobalKeyboadrFocus = this.uid;
    this.el = opts.el;
    this.els = {};
    this.evs = [];


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
    this.els.back = jungle([["a.eg-filepicker-back.eg-btn[title=back]"]]).childNodes[0];
    this.els.close = jungle([["a.eg-filepicker-close.eg-btn", this.txt("Cancel")]]).childNodes[0];
    this.els.ok = jungle([["span.eg-filepicker-ok.eg-btn", this.txt("Ok")]]).childNodes[0];
    this.els.pgup = jungle([["span.eg-filepicker-pgup.eg-btn", ">"]]).childNodes[0];
    this.els.pgdown = jungle([["span.eg-filepicker-pgup.eg-btn", "<"]]).childNodes[0];
    this.els.crumb = jungle([["span.eg-filepicker-path"]]).childNodes[0];
    this.els.selectAll = jungle([["input[type=checkbox]", {
        title: this.txt("Select all")
    }]]).childNodes[0];

    //bind events and store references to unbind later
    this.handleClick(this.el, self.focused); //maintains focus when multiple instances exist
    this.handleClick(this.els.back, self.goUp);
    this.handleClick(this.els.close, self.handlers.close);
    this.handleClick(this.els.ok, self.confirmSelection);
    this.handleClick(this.els.crumb, self.crumbNav);
    this.handleClick(this.els.selectAll, function (e) {
        self.model.setAllSelection(!!e.target.checked);
    });
    this.handleClick(this.els.pgup, function (e) {
        self.model.switchPage(1);
    });
    this.handleClick(this.els.pgdown, function (e) {
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
        } else {
            if (message === false) {
                return;
            }
            this.renderProblem(~~(e.statusCode), e.message);
        }
    } else {
        this.renderProblem(~~(e.statusCode), e.message);
    }
}


//================================================================= 
// rendering
//================================================================= 
viewPrototypeMethods.render = function () {
    var self = this;

    this.els.list = document.createElement("ul");

    var topbar = ["div.eg-filepicker-bar.eg-top"];
    if (this.model.isMultiselectable) {
        this.els.selectAll.checked = false;
        topbar.push(this.els.selectAll);
    }
    topbar.push(this.els.back);
    topbar.push(this.els.crumb);

    var layoutFragm = jungle([["div.eg-theme.eg-filepicker",
        topbar,
        this.els.list,
        ["div.eg-filepicker-bar" + this.bottomBarClass,
            this.els.ok,
            this.els.close,
            ["div.eg-filepicker-pager" + (this.model.hasPages ? "" : ".eg-not"),
                this.els.pgdown,
                ["span", this.model.page + "/" + this.model.totalPages],
                this.els.pgup
            ]
        ]
    ]]);

    this.el.innerHTML = "";
    this.el.appendChild(layoutFragm);

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

    var itemName = jungle([["a.eg-filepicker-name" + (itemModel.data.is_folder ? ".eg-folder" : ".eg-file"),
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



    var itemNode = jungle([["li.eg-filepicker-item",
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
        self.handlers.events("itemChange",itemModel);        
        itemCheckbox.checked = itemModel.selected;
        itemNode.setAttribute("aria-selected", itemModel.isCurrent);
        if (itemModel.isCurrent) {
            self.els.list.scrollTop = itemNode.offsetTop - self.els.list.offsetHeight
            //itemNode.scrollIntoView(false);
        }
    };

    this.els.list.appendChild(itemNode);
}


viewPrototypeMethods.breadcrumbify = function (path) {
    var list = path.split("/");
    var crumbItems = [];
    var currentPath = "/";
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


var msgs = {
    "404": "This item doesn't exist (404)",
    "403": "Access denied (403)",
    "409": "Forbidden location (409)",
    "4XX": "Incorrect API request",
    "5XX": "API server error, try again later",
    "0": "Browser error, try again",
    "?": "Unknown error"
}

viewPrototypeMethods.renderProblem = function (code, message) {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        message = msgs["" + code] || msgs[~(code / 100) + "XX"] || message || msgs["?"];
        this.els.list.appendChild(jungle([["div.eg-placeholder", ["div.eg-filepicker-error"], message]]));
    } else {
        this.handlers.close();
    }
}
viewPrototypeMethods.renderEmpty = function () {
    if (this.els.list) {
        this.els.list.innerHTML = "";
        this.els.list.appendChild(jungle([["div.eg-placeholder", ["div.eg-filepicker-folder"], this.txt("This folder is empty")]]));
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