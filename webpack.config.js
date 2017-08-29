
module.exports = {
    devtool: "source-map",
    entry: {
        egnyte: "./src/egnyte.js",
    },
    output: {
        path: __dirname + "/dist/",
        filename: "[name].js"
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js"],
    },
    module: {
        loaders: [{
            test: /\.jsx|\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.css$/,
            loader: "css-loader"
        }]
    },
};
