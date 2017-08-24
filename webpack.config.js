
module.exports = {
    devtool: "source-map",
    entry: {
        egnyte: ""
    },
    output: {
        path: __dirname + "/dist/",
        filename: "[name].js"
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".jsx"],
    },
    module: {
        loaders: [{
            test: /\.jsx|\.js$/,
            exclude: /node_modules/,
            loader: "babel"
        }, {
            test: /\.css$/,
            loader: "css-loader"
        }]
    },
};
