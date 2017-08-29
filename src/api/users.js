const ENDPOINTS = require("./ENDPOINTS");

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction;
        usersAPI = {
            getById: mkReqFunction({
                fsIdentification: false,
                requires: ["id"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        let opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.users + input.id),
                        };

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => result.body);
            }),
            getByName: mkReqFunction({
                fsIdentification: false,
                requires: ["name"]
            }, (tools, decorate, input) => {
                return Promise.resolve()
                    .then(() => {
                        let opts = {
                            method: "GET",
                            url: tools.requestEngine.getEndpoint(ENDPOINTS.users),
                            params: {
                                filter: "userName eq \"" + input.name + "\""
                            }
                        };

                        return tools.requestEngine.promiseRequest(decorate(opts));
                    })
                    .then(result => {
                        if(result.body.resources && result.body.resources[0]){
                            return result.body.resources[0];
                        } else {
                            throw tools.mkerr({
                                message: `User not found`
                            });
                        }
                    });
            }),
        };

        core.API.user = usersAPI;
        return usersAPI
    }
};
