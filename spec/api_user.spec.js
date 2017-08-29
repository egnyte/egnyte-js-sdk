const ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("User API", () => {

    const eg = Egnyte.init(egnyteDomain, {
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

    beforeEach(() => {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });

    let userId;

    it("Can get user details by name", done => {
        //would be nice to create the user first...
        eg.API.user.getByName({
                name: APIUsername
            })
            .then(res => {
                expect(res.id).toBeDefined();
                userId = res.id;
                done();
            })
            .catch(function(err) {
                expect(this).toAutoFail(err);
                done();
            });

    });


    it("Throws when user doesn't exist", done => {
        //would be nice to create the user first...
        eg.API.user.getByName({
                name: "stotysiecykalafiorow"
            })
            .then(function (res) {
                expect(this).toAutoFail("did not throw");
                done();
            })
            .catch(err => {
                expect(err.message).toEqual("User not found");
                done();
            });
    });



    it("Can get user details by id", done => {
        //would be nice to create the user first...
        eg.API.user.getById({
                id: userId
            })
            .then(res => {
                expect(res.id).toBeDefined();
                done();
            })
            .catch(function (err) {
                expect(this).toAutoFail(err);
                done();
            });
    });


    it("Throws when user doesn't exist", done => {
        //would be nice to create the user first...
        eg.API.user.getById({
                id: 12345678987654321345678
            })
            .then(function (res) {
                expect(this).toAutoFail("did not throw");
                done();
            })
            .catch(err => {
                expect(err.statusCode).toEqual(404);
                done();
            });
    });


});
