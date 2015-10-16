var helpers = require("../reusables/helpers");
var dom = require("../reusables/dom");
var jungle = require("../../vendor/jungleWrapper");

var airaExpanded = "aria-expanded";

function searchView(parent) {
    var self = this;
    var myElements = this.els = {};
    self.evs = [];
    self.model = parent.model;

    self.action = helpers.bindThis(self, actionImplementation);

    myElements.close = jungle.node(["a.eg-search-x.eg-btn", "+"]);
    myElements.ico = jungle.node(["a.eg-btn.eg-search-ico[tabindex=2]"]);
    myElements.input = jungle.node(["input[placeholder=" + parent.txt("Search in files") + "][tabindex=1]"]);
    myElements.field = jungle.node(["div.eg-search-inpt", myElements.input]);

    parent.handleClick(myElements.close, function () {
        self.model.viewState.searchOn = false;
        self.model.cancelSearch();

        self.el.removeAttribute(airaExpanded);
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

    el.push(myElements.close);
    el.push(myElements.field);
    el.push(myElements.ico);

    el = jungle.node(el);
    this.el = el;

    return el;
}
searchView.prototype.render = function () {
    if (this.model.viewState.searchOn) {
        setTimeout(this.els.input.focus(), 0);
    }
}

function actionImplementation() {
    var myElements = this.els;
    if (myElements.input.value && myElements.input.value.length > 2) {
        this.model.search(myElements.input.value)
    }
}


module.exports = searchView;
