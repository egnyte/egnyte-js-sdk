var ImInBrowser = typeof window !== "undefined";

if (!ImInBrowser) {
  Egnyte = require("../src/slim");
  require("./helpers/matchers");

  process.setMaxListeners(0);
}

describe("Notes API request building / ", function () {
  //names the SDK declares supported in spec/api_storagefilenames.spec.js
  var namesNeedingEscape = [
    "Q3 report.txt",
    "fifty%.txt",
    "#bang#bang.txt",
    "Русские Буквы.txt",
    "allAtOnce-. _~!$&'(),;=@^][`+#",
  ];

  var lastRequest;

  //a request implementation that captures the request instead of sending it,
  //using the documented httpRequest option
  function captureRequest(opts, callback) {
    lastRequest = opts;
    callback(
      null,
      {
        statusCode: 200,
        headers: {},
        body: {
          notes: [],
        },
      },
      {
        notes: [],
      }
    );
    return {
      abort: function () {},
    };
  }

  var eg = Egnyte.init("https://acme.egnyte.com", {
    token: "token",
    QPS: 100,
    httpRequest: captureRequest,
  });

  function fileParamOf(url) {
    var query = url.split("?")[1] || "";
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i].indexOf("file=") === 0) {
        return pairs[i].slice("file=".length);
      }
    }
    return null;
  }

  beforeEach(function () {
    lastRequest = null;
  });

  namesNeedingEscape.forEach(function (fname) {
    it("sends a single-encoded file param for " + fname, function (done) {
      var path = "/Shared/SDKTests/" + fname;
      eg.API.notes
        .path(path)
        .listNotes()
        .then(function () {
          expect(decodeURIComponent(fileParamOf(lastRequest.url))).toBe(path);
          done();
        })
        .fail(function (e) {
          expect(this).toAutoFail(e);
          done();
        });
    });
  });

  it("sends a single-encoded file param for a name with nothing to escape", function (done) {
    var path = "/Shared/SDKTests/plain.txt";
    eg.API.notes
      .path(path)
      .listNotes()
      .then(function () {
        expect(fileParamOf(lastRequest.url)).toBe(
          "%2FShared%2FSDKTests%2Fplain.txt"
        );
        done();
      })
      .fail(function (e) {
        expect(this).toAutoFail(e);
        done();
      });
  });

  it("keeps caller supplied params alongside the file param", function (done) {
    eg.API.notes
      .path("/Shared/SDKTests/Q3 report.txt")
      .listNotes({
        count: 1,
        offset: 1,
      })
      .then(function () {
        expect(decodeURIComponent(fileParamOf(lastRequest.url))).toBe(
          "/Shared/SDKTests/Q3 report.txt"
        );
        expect(lastRequest.url).toContain("count=1");
        expect(lastRequest.url).toContain("offset=1");
        done();
      })
      .fail(function (e) {
        expect(this).toAutoFail(e);
        done();
      });
  });

  it("still puts the note id in the url path for getNote", function (done) {
    eg.API.notes
      .getNote("note id#1")
      .then(function () {
        expect(lastRequest.url).toContain("/v1/notes/note%20id%231");
        done();
      })
      .fail(function (e) {
        expect(this).toAutoFail(e);
        done();
      });
  });
});
