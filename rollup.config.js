import {readFileSync} from "node:fs";

import commonjs from "@rollup/plugin-commonjs";
import node from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

// Bundles the library and its three dependencies into one file, so a plain <script>
// tag works and exposes the global `cg`. points-on-path is CommonJS, hence the
// commonjs plugin.
//
// Two copies of the same bundle ship. The .js one is for browsers; the .cjs one is
// what `require("calligram")` resolves to, because this package is type: module, so
// Node reads a .js file as ESM and a UMD file parsed as ESM exports nothing at all.

// The bundle carries three MIT dependencies, and MIT asks for the notice to travel
// with the code.
const {version} = JSON.parse(readFileSync(new URL("package.json", import.meta.url)));

const banner = `/*!
 * Calligram v${version} — https://github.com/pearmini/calligram
 * Copyright (c) 2025-Present Bairui SU. MIT licence.
 *
 * Bundled dependencies, each MIT licensed:
 *   @chenglou/pretext  Copyright (c) Cheng Lou         https://github.com/chenglou/pretext
 *   points-on-path     Copyright (c) Preet Shihn       https://github.com/pshihn/points-on-path
 *   hachure-fill       Copyright (c) Preet Shihn       https://github.com/pshihn/hachure-fill
 */`;

const umd = {
  input: "src/index.js",
  output: {format: "umd", name: "cg", banner},
  plugins: [node(), commonjs()],
};

export default [
  {...umd, output: {...umd.output, file: "dist/calligram.umd.js"}},
  {...umd, output: {...umd.output, file: "dist/calligram.umd.cjs"}},
  {
    ...umd,
    output: {...umd.output, file: "dist/calligram.umd.min.js"},
    // `comments: "some"` keeps the banner, which is the point of having one.
    plugins: [...umd.plugins, terser({format: {comments: "some"}})],
  },
];
