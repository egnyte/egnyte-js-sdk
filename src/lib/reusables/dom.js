var vkey = require('vkey');


function addListener(elem, type, callback) {
    var handler;
    if (elem.addEventListener) {
        handler = callback;
        elem.addEventListener(type, callback, false);

    } else {
        handler = function (e) {
            e = e || window.event; // get window.event if argument is falsy (in IE)
            e.target || (e.target = e.srcElement);
            var res = callback.call(this, e);
            if (res === false) {
                e.cancelBubble = true;
            }
            return res;
        };
        elem.attachEvent("on" + type, handler);
    }

    return {
        destroy: function () {
            removeListener(elem, type, handler);
        }
    }
}

function removeListener(elem, type, handler) {
    if (elem.removeEventListener) {
        elem.removeEventListener(type, handler, false);
    } else if (elem.detachEvent) {
        elem.detachEvent(type, handler);
    }
}



module.exports = {

    addListener: addListener,

    onKeys: function (elem, actions, hasFocus) {
        return addListener(elem, "keyup", function (ev) {
            if (ev.target.tagName && ev.target.tagName.toLowerCase() !== "input") {
                ev.preventDefault && ev.preventDefault();
            }
            ev.stopPropagation && ev.stopPropagation();
            if (hasFocus===true || hasFocus()) {
                if (actions[vkey[ev.keyCode]]) {
                    actions[vkey[ev.keyCode]]();
                } else {
                    actions["other"] && actions["other"]();
                }
            }
            return false;
        });
    },

    createFrame: function (url, scrolling) {
        var iframe = document.createElement("iframe");
        if (!scrolling) {
            iframe.setAttribute("scrolling", "no");
        }
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.minWidth = "400px";
        iframe.style.minHeight = "400px";
        iframe.style.border = "1px solid #dbdbdb";
        iframe.src = url;
        return iframe;
    }

}
