const ENDPOINTS = require("./ENDPOINTS");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction
        const authAPI = {
            getUserInfo: mkReqFunction({}, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        var opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.userinfo),
                        };
                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body);
            }),
            isAuthorized: mkReqFunction({}, (tools) =>
                tools.requestEngine.isAuthorized()
            ),

        }

        core.API.auth = authAPI
        return authAPI
    }
}
