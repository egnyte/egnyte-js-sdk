egnyteDelay = function egnyteDelay(egnyteInstance, result, delayMS){
    return egnyteInstance.API.manual.Promise()
        .delay(delayMS)
        .then(function(){
            return result
        })
}