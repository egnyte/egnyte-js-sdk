module.exports = {
    name: "impersonate",
    execute(opts, input){
        if (!opts.headers) {
            opts.headers = {}
        }
        const data = input.impersonate;
        if (data.username) {
            opts.headers["X-Egnyte-Act-As"] = data.username;
        }
        if (data.email) {
            opts.headers["X-Egnyte-Act-As-Email"] = data.email;
        }
        return opts;
    }
};
