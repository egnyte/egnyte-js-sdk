var helpers = require("../reusables/helpers");
var dom = require("../reusables/dom");
var jungle = require("../../vendor/zenjungle");
var texts = require("../reusables/texts");

require("../styles/main.less");

function openPrompt(node, setup) {
    if (!setup) {
        throw new Error("Setup required as a second argument");
    }
    var render, cleanup, ev;

    var txt = texts(setup.texts);

    cleanup = function () {
        ev.destroy();
        node.innerHTML = "";
    };


    var btOk = jungle([["span.eg-prompt-ok.eg-btn.eg-btn-prim", txt("Ok")]]).childNodes[0];
    var input = jungle([["input[type=text]"]]).childNodes[0];

    ev = (dom.addListener(btOk, "click", function () {
        var val = input.value;
        cleanup();
        setup.result(input.value);
    }));

    var bottomBarClass = (setup.barAlign === "left") ? "" : ".eg-bar-right";

    var layoutFragm = jungle([["div.eg-theme.eg-widget.eg-prompt",
        ["a.eg-brand",{title:"egnyte.com"}],
        ["div.eg-ctlgrp",
            ["label.eg-prompt-ask", txt("question")],
            input
        ],
        ["div.eg-bar" + bottomBarClass,
            [
                btOk
            ]
        ]
    ]]);

    node.innerHTML = "";
    node.appendChild(layoutFragm);
    input.focus();

    return {
        close: cleanup,
    };
};

module.exports = openPrompt;