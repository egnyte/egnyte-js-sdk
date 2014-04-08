describe("Filepicker", function () {
    var eg;
    var node;

    beforeEach(function () {
        eg = EG.init("#");

        node = document.createElement('div');
        document.body.appendChild(node);
    });

    afterEach(function () {
        document.body.removeChild(node);
    });

    it('should create iframe', function () {
        var callback = function () {};

        eg.filePicker(node, callback, callback);

        expect(node.getElementsByTagName('iframe').length).toEqual(1);
    });

    it('should react to postmessage', function (done) {

        //for matching origin
        eg = EG.init(window.location.origin);
        eg.filePicker(node, function () {}, function () {
            //finishes the test successfully
            done();
        });
        //to stop it from opening itself in iframe
        node.getElementsByTagName('iframe')[0].setAttribute("src", "#");

        window.postMessage("'E" + '{"action":"cancel"}', "*");


    });

});