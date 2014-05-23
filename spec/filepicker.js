describe("Remote Filepicker", function () {

    var eg;
    var node;

    beforeEach(function () {
        eg = Egnyte.init("#");

        node = document.createElement('div');
        document.body.appendChild(node);
    });

    afterEach(function () {
        document.body.removeChild(node);
    });

    it('should ignore trailing slash difference in domains', function () {
        var eg1 = Egnyte.init("http://example.com");
        var eg2 = Egnyte.init("http://example.com///");

        expect(eg1.domain).toEqual(eg2.domain);
    });

    it('should create an iframe', function () {
        var callback = function () {};

        var picker = eg.filePickerRemote(node,{});

        expect(node.getElementsByTagName('iframe').length).toEqual(1);

        picker.close();
    });

    it('should cleanup after itself', function () {
        var callback = function () {};

        var picker = eg.filePickerRemote(node,{});
        picker.close();

        expect(node.getElementsByTagName('iframe').length).toEqual(0);
    });

    it('should react to postmessage', function (done) {

        //for matching origin
        eg = Egnyte.init(window.location.origin);
        eg.filePickerRemote(node, {
            cancel: function () {
                //finishes the test successfully
                done();
            }
        });
        //to stop it from opening itself in iframe
        node.innerHTML = '';

        window.postMessage("'E" + '{"action":"cancel"}', "*");


    });


});