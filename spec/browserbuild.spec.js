var ImInBrowser = (typeof window !== "undefined");
if (ImInBrowser) {
    describe("Browser build", function () {

        var eg = Egnyte.init(egnyteDomain, {
            token: APIToken,
            QPS: 2
        });
        var node;


        it('should use pinkyswear promises for the browser', function () {
            var resolvedPromise = eg.API.manual.promise(true);
            expect(resolvedPromise.all).toBeUndefined();
            expect(resolvedPromise.fin).toBeUndefined();
            expect(resolvedPromise.spread).toBeUndefined();
        });

        it('should use the browser version of api', function () {
            expect(eg.API.storage.getFileStream).not.toBeDefined();
        });


        it('should use xhr for http in the browser', function () {
            var xhr = eg.API.manual.sendRequest({
                url: "/",
                headers: {
                    "X-foo": "bar"
                },
                method: "GET"
            }, function (error, response, body) {
                
            });

            expect(xhr.headers).toBeDefined();
        });




    });
}