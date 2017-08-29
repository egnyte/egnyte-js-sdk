describe("User Effective Permissions API", function () {

    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        QPS: 2
    });

    if (!egnyteDomain || !APIToken) {
        throw new Error("test/conf/apiaccess.js is missing");
    }

    let testpath;

    it("Needs a folder to set permissions to", () => {
        return eg.API.storage.get({
                path: "/Shared"
            })
            .then(response => {
                const folders = response.folders;
                expect(folders).to.exist();
                testpath = folders[0].path + "/bacon" + ~~(10000 * Math.random());
                return eg.API.storage.createFolder({
                    path: testpath
                })
            })
    });

    it("Can check current user permissions", () => {
        return eg.API.userPerms.get({
                path: "/Shared"
            })
            .then(function (res) {
                expect(res.permission).to.match(/Owner|Full|Editor|Viewer|None/);
                console.log(JSON.stringify(res));
            });

    });

    it("Can get user permissions", () => {
        return eg.API.userPerms.get({
                username: APIUsername,
                path: testpath
            })
            .then(response => {
                expect(response.permission).to.be.equal("Owner");
            });

    });

    it("should throw error when user doesn't exist", () => {
        return eg.API.userPerms.get({
                username: "wrongNotExistingUser",
                path: testpath
            })
            .then(() => {
                expect.fail();
            })
            .catch(err => {
                expect(err.statusCode).to.be.equal(400);
            });
    })

});