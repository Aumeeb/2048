import * as fs from 'fs';
import * as path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { dev } from './devOption.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
var copy = require('recursive-copy');

//需要被复制的文件夹
const foldersName = ['img', 'css', 'audio'];
const srcPath = path.resolve(__dirname, '..') + '\\' //获取资源路径

const buildPath = path.resolve(__dirname, '../../') + '\\' + dev.outputFolder;


export function copyResources() {
    for (const folderName of foldersName) {

        let from = srcPath + folderName;
        let dest = buildPath + '\\' + folderName;

        console.log('-----------------------');
        console.log(from);
        console.log(dest);
        console.log('-----------------------');

        copy(from, dest, { overwrite: true }, (error: any, results: any) => {
            if (error) {
                console.error('拷贝 : ' + error);
            } else {
                console.info('拷贝了 ' + results.length + ' 文件');
            }
        });

    }

}
