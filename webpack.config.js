"use strict";
exports.__esModule = true;
var path = require("path");
var devOption_1 = require("./server/devOption");
var config = {
    devtool: 'source-map',
    entry: ['./src/index.ts'],
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
    devServer: {
        contentBase: path.resolve(__dirname, devOption_1.dev.outputFolder),
        host: devOption_1.dev.innerIP,
        compress: true,
        port: devOption_1.dev.port //端口
    }
};
exports["default"] = config;
