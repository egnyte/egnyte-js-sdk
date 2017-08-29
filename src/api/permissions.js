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
                fsIdentification: true
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        const opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.perms + input.pathFromRoot)
                        };

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body);
            })
        }

        core.API.perms = permissionsApi;
        return permissionsApi
    }
}
