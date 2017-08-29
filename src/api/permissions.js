const ENDPOINTS = require("./ENDPOINTS");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction;
        permissionsApi = {
            allow: mkReqFunction({
                fsIdentification: true,
                permScopeIdentification: true
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "POST",
                            json: input.permScope,
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.perms + input.pathFromRoot),
                        };

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.response.statusCode);
            }),
            getPerms: mkReqFunction({
                fsIdentification: true,
                optional: ["user"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "GET"
                        };
                        if (input.user) {
                            opts.url = tools.requestEngine.getEndpoint(ENDPOINTS.permsV1 + "/user/" + input.user);
                            opts.qs = {
                                folder: input.pathFromRoot
                            }
                        } else {
                            opts.url = tools.requestEngine.getEndpoint(ENDPOINTS.perms + input.pathFromRoot);
                        }

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body);
            })
        }

        core.API.perms = permissionsApi;
        return permissionsApi
    }
}
