(function () {
    "use strict";


    var options = {
        filePicker: {
            viewAddress: "folderExplorerDev.html",
            channelMarker: "'E"
        }
    };



    function init(egnyteDomainURL) {

        options.egnyteDomainURL = egnyteDomainURL;

        return {
            filePicker: require("./filepicker")(options)
        }

    }

    window.EG = {
        init: init
    }

})();