describe("API to JS", function () {

    var egnyteDomain = "https://hackathon1.egnyte.com";
    var APIToken = "7v387p7hbens29qynnsw9sb7";

    var eg;

    beforeEach(function () {
        eg = EgnyteWidget.init(egnyteDomain, {
            token: APIToken
        });
    });


    it('should accept an existing token', function () {
        var eg = EgnyteWidget.init(egnyteDomain, {
            token: APIToken
        });

        expect(eg.API.auth.isAuthenticated()).toBe(true);
    });

    describe("Storage", function () {

        it("Should claim that root exists", function (done) {
            eg.API.storage.exists("/Private").then(function (e) {
                expect(e).toBe(true);
                done();
            });

        });
        it("Should claim that jiberish diesn't exists", function (done) {
            eg.API.storage.exists("/jiberish").then(function (e) {
                expect(e).toBe(false);
                done();
            });

        });
        it("Should create and remove folder", function (done) {
            var testdir = "/Private/hackathon1/bacon" + ~~(1000 * Math.random());
            eg.API.storage.createFolder(testdir)
                .then(function (e) {
                    //expect(JSON.stringify(e)).toBe("logged");
                    expect(e.id).toBeDefined();
                    expect(e.path).toEqual(testdir);
                })
                .then(eg.API.storage.exists(testdir))
                .then(function (e) {
                    expect(e).toBe(true);
                })
                .then(eg.API.storage.removeFolder(testdir))
                .then(eg.API.storage.exists(testdir))
                .then(function (e) {
                    expect(e).toBe(false);
                    done();
                });

        });



    });
});