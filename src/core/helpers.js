var disallowedChars = /[":<>|?*\\]/;

const helpers = {
    encodeNameSafe (name) {
        if (!name) {
            throw new Error("No name given");
        }
        if (disallowedChars.test(name)) {
            throw new Error("Disallowed characters in path");
        }

        name = name.replace(/^\/\//, "/");

        return (name);
    },
    encodePathComponents (path) {
        path = helpers.encodeNameSafe(path)
        return path.split("/").map(encodeURIComponent).join("/")
        //TODO: handle special chars not covered by this.
    },
    normalizeEgnyteDomain (domain) {
        return "https://" + (helpers.normalizeURL(url).replace(/^https?:\/\//, ""));
    },
    normalizeURL(url) {
        return (url).replace(/\/*$/, "");
    }
}


module.exports = helpers;
