const ENDPOINTS_links = require("./endpoints").links;

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction()
        linksAPI = {
            createLink: mkReqFunction((tools, linkSetup) => {
                var defaults = {
                    path: null,
                    type: "file",
                    accessibility: "domain"
                };
                return Promise.resolve()
                    .then(() => {
                        const setup = Object.assign(defaults, linkSetup);
                        setup.path = tools.encodeNameSafe(setup.path);

                        if (!setup.path) {
                            throw tools.mkerr("Path attribute missing or incorrect");
                        }

                        return tools.requestEngine.promiseRequest(tools.decorate({
                            method: "POST",
                            url: tools.requestEngine.getEndpoint() + ENDPOINTS_links,
                            json: setup
                        }));
                    }).then(function (result) { //result.response result.body
                        return result.body;
                    });
            }),
            removeLink: mkReqFunction((tools, id) => {
                return tools.requestEngine.promiseRequest(tools.decorate({
                    method: "DELETE",
                    url: tools.requestEngine.getEndpoint() + ENDPOINTS_links + "/" + id
                })).then(function (result) { //result.response result.body
                    return result.response.statusCode;
                });
            }),
            listLink: mkReqFunction((tools, id) => {
                return tools.requestEngine.promiseRequest(tools.decorate({
                    method: "GET",
                    url: tools.requestEngine.getEndpoint() + ENDPOINTS_links + "/" + id
                })).then(function (result) { //result.response result.body
                    return result.body;
                });
            }),
            listLinks: mkReqFunction((tools, filters) => {
                return promises(true)
                    .then(function () {
                        filters.path = filters.path && helpers.encodeNameSafe(filters.path);

                        return tools.requestEngine.promiseRequest(tools.decorate({
                            method: "get",
                            url: tools.requestEngine.getEndpoint() + ENDPOINTS_links,
                            params: filters
                        }));
                    }).then(function (result) { //result.response result.body
                        return result.body;
                    });
            }),
            findOne: mkReqFunction((tools, filters) => {
                return linksAPI.listLinks(filters).then(function (list) {
                    if (list.ids && list.ids.length > 0) {
                        return linksAPI.listLink(list.ids[0]);
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
