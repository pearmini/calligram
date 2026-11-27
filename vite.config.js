import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

const dir = fileURLToPath(new URL(".", import.meta.url));

const demos = ["us-map-paper", "yin-yang", "air-text"];

/**
 * One config for three jobs.
 *
 * By default the root is the repository, so the dev server can serve the demos, the test case
 * browser and src/ side by side, and vitest can find the specs.
 *
 * With `--mode site` the root moves to demo/, which is what gets deployed: the landing page
 * becomes the site root and each demo sits one level down, at /yin-yang/ rather than
 * /demo/yin-yang/. The test case browser is left out of that build on purpose.
 */
export default defineConfig(({mode}) => {
  const site = mode === "site";

  return {
    root: site ? resolve(dir, "demo") : dir,
    // public/ lives at the repository root either way, so logo.svg is served at /logo.svg.
    publicDir: resolve(dir, "public"),
    // The demos import the library by its published name, so editing src/ hot-reloads them
    // with no build step, no npm link and no workspace.
    resolve: {
      alias: {calligram: resolve(dir, "src/index.js")},
    },
    optimizeDeps: {
      include: ["ml5"],
    },
    server: {open: "/"},
    build: {
      outDir: resolve(dir, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        input: Object.fromEntries([
          ["main", resolve(dir, "demo/index.html")],
          ...demos.map((name) => [name, resolve(dir, `demo/${name}/index.html`)]),
          ...(site ? [] : [["cases", resolve(dir, "test/index.html")]]),
        ]),
      },
    },
    test: {
      environment: "jsdom",
      include: ["test/**/*.spec.js"],
    },
  };
});
