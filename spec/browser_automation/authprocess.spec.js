var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var stream = require('stream')
    var concat = require('concat-stream')
    Egnyte = require("../../src/slim");
    var ENDPOINTS_tokenauth = require("../../src/lib/enum/endpoints").tokenauth;
    require("../conf/apiaccess");
    require("../helpers/matchers");
    var Browser = require("zombie");

    process.setMaxListeners(0);


    describe("API auth functional", function () {



        beforeEach(function () {
            jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
        });


        if (typeof APIPassword !== "undefined" && typeof APIKeyImplicit !== "undefined") {
            describe("Implicit grant without sessions", function () {
                var browser = new Browser({
                    debug: false
                });
                browser.runScripts = true;
                browser.deleteCookies();


                it("should work with login and password", function (done) {
                    var authpage = egnyteDomain + ENDPOINTS_tokenauth + "?client_id=" + APIKeyImplicit + "&mobile=1&redirect_uri=https://example.com/"
                    browser.visit(authpage, function (err) {
                        var response = browser.resources.reverse()[0].response;
                        if (err && response.statusCode !== 200) {
                            expect(this).toAutoFail(err.message + "\n[http body]\n" + response.body.toString());
                            done();
                        } else {
                            expect(browser.success).toBe(true);
                            expect(browser.query("#userInSession")).toBeTruthy();
                            expect(browser.query("#userInSession").value).toBe("false");

                            browser
                                .fill("#j_username", APIUsername)
                                .fill("#j_password", APIPassword);

                            browser.pressButton("#btnSubmit", function (err) {
                                //check stuff
                                if (err) {
                                    expect(this).toAutoFail(err);
                                } else {
                                    var authRequest = browser.resources.filter(function (re) {
                                        return re.request && re.request.url.match(/puboauth\/authenticate/);
                                    }).reverse()[0];

                                    expect(authRequest).toBeTruthy();
                                    expect(authRequest.response.url).not.toMatch(/error=access_denied/);
                                    expect(authRequest.response.url).toMatch(/type=bearer/);
                                }
                                done();
                            });
                        }
                    });


                });
            });
            describe("Implicit grant with session", function () {
                var browser = new Browser({
                    debug: false
                });
                browser.runScripts = true;
                browser.deleteCookies();


                it('needs a session with Egnyte', function (done) {
                    browser.visit(egnyteDomain, function () {
                        var groupName = egnyteDomain.split('.')[0];
                        //perform login call without loading the whole UI
                        //sorry for the blob, just emulating the form
                        browser.resources.post(egnyteDomain + "/loginDomain.do", {
                            body: 'user.userName=' + APIUsername + '&user.password=' + APIPassword + '&subdomainUserLogin=subdomainUserLogin&com.egnyte.subdomain=' + groupName + '&com.egnyte.activationCode=+&ref=&redirectUrl=&reportName=null&requestId=null&timeZoneOffset=-60&pageType=login&hidPlanType=&subscribers=&totalStandardUsers=&hidPaymentType=&hidElcEnabled=&storage=&hidVersionId=&hidNASInstances=&hidPromoCode=&hidResellerCode=&hidSubDomainName=' + groupName + '&hidShowOldGrid=false&hidPlanNum=1&loadType=init&schemeType=&hidSchemeType=&hidSchemeTypeVal=&plan=&monthlyPricing=&yearlyPricing=&hidTotalCost=&hidHasPlanChanges=false&hidLinkUrlToProceed=&hidTabId=&hidTabBodyId=&userCount=&normalPrice=&specialType=&standardUsers=&standardAccounts=4&totalLicenseMemebers=&hidLocalCloudCost=&hidPlanVersionId=&hidCurrPlanVersionId=&txtExtraPUCount=0&hidOlcEnabled=&hidOlcCost=&hidTrialEndDate=&hidNextPaymentDate=&hidHasPackageBands=false&hidCurrPackBandIndex=-1&hidPaymentType=&hidActualCost=&hidNASDevices=&hidOrgPlanType=&org_subscribers=&org_userCount=&org_storage=&hidOrgElcEnabled=&hidSharedFolderSize=0.0&hidPrivateFolderSize=0.0&hidOrgPaymentType=&hidSubscriptionType=&hidActionExecuted='
                        }, function (err) {
                            if (err) {
                                expect(this).toAutoFail(err);
                            }
                            done();
                        });



                    });

                });

                it("should work without login and password", function (done) {
                    var authpage = egnyteDomain + ENDPOINTS_tokenauth + "?client_id=" + APIKeyImplicit + "&mobile=1&redirect_uri=https://example.com/"
                    browser.visit(authpage, function (err) {
                        var response = browser.resources.reverse()[0].response;
                        if (err && response.statusCode !== 200) {
                            expect(this).toAutoFail(err.message + "\n[http body]\n" + response.body.toString());
                            done();
                        } else {
                            //console.log(err);
                            expect(browser.success).toBe(true);
                            expect(browser.query("#userInSession").value).toBe("true");
                            browser.pressButton("#btnSubmit", function (err) {
                                //check stuff
                                if (err) {
                                    expect(this).toAutoFail(err);
                                } else {
                                    var authRequest = browser.resources.filter(function (re) {
                                        return re.request && re.request.url.match(/puboauth\/authenticate/);
                                    }).reverse()[0];


                                    expect(authRequest).toBeTruthy();
                                    expect(authRequest.response.url).not.toMatch(/error=access_denied/);
                                    expect(authRequest.response.url).toMatch(/type=bearer/);
                                }
                                done();
                            });
                        }
                    });


                });
            });
        }


    });

}