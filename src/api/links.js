const ENDPOINTS_links = require("./endpoints").links;

module.exports = {
    init(core) {
        const mkReqFunction = core._.mkReqFunction()
        linksAPI = {
            createLink: mkReqFunction({
                required: ["path","linkSetup"],
                fsIdentification:true
            }, (tools, decorate, input) => {
                const linkSetup = input.linkSetup
                var defaults = {
                    path: null,
                    type: "file",
                    accessibility: "domain"
                };
                return Promise.resolve()
                    .then(() => {
                        const setup = Object.assign(defaults, linkSetup, { path: input.pathFromRoot });
                        // setup.path = tools.encodeNameSafe(setup.path);

                        return tools.requestEngine.promiseRequest(decorate({
                            method: "POST",
                            url: tools.requestEngine.getEndpoint() + ENDPOINTS_links,
                            body: setup,
                            json: true
                        }));
                    }).then(function (result) { //result.response result.body
                        return result.body;
                    });
            }),
            removeLink: mkReqFunction({required: ["id"]},(tools, decorate, input) => {
                return tools.requestEngine.promiseRequest(decorate({
                    method: "DELETE",
                    url: tools.requestEngine.getEndpoint() + ENDPOINTS_links + "/" + input.id
                })).then(function (result) { //result.response result.body
                    return result.response.statusCode;
                });
            }),
            listLink: mkReqFunction({required: ["id"]},(tools, decorate, input) => {
                return tools.requestEngine.promiseRequest(decorate({
                    method: "GET",
                    url: tools.requestEngine.getEndpoint() + ENDPOINTS_links + "/" + input.id
                })).then(function (result) { //result.response result.body
                    return result.body;
                });
            }),
            listLinks: mkReqFunction({required: ["filters"]},(tools, decorate, input) => {
                const filters = input.filters
                return promises(true)
                    .then(function () {
                        filters.path = filters.path && helpers.encodeNameSafe(filters.path);

                        return tools.requestEngine.promiseRequest(decorate({
                            method: "get",
                            url: tools.requestEngine.getEndpoint() + ENDPOINTS_links,
                            params: filters
                        }));
                    }).then(function (result) { //result.response result.body
                        return result.body;
                    });
            }),
            findOne: mkReqFunction({required: ["filters"]},(tools, decorate, input) => {
                return linksAPI.listLinks(input.filters).then(function (list) {
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
