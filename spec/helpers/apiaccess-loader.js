// Load API access configuration and export global variables
// This helper is loaded by Jasmine before all tests

// Initialize testConfig object if it doesn't exist (for pint-runner-environment compatibility)
if (typeof global !== "undefined" && typeof testConfig === "undefined") {
  global.testConfig = {};
}

// Load the configuration file
require("../conf/apiaccess");

// Export global variables from testConfig for backward compatibility with existing tests
if (
  typeof global !== "undefined" &&
  typeof testConfig !== "undefined" &&
  testConfig.apiaccess
) {
  global.egnyteDomain = testConfig.apiaccess.egnyteDomain;
  global.APIToken = testConfig.apiaccess.APIToken;
  global.APIUsername = testConfig.apiaccess.APIUsername || "user";
  global.OtherUsername = testConfig.apiaccess.OtherUsername || "other_user";
  global.existingFile =
    testConfig.apiaccess.existingFile || "/Shared/Documents/test.txt";

  // Optional fields (not in pint-runner-environment config)
  if (typeof APIKey === "undefined") {
    global.APIKey = "12345"; //API key for password grant
  }
  if (typeof APIPassword === "undefined") {
    global.APIPassword = "foo";
  }
  if (typeof APIKeyImplicit === "undefined") {
    global.APIKeyImplicit = "9876543"; //API key for implicit grant
  }
}

