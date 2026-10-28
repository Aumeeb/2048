# Development Log

## 2026-10-28 — Migrate to Vite, Update Dependencies & Optimize Codebase

### Summary
Migrated build tooling from Webpack 3 to Vite 8, updated all packages to their latest versions, configured VS Code to automatically start the dev server on workspace load, removed dead code, and optimized rendering and board merge performance.

### Details
- **Build & Tooling (`package.json`, `vite.config.ts`, `tsconfig.json`, `.vscode/tasks.json`)**:
  - Replaced `webpack`, `webpack-dev-server`, `ts-loader`, `html-webpack-plugin`, `babel-*`, and `recursive-copy` with `vite` (`^8.3.5`), `typescript` (`^7.0.2`), and `@types/node` (`^26.6.5`).
  - Added `.vscode/tasks.json` with `"runOn": "folderOpen"` to automatically launch `npm run dev` when VS Code opens the project.
  - Replaced `recursive-copy` in `src/server/autotruck.ts` with Node's native `fs.cpSync`, eliminating 28 transitive packages and all `npm audit` vulnerabilities.
- **Dead Code Removal**:
  - Removed unused files: `webpack.config.ts`, `webpack.config.js`, `src/itertor.ts`, `src/festival.ts`, `src/convert.ts`, and `src/svg/emotion.ts`.
  - Removed unused classes, functions, and types across `src/main.ts`, `src/render.ts`, `src/tools.ts`, `src/colors.ts`, `src/option.ts`, and `src/types.ts`.
  - Fixed a missing `break` statement in `Main.setDifficult` for `Difficult.Boss`.
- **Performance Improvements**:
  - **DOM Diffing (`src/render.ts`)**: Built grid elements once using a `DocumentFragment` and cached values in an `Int32Array` (`prevValues`) so `draw()` only updates DOM nodes whose tile values changed, avoiding full DOM teardown/recreation on every keypress.
  - **1D Board Merge (`src/tools.ts`)**: Unified row and column tile merging into a single-pass `combineTiles()` function operating directly on the 1D board array without intermediate 2D array allocations or `Array.prototype.shift()` calls.
  - **Constant-Time Lookups & Audio Reuse (`src/colors.ts`, `src/tools.ts`, `src/audio.ts`)**: Replaced switch statements with $O(1)$ lookup maps and reused a single preloaded `HTMLAudioElement` instance across moves.
