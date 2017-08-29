describe("User API", () => {

    const eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        QPS: 2
    });

    let userId;

    it("Can get user details by name", () => {

        return eg.API.user.getByName({
                name: APIUsername
            })
            .then(res => {
                expect(res.id).to.exist();
                userId = res.id;
            });

    });


    it("Throws when user doesn't exist", () => {
        return eg.API.user.getByName({
                name: "stotysiecykalafiorow"
            })
            .then(() => {
                expect.fail();
            })
            .catch(err => {
                expect(err.message).to.be.equal("User not found");
            });
    });



    it("Can get user details by id", () => {
        return eg.API.user.getById({
                id: userId
            })
            .then(res => {
                expect(res.id).to.exist();
            });
    });


    it("Throws when user doesn't exist", () => {
        //would be nice to create the user first...
        return eg.API.user.getById({
                id: 12345678987654321345678
            })
            .then(() => {
                expect.fail();
            })
            .catch(err => {
                expect(err.statusCode).to.be.equal(404);
            });
    });


});
