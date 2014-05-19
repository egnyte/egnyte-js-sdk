describe("Egnyte widget", function () {
   

    it('should ignore trailing slash difference in domains', function () {
        var eg1 = EgnyteWidget.init("http://example.com");
        var eg2 = EgnyteWidget.init("http://example.com///");

        expect(eg1.domain).toEqual(eg2.domain);
    });

    describe("Remote Filepicker", function () {
        var eg;
        var node;

        beforeEach(function () {
            eg = EgnyteWidget.init("#");

            node = document.createElement('div');
            document.body.appendChild(node);
        });

        afterEach(function () {
            document.body.removeChild(node);
        });

        it('should create an iframe', function () {
            var callback = function () {};

            var picker = eg.filePickerRemote(node, callback, callback);

            expect(node.getElementsByTagName('iframe').length).toEqual(1);

            picker.close();
        });

        it('should cleanup after itself', function () {
            var callback = function () {};

            var picker = eg.filePickerRemote(node, callback, callback);
            picker.close();

            expect(node.getElementsByTagName('iframe').length).toEqual(0);
        });

        it('should react to postmessage', function (done) {

            //for matching origin
            eg = EgnyteWidget.init(window.location.origin);
            eg.filePickerRemote(node, function () {}, function () {
                //finishes the test successfully
                done();
            });
            //to stop it from opening itself in iframe
            node.innerHTML='';

            window.postMessage("'E" + '{"action":"cancel"}', "*");


        });



    });
});