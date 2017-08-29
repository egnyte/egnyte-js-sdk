const ENDPOINTS_links = require("./ENDPOINTS").links;

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction
        const linksAPI = {
            createLink: mkReqFunction({
                requires: ["path", "linkSetup"],
                fsIdentification: true
            }, (tools, decorate, input) => {
                const linkSetup = input.linkSetup
                const defaults = {
                    path: null,
                    type: "file",
                    accessibility: "domain"
                };
                return Promise.resolve()
                    .then(() => {
                        const setup = Object.assign(defaults, linkSetup, {
                            path: input.pathFromRoot
                        });
                        // setup.path = tools.encodeNameSafe(setup.path);

                        return tools.requestEngine.promiseRequest(decorate({
                            method: "POST",
                            url: tools.requestEngine.getEndpoint() + ENDPOINTS_links,
                            json: setup
                        }));
                    }).then(function (result) { //result.response result.body
                        return result.body;
                    });
            }),
            removeLink: mkReqFunction({
                requires: ["id"]
            }, (tools, decorate, input) => {
                return tools.requestEngine.promiseRequest(decorate({
                    method: "DELETE",
                    url: tools.requestEngine.getEndpoint() + ENDPOINTS_links + "/" + input.id
                })).then(function (result) { //result.response result.body
                    return result.response.statusCode;
                });
            }),
            listLink: mkReqFunction({
                requires: ["id"]
            }, (tools, decorate, input) => {
                return tools.requestEngine.promiseRequest(decorate({
                    method: "GET",
                    url: tools.requestEngine.getEndpoint() + ENDPOINTS_links + "/" + input.id
                })).then(function (result) { //result.response result.body
                    return result.body;
                });
            }),
            listLinks: mkReqFunction({
                requires: ["filters"]
            }, (tools, decorate, input) => {
                const filters = input.filters
                return Promise.resolve()
                    .then(function () {
                        filters.path = filters.path && tools.helpers.encodeNameSafe(filters.path);

                        return tools.requestEngine.promiseRequest(decorate({
                            method: "get",
                            url: tools.requestEngine.getEndpoint() + ENDPOINTS_links,
                            params: filters
                        }));
                    }).then(function (result) { //result.response result.body
                        return result.body;
                    });
            }),
            findOne: mkReqFunction({
                requires: ["filters"]
            }, (tools, decorate, input) => {
                return linksAPI.listLinks(input).then(function (list) {
                    if (list.ids && list.ids.length > 0) {
                        return linksAPI.listLink({
                            id: list.ids[0]
                        });
                    } else {
                        return null;
                    }
                });
            }),
        }

        core.API.link = linksAPI
        return linksAPI
    }
}
