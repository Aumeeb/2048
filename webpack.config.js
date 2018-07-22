"use strict";
exports.__esModule = true;
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var autotruck_1 = require("./src/server/autotruck");
var devOption_1 = require("./src/server/devOption");
autotruck_1.copyResources();
var config = {
    devtool: 'source-map',
    entry: ['./src/start.ts'],
    output: {
        path: path.resolve(__dirname, devOption_1.dev.outputFolder),
        filename: 'bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['*', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html'
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, devOption_1.dev.outputFolder),
        host: devOption_1.dev.innerIP,
        compress: true,
        port: devOption_1.dev.port //端口
    }
};
exports["default"] = config;
