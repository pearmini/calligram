import commonjs from "@rollup/plugin-commonjs";
import node from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

// Bundles the library and its three dependencies into one UMD file, so a plain
// <script> tag works and exposes the global `cg`. points-on-path is CommonJS,
// hence the commonjs plugin.
const umd = {
  input: "src/index.js",
  output: {format: "umd", name: "cg"},
  plugins: [node(), commonjs()],
};

export default [
  {...umd, output: {...umd.output, file: "dist/calligram.umd.js"}},
  {...umd, output: {...umd.output, file: "dist/calligram.umd.min.js"}, plugins: [...umd.plugins, terser()]},
];
