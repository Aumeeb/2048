import { defineConfig } from "vite";
import * as path from "path";
import { fileURLToPath } from "url";
import { copyResources } from "./src/server/autotruck.ts";
import { dev } from "./src/server/devOption.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: "src",
    base: "./",
    server: {
        host: dev.innerIP,
        port: Number(dev.port),
        open: true,
    },
    build: {
        outDir: path.resolve(__dirname, dev.outputFolder),
        emptyOutDir: true,
    },
    plugins: [
        {
            name: "copy-resources",
            closeBundle() {
                copyResources();
            },
        },
    ],
});
