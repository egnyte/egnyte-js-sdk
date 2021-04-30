egnyteDelay = function egnyteDelay(egnyteInstance, result, timeoutMs) {
    var prom = egnyteInstance.API.manual.Promise();
    setTimeout(function() {
        prom(true, []);
    }, timeoutMs);
    return prom.then(function(){
        return result
    }); 
}
