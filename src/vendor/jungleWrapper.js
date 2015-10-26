var jungle = require("./zenjungle");
module.exports = {
    tree: jungle,
    node: function (i) {
        return jungle([i]).childNodes[0];
    }
}
