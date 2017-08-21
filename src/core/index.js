"use strict"
const requestEngineFactory = require("./reqengine")
const helpers = require("./helpers")
const mkerr = require("./error/mkerr")

const plugins = new Set()

// const mkReqFunctionFactory => tools => apiFacadeMethod => apiFacadeMethod.bind(null, tools)
// in case your brain hurts from parsing this, here's a good old ES5 version
function mkReqFunctionFactory(tools){
    return function mkReqFunction(apiFacadeMethod){
        return function(){

            return apiFacadeMethod.bind(null, tools).apply(null, arguments)
        }
    }
}


module.exports = {
    instance(options){
        const tools = {
            decorate() {

            },
            requestEngine: requestEngineFactory({
                request: options.request
            }),
            encodeNameSafe: helpers.encodeNameSafe,
            mkerr,

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
