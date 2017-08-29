module.exports = {
    devtool: "source-map",
    entry: {
        egnyte: "./src/egnyte.browser.js"
    },
    output: {
        path: __dirname + "/dist/",
        filename: "[name].js",
        library: "Egnyte",
        libraryTarget: "umd"
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js"],
    },
    module: {
        rules: [{
            test: /\.jsx|\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    "presets": ["es2015"],
                    "plugins": [
                        [
                            "transform-react-jsx",
                            {
                                "pragma": "h"
                            }
                        ]
                    ]
                }
            }
        }, {
            test: /\.css$/,
            use: "css-loader"
        }]
    },
};
