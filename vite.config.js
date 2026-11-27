import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

const dir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
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
    rollupOptions: {
      input: {
        main: resolve(dir, "demo/index.html"),
        "us-map-paper": resolve(dir, "demo/us-map-paper/index.html"),
        "yin-yang": resolve(dir, "demo/yin-yang/index.html"),
        "air-text": resolve(dir, "demo/air-text/index.html"),
        cases: resolve(dir, "test/index.html"),
      },
    },
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.spec.js"],
  },
});
