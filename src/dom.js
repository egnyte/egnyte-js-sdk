module.exports = {

    addListener: function (elem, type, callback) {
        if (elem.addEventListener) {
            elem.addEventListener(type, callback, false);
        } else {
            elem.attachEvent("on" + type, function (e) {
                e = e || window.event; // get window.event if argument is falsy (in IE)
                e.target || (e.target = e.srcElement);
                callback.call(this, e);
            });
        }
    },

    removeListener: function (elem, type, callback) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, callback, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, callback);
        }
    },

    createFrame: function (url) {
        var iframe = document.createElement("iframe");
        // iframe.setAttribute("scrolling", "no");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.minWidth = "400px";
        iframe.style.minHeight = "400px";
        iframe.style.border = "1px solid #dbdbdb";
        iframe.src = url;
        return iframe;
    }

}