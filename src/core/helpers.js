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
        return path.split("/").map(encodeURIComponent).join("/").replace(/#/g,"%23");
        //TODO: handle special chars not covered by this.
    },
    normalizeEgnyteDomain (domain) {
        return "https://" + (helpers.normalizeURL(url).replace(/^https?:\/\//, ""));
    },
    normalizeURL(url) {
        return (url).replace(/\/*$/, "");
    }
    hintDeveloper(hint){
        console && console.warn(hint)
    }
}


module.exports = helpers;
