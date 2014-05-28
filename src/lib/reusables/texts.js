module.exports = function (overrides) {
    return function (txt) {
        if (overrides) {
            if (overrides[txt]) {
                return overrides[txt];
            } else if (overrides[txt.toLowerCase()]) {
                return overrides[txt.toLowerCase()];
            }
        }
        return txt;
    };
};
