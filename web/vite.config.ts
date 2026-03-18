import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  // `@r2/hack` is the Deno self-referential package name from deno.json.
  // Vite/Rollup don't read Deno's import map, so we alias it explicitly
  // to the repo's main.ts entry point.
  resolve: {
    alias: {
      "@r2/hack": resolve(__dirname, "../main.ts"),
    },
  },

  server: {
    host: true,
    port: 3000,
    fs: {
      allow: [".."],
    },
    hmr: false
  },
});
