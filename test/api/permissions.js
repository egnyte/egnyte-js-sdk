let stream;

if (!ImInBrowser) {
    stream = require("stream");
}


describe("Permissions API facade integration", () => {

    const eg = Egnyte.init(settings.egnyteDomain, {
        token: settings.APIToken,
        QPS: 2
    });

    function getTestBlob(txt) {
        var content = '<a id="a"><b id="b">' + txt + '</b></a>'; // the body of the new file...
        if (ImInBrowser) {
            try {
                var blob = new Blob([content], {
                    type: "text/xml"
                });
            } catch (e) {
                var blob = content;
            }
            return blob;
        } else {
            var s = new stream.Readable();
            s.push(content);
            s.push(null);
            return s;
        }
    }

    if (!settings.egnyteDomain || !settings.APIToken) {
        throw new Error("test/conf/apiaccess.js is missing");
    }

    it("should accept an existing token", () => {
        expect(eg.API.auth.isAuthorized()).to.be.true();
    });

    let testpath;

    describe("Permissions methods", () => {

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


        it("Can set basic permissions", () => {
            return eg.API.perms.allow({
                    userPerms: {
                        OtherUsername: "Editor"
                    },
                    path: testpath
                })
                .then(response => {
                    expect(response.statusCode).to.be.equal(204);
                    return eg.API.perms.getPerms({
                        path: testpath
                    });
                }).then(response => {
                    const userPerms = response.userPerms;
                    expect(userPerms[OtherUsername]).to.be.equal("Editor")
                });

        });

        // it("Can filter permissions", () => {
        //     return eg.API.perms.getPerms({
        //             users: ["JohnnyIHardlyKnewYa"],
        //             path: testpath
        //         })
        //         .then(response => {
        //             const users = response.users;
        //             expect(users.length).to.be.equal(0);
        //             return eg.API.perms.getPerms({
        //                 path: testpath
        //             });
        //         }).then(response => {
        //             const users = response.users;
        //             expect(users.length).to.be.above(0);
        //         });
        //
        // });

        // describe("Impersonated locking", () => {
        //     let token;
        //
        //     it("Needs a file to lock", () => {
        //         const blob = getTestBlob("hey!");
        //
        //         return eg.API.storage.storeFile({
        //             path: testpath + "/aaa",
        //             file: blob
        //         });
        //
        //     });
        //
        //     it("Can lock a file as other user", () => {
        //         return eg.API.storage.impersonate({
        //                 username: OtherUsername
        //             })
        //             .lock({
        //                 path: testpath + "/aaa",
        //                 timeout: 1800
        //             })
        //             .then(result => {
        //                 token = result.lock_token;
        //                 expect(result.lock_token).to.be.ok();
        //                 expect(result.timeout).to.be.ok();
        //             });
        //     });
        //
        //     it("Can unlock a file as other user", () => {
        //         return eg.API.storage.impersonate({
        //                 username: OtherUsername
        //             })
        //             .unlock({
        //                 path: testpath + "/aaa",
        //                 lockToken: token
        //             })
        //             .then(function (result) {
        //                 expect(result).to.exist();
        //             });
        //
        //     });
        //
        // });

        it("Needs to clean up the folder", () => {
            return eg.API.storage.remove({
                path: testpath
            });
        });

    });
});
