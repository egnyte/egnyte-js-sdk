var helpers = require("../reusables/helpers");
var jungle = require("../../vendor/zenjungle");

function beradcrumbView(parent) {
    var self = this;
    var myElements = this.els = {};
    self.model = parent.model;

    myElements.close = jungle([
        ["a.eg-search-x.eg-btn"]
    ]).childNodes[0];
    myElements.ico = jungle([
        ["div.eg-search-ico"]
    ]).childNodes[0];
    myElements.field = jungle([
        ["span.eg-search-inpt","docx"]
    ]).childNodes[0];

    parent.handleClick(myElements.close, function(){
        self.el.style.width="";
    });
    parent.handleClick(myElements.ico, function(){
        self.el.style.width="100%";
    });
    parent.handleClick(myElements.field, function(){
        self.model.search("docx")
    });

}
beradcrumbView.prototype.getTree = function() {
    var myElements = this.els;
    var el = ["div.eg-search"];
    el.push(myElements.ico);
    el.push(myElements.close);
    el.push(myElements.field);

    el = jungle([el]).childNodes[0];
    this.el = el;

    return el;
}


beradcrumbView.prototype.render = function() {


}

module.exports = beradcrumbView;
