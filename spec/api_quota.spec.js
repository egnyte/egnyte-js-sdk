var ImInBrowser = (typeof window !== "undefined");
if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}


if (ImInBrowser) {


    describe("API Quota handlers (may fail on lags)", function () {
        it('BTW. The test should have a working matcher for errors', function () {
            //token was passed in beforeEach
            expect(expect(this).toAutoFail).toBeDefined();
        });

        if (!window.egnyteDomain || !window.APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }

        beforeEach(function () {
            jasmine.getEnv().defaultTimeoutInterval = 10000; //QA API can be laggy
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; //QA API can be laggy

        });
        it("BTW.The test needs to have the request cached for stable response times", function (done) {
            var eg = Egnyte.init(egnyteDomain, {
                token: APIToken,
                oldIEForwarder: true, //opt in for IE8/9 support
            });
            eg.API.storage.path("/jiberish").exists().then(function (e) {
                expect(true).toBeTruthy();
                done();
            })
        });

        it("should delay calls to fit QPS", function (done) {
            var t1 = (1 / 0),
                t2 = 0;
            var eg = Egnyte.init(egnyteDomain, {
                token: APIToken,
                oldIEForwarder: true, //opt in for IE8/9 support
                QPS: 1
            });
            eg.API.storage.path("/jiberish").exists().then(function (e) {
                t1 = +new Date();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

            eg.API.storage.path("/jiberish").exists().then(function (e) {
                t2 = +new Date();
                //assuming 404 is quite stable in terms of response time
                //but the response can be cached and the second one is faster
                expect(t2 - t1).toBeGreaterThan(500);
                setTimeout(done, 1000); //wait for quota reset
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });
        it("should not delay calls while under QPS", function (done) {
            var t1 = 0,
                t2 = 0;
            var eg = Egnyte.init(egnyteDomain, {
                token: APIToken,
                oldIEForwarder: true, //opt in for IE8/9 support
                QPS: 2
            });
            eg.API.storage.path("/jiberish").exists().then(function (e) {
                t1 = +new Date();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

            eg.API.storage.path("/jiberish").exists().then(function (e) {
                t2 = +new Date();
                //assuming 404 is quite stable in terms of response time
                //but the response can be cached and the second one is faster
                expect((t1) ? (t2 - t1) : 0).toBeLessThan(500);
                setTimeout(done, 1000); //wait for quota reset
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });

        });

        it("should not delay calls after the second ended (can fail if connecting to API with QPS is below 2)", function (done) {

            var eg = Egnyte.init(egnyteDomain, {
                token: APIToken,
                oldIEForwarder: true, //opt in for IE8/9 support
                QPS: 1
            });

            //filling up the query queue
            eg.API.storage.path("/jiberish").exists();

            setTimeout(function () {
                var t1 = 0,
                    t2 = 0;

                t1 = +new Date();
                eg.API.storage.path("/jiberish").exists().then(function (e) {
                    t2 = +new Date();
                    //assuming response comes in less than 1000ms
                    expect(t2 - t1).toBeLessThan(1000);
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

            }, 1003);

            setTimeout(function () {
                var t1 = 0,
                    t2 = 0;

                t1 = +new Date();
                eg.API.storage.path("/jiberish").exists().then(function (e) {
                    t2 = +new Date();
                    //assuming response comes in less than 91000ms
                    expect(t2 - t1).toBeGreaterThan(1000);
                    setTimeout(done, 1000); //wait for quota reset
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

            }, 1050);

        });
    });
}

describe("API Quota response", function () {
    //TODO: consider covering multiple API endpoints

    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 10000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; //QA API can be laggy

    });

    if (!ImInBrowser) {
        it("should contain the Expose-Headers header", function (done) {
            var eg = Egnyte.init(egnyteDomain, {
                token: APIToken,
                oldIEForwarder: true, //opt in for IE8/9 support
            });
            eg.API.manual.promiseRequest({
                url: eg.API.manual.getEndpoint() + "/v1/fs/Private",
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.62 Safari/537.36",
                    "Origin": "https://127.0.0.1:9999",
                    "Accept": "*/*",
                    "Referer": "https://127.0.0.1:9999/_SpecRunner.html"
                }
            }).then(function (result) {
                expect(result.response.headers["access-control-allow-origin"]).toEqual("*");
                var allowed = result.response.headers["access-control-expose-headers"].replace(/ /g, "").split(",");
                ["X-Mashery-Error-Code", "X-Egnyte-Upload-Id", "X-Egnyte-Chunk-Num", "X-Egnyte-Chunk-Sha512-Checksum", "X-Sha512-Checksum", "Retry-After", "X-Mashery-Error-Code", "X-Mashery-Responder", "ETag", "Content-Type", "Last-Modified", "Location", "X-Plan-QPS-Allotted", "X-Plan-QPS-Current", "X-PackageKey-QPS-Allotted", "X-PackageKey-QPS-Current", "X-PackageKeyMethod-QPS-Allotted", "X-PackageKeyMethod-QPS-Current", "X-PlanMethod-QPS-Allotted", "X-PlanMethod-QPS-Current", "X-Plan-Quota-Allotted", "X-Plan-Quota-Current", "X-PackageKey-Quota-Allotted", "X-PackageKey-Quota-Current", "X-PackageKeyMethod-Quota-Allotted", "X-PackageKeyMethod-Quota-Current", "X-PlanMethod-Quota-Allotted", "X-PlanMethod-Quota-Current", "X-APIKey-QPS-Allotted", "X-APIKey-QPS-Current", "X-AccessToken-QPS-Allotted", "X-AccessToken-QPS-Current", "X-APIKey-Quota-Allotted", "X-APIKey-Quota-Current", "X-AccessToken-Quota-Allotted", "X-AccessToken-Quota-Current", "X-Quota-Reset", "X-Method-Quota-Reset", "X-Plan-Quota-Reset", "X-Mashery-Responder"].forEach(function (h) {
                    expect(allowed.indexOf(h)).toBeGreaterThan(-1);
                })
                done();
            }).fail(function (e) {
                expect(this).toAutoFail(e);
                done();
            });
        })
    }
    it("headers should be readable", function (done) {
        var eg = Egnyte.init(egnyteDomain, {
            token: APIToken,
            oldIEForwarder: true, //opt in for IE8/9 support
            handleQuota: false //turn off all throttling and retrying in SDK
        });

        var manyRequests = [];
        for (var i = 0; i < 12; i++) {
            manyRequests.push(eg.API.storage.path("/jiberish"+Math.random().toFixed(4)).exists());
        }
        eg.API.manual.Promise.all(manyRequests).then(function () {
            expect(this).toAutoFail("Quota not reached, no 403 response");
            done();
        }, function (error) {
            //here we catch an error from both cases
            var headers = error.response.headers;
            expect(headers["x-mashery-error-code"]).toEqual("ERR_403_DEVELOPER_OVER_QPS");
            expect(headers["retry-after"]).toBeTruthy();
//            expect(headers["x-accesstoken-qps-allotted"]).toBeTruthy();
//            expect(headers["x-accesstoken-qps-current"]).toBeTruthy();

            done();
        });

    });

});
