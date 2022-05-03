const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const { resolve } = require("path")
const { lib } = require("serverless-webpack")
const { IgnorePlugin } = require("webpack")
module.exports = {
    devtool: lib.webpack.isLocal ? "source-map" : "cheap-source-map",
    entry: lib.entries,
    mode: lib.webpack.isLocal ? "development" : "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                exclude: [[resolve(__dirname, ".webpack"), resolve(__dirname, ".serverless")]],
                options: {
                    experimentalFileCaching: true,
                    transpileOnly: true,
                },
            },
        ],
    },
    optimization: {
        minimize: false,
    },
    plugins: [new IgnorePlugin({ resourceRegExp: /^pg-native$/ }), new ForkTsCheckerWebpackPlugin()],
    resolve: {
        extensions: [".js", ".ts"],
    },
    target: "node",
}
