/**
 * Copies built forwarder assets into forwarder/<major>.<minor>/
 * (e.g. version 3.0.0 → forwarder/3.0/, 4.1.2 → forwarder/4.1/).
 * Keeps the destination in sync with package.json version.
 */
const { execSync } = require("child_process");
const path = require("path");

const pkg = require(path.join(__dirname, "..", "package.json"));
const versionNoPatch = pkg.version.replace(/\.[0-9]+$/, "");
const dest = `forwarder/${versionNoPatch}`;

execSync(
  `npx copyfiles -u 1 "dist/slim.js" "dist/slim.min.js" "${dest}/"`,
  { stdio: "inherit" }
);
execSync(
  `npx copyfiles -u 3 "src/lib/api_forwarder/apiForwarder.html" "${dest}/"`,
  { stdio: "inherit" }
);
