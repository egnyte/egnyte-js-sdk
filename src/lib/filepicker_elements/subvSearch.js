var helpers = require("../reusables/helpers");
var dom = require("../reusables/dom");
var jungle = require("../../vendor/zenjungle");

var airaExpanded = "aria-expanded";

function beradcrumbView(parent) {
    var self = this;
    var myElements = this.els = {};
    self.evs = [];
    self.model = parent.model;

    myElements.close = jungle([
        ["a.eg-search-x.eg-btn","+"]
    ]).childNodes[0];
    myElements.ico = jungle([
        ["a.eg-btn.eg-search-ico"]
    ]).childNodes[0];
    myElements.field = jungle([
        ["span.eg-search-inpt", ["input[placeholder="+parent.txt("Search")+"]"]]
    ]).childNodes[0];

    parent.handleClick(myElements.close, function () {
        self.model.viewState.searchOn = false;
        self.el.setAttribute(airaExpanded, false);
    });
    parent.handleClick(myElements.ico, function () {
        self.model.viewState.searchOn = true;
        self.el.setAttribute(airaExpanded, true);
    });
    self.evs.push(dom.onKeys(myElements.field, {
            "<enter>": function () {
                self.model.search("docx")
            }
        },
        function () {
            return 1;
        }));

}
beradcrumbView.prototype.getTree = function () {
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


beradcrumbView.prototype.render = function () {


}

beradcrumbView.prototype.destroy = function () {


}

module.exports = beradcrumbView;
