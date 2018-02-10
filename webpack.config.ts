import * as webpack from "webpack";
import * as path from 'path';
import { dev } from './server/devOption'





 
const config: webpack.Configuration = {
    devtool: 'source-map',
    entry: ['./src/index.tsx'],
    
    output: {
        path: path.resolve(__dirname, dev.outputFolder), //获取当前路径
        filename: 'bundle.js', //文件名
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['*', '.ts', '.js','.tsx']
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.tsx$/, loader:  'babel-loader!ts-loader' },
        
        ],

    },
    devServer: {
        contentBase: path.resolve(__dirname, dev.outputFolder),//文件地址
        host: dev.innerIP, //IP地址
        compress: true, //服务器压缩
        port: dev.port //端口
    }
};

export default config;

