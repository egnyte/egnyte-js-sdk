var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("User API", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 2
    });

    if (ImInBrowser) {
        if (!window.egnyteDomain || !window.APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    } else {
        if (!egnyteDomain || !APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    }

    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });

    var userId;

    it("Can get user details by name", function (done) {
        //would be nice to create the user first...
        eg.API.user.getByName(APIUsername)
            .then(function (res) {
                expect(res.id).toBeDefined();
                userId = res.id;
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

    });


    it("Throws when user doesn't exist", function (done) {
        //would be nice to create the user first...
        eg.API.user.getByName("stotysiecykalafiorow")
            .then(function (res) {
                expect(this).toAutoFail("did not throw");
                done();
            }).fail(function (e) {
                expect(e.statusCode).toEqual(404)
                done();
            });
    });



    it("Can get user details by id", function (done) {
        //would be nice to create the user first...
        eg.API.user.getById(userId)
            .then(function (res) {
                expect(res.id).toBeDefined();
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });
    });


    it("Throws when user doesn't exist", function (done) {
        //would be nice to create the user first...
        eg.API.user.getById(12345678987654321345678)
            .then(function (res) {
                expect(this).toAutoFail("did not throw");
                done();
            }).fail(function (e) {
                expect(e.statusCode).toEqual(404)
                done();
            });
    });


});
