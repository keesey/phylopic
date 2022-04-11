import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import { resolve as _resolve } from "path"
import { lib } from "serverless-webpack"
import { IgnorePlugin } from "webpack"
export const devtool = lib.webpack.isLocal ? "source-map" : "cheap-source-map"
export const entry = lib.entries
export const mode = lib.webpack.isLocal ? "development" : "production"
export const module = {
    rules: [
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: "ts-loader",
            exclude: [[_resolve(__dirname, ".webpack"), _resolve(__dirname, ".serverless")]],
            options: {
                experimentalFileCaching: true,
                transpileOnly: true,
            },
        },
    ],
}
export const optimization = {
    minimize: false,
}
export const plugins = [new IgnorePlugin({ resourceRegExp: /^pg-native$/ }), new ForkTsCheckerWebpackPlugin()]
export const resolve = {
    extensions: [".js", ".ts"],
}
export const target = "node"
