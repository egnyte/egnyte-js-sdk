var helpers = require("../reusables/helpers");
var dom = require("../reusables/dom");
var jungle = require("../../vendor/zenjungle");

var airaExpanded = "aria-expanded";

function searchView(parent) {
    var self = this;
    var myElements = this.els = {};
    self.evs = [];
    self.model = parent.model;

    self.action = helpers.bindThis(self, actionImplementation);

    myElements.close = jungle([
        ["a.eg-search-x.eg-btn", "+"]
    ]).childNodes[0];
    myElements.ico = jungle([
        ["a.eg-btn.eg-search-ico[tabindex=2]"]
    ]).childNodes[0];
    myElements.input = jungle([
        ["input[placeholder=" + parent.txt("Search in files") + "][tabindex=1]"]
    ]).childNodes[0];
    myElements.field = jungle([
        ["span.eg-search-inpt", myElements.input]
    ]).childNodes[0];

    parent.handleClick(myElements.close, function () {
        self.model.viewState.searchOn = false;
        self.model.cancelSearch();
        //hide search results by reloading current folder
        self.model.fetch();
        self.el.setAttribute(airaExpanded, false);
    });

    function invoke() {
        if (self.model.viewState.searchOn) {
            self.action();
        } else {
            self.model.viewState.searchOn = true;
            self.el.setAttribute(airaExpanded, true);
            myElements.input.focus();
        }
    }

    parent.handleClick(myElements.ico, invoke);
    parent.evs.push(dom.onKeys(myElements.ico, {
        "<space>": invoke
    }, true));
    parent.evs.push(dom.onKeys(myElements.input, {
        "<enter>": self.action,
        "other": helpers.debounce(self.action, 800)
    }, true));

}
searchView.prototype.getTree = function () {
    var myElements = this.els;
    var searchBarDefinition = "div.eg-search.eg-bar"
    if (this.model.viewState.searchOn) {
        searchBarDefinition += "[" + airaExpanded + "=true]";
    }
    var el = [searchBarDefinition];

    el.push(myElements.ico);
    el.push(myElements.close);
    el.push(myElements.field);

    el = jungle([el]).childNodes[0];
    this.el = el;

    return el;
}
searchView.prototype.render = function () {
    if (this.model.viewState.searchOn) {
        this.els.input.focus();
    }
}

function actionImplementation() {
    var myElements = this.els;
    if (myElements.input.value && myElements.input.value.length > 2) {
        this.model.search(myElements.input.value)
    }
}


module.exports = searchView;
