"use strict"
const requestEngineFactory = require("./reqengine")
const helpers = require("./helpers")
const decorators = require("./decorators")
const inputHandler = require("./inputHandler")
const mkerr = require("./error/mkerr")

const plugins = new Set()

const mkReqFunctionFactory = tools => (guarantees, apiFacadeMethod) => input =>
    apiFacadeMethod(tools, decorators.configure(input), inputHandler.process(input, guarantees))


module.exports = {
    instance(options){
        const tools = {
            requestEngine: requestEngineFactory({
                request: options.request
            }),
            helpers: helpers,
            mkerr,
            inputHandler

        }
        const core = {
            setDomain(domain){
                const normalizedDomain = helpers.normalizeEgnyteDomain(domain)
                options.egnyteDomainURL = normalizedDomain
                core.domain = normalizedDomain
            },
            API:{
                manual: tools.requestEngine
            }
            domain: null,
            _:{
                mkReqFunction: mkReqFunctionFactory(tools)
            }
        }
        plugins.forEach(p=>p.init(core))
        return core
    },
    plug(plugin){
        // Set automatically deduplicates if a plugin was added twice
        plugins.add(plugin)
    },
    _:{
        helpers,
        plugins,
        requestEngineFactory
    }
}
