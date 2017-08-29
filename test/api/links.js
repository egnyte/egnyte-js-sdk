let stream;

if (!ImInBrowser) {
    stream = require("stream");
}

describe("Link API facade integration", () => {

    const eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
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

    if (!egnyteDomain || !APIToken) {
        throw new Error("test/conf/apiaccess.js is missing");
    }

    it('should accept an existing token', () => {
        //token was passed in beforeEach
        expect(eg.API.auth.isAuthorized()).to.be.true();
    });

    let testpath;

    describe("Link methods", () => {
        let recentFile;
        let recentLink;

        it("Needs a file to link to", () => {
            return eg.API.storage.get({
                    path:"/Private"
                })
                .then(response => {
                    const folders = response["folders"];
                    expect(folders).to.exist();

                    //this test suite has unicorns and bacon, it can't get any better/
                    testpath = folders[0].path + "/bacon" + ~~(10000 * Math.random());
                    const blob = getTestBlob("hey!");
                    return eg.API.storage.storeFile({
                        path: testpath,
                        file: blob
                    })
                })
                .then(response => {
                    console.log(response);
                    recentFile = response;
                    recentFile.path = testpath;
                });
        });


        it("Can create a link to file", () => {

            return eg.API.link.createLink({
                    path: recentFile.path,
                    linkSetup:{
                        type: "file",
                        accessibility: "password",
                        expiry_clicks: 2
                    }
                })
                .then(response => {
                    console.log(response);

                    expect(response["path"]).to.be.equal(recentFile.path);
                    expect(response["type"]).to.be.equal("file");
                    expect(response.links[0].id).to.exist();
                    expect(response.links[0].url).to.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i);
                    expect(response["password"]).to.exist();
                    recentLink = response;
                })
                .then(() => {
                    return eg.API.link.listLink({
                        id: recentLink.links[0].id
                    });
                })
                .then(response => {
                    expect(response["path"]).to.be.equal(recentFile.path); //actually checking if it exists
                })

        });

        it("Can list links and filter the list", () => {

            return eg.API.link.listLinks({
                    filters:{
                        path: recentFile.path
                    }
                })
                .then(response => {
                    expect(response.ids.filter(id => id === recentLink.links[0].id).length).to.be.equal(1);

                    const other = response.ids.filter(id => id !== recentLink.links[0].id);
                    if (other.length) {
                        return eg.API.link.listLink({id:other[0]})
                            .then(response => {
                                expect(response["path"]).to.be.equal(recentFile.path); //actually checking if it exists
                            })
                    }
                })
        });

        it("Can find one link matching filter", () => {

            return eg.API.link.findOne({
                    filters:{
                        path: recentFile.path
                    }
                })
                .then(response => {
                    expect(response["path"]).to.be.equal(recentFile.path);
                });
        });

        it("Can destroy a link to file", () => {

            return eg.API.link.removeLink({
                    id: recentLink.links[0].id
                })
                .then(response => {
                    expect(response).to.be.equal(200);
                })
                .then(() => eg.API.link.listLink({
                    id: recentLink.links[0].id
                }))
                .then(() => {
                    expect.fail();
                }, result => {
                    expect(result.response.statusCode).to.be.equal(404);
                });

        });


        it("Needs to clean up the file", () => {
            return eg.API.storage.remove({
                    path:testpath
                })
        });

    });
});
