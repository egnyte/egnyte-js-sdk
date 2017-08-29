const ENDPOINTS = require("./ENDPOINTS");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction
        userPermissionsApi = {
            get: mkReqFunction({
                fsIdentification: true,
                optional: ["username"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.permsV1 + "/user" + (input.username ? "/" + input.username : ""))
                        };
                        opts.params = opts.qs = {
                            folder: input.pathFromRoot
                        };

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body);
            }),

        }

        core.API.userPerms = userPermissionsApi;
        return userPermissionsApi
    }
}
