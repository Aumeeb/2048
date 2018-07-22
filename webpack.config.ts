import * as webpack from "webpack";
import * as path from "path";
import * as  HtmlWebpackPlugin from "html-webpack-plugin";
import {  copyResources } from "./src/server/autotruck";

import { dev } from './src/server/devOption'


copyResources();



const config: webpack.Configuration = {
    devtool: 'source-map',
    entry: ['./src/start.ts'],

    output: {
        path: path.resolve(__dirname, dev.outputFolder), //获取当前路径
        filename: 'bundle.js', //文件名
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['*', '.ts', '.js']
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
        ],

    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template : './src/index.html'
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, dev.outputFolder),//文件地址
        host: dev.innerIP, //IP地址
        compress: true, //服务器压缩
        port: dev.port //端口
    }
};

export default config;

