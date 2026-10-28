import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dev } from "./devOption.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//需要被复制的文件夹
const foldersName = ["img", "css", "audio"];
const srcPath = path.resolve(__dirname, ".."); //获取资源路径
const buildPath = path.resolve(__dirname, "../../", dev.outputFolder);

export function copyResources(): void {
    for (const folderName of foldersName) {
        const from = path.join(srcPath, folderName);
        const dest = path.join(buildPath, folderName);
        fs.cpSync(from, dest, { recursive: true, force: true });
    }
}
