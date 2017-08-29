const core = require("./core");
core.plug(require("./api/auth"));
core.plug(require("./api/fs"));
core.plug(require("./api/fs-browser"));
core.plug(require("./api/links"));
core.plug(require("./api/users"));
core.plug(require("./api/permissions"))
window.Egnyte = require("./index");
