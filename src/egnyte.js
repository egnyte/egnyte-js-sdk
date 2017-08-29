const core = require("./core");
core.plug(require("./api/auth"));
core.plug(require("./api/fs"));
core.plug(require("./api/fs-browser"));
core.plug(require("./api/links"));
core.plug(require("./api/users"));
window.Egnyte = require("./index");
