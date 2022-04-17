import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import { useDynamicPublicPath } from "vite-plugin-dynamic-publicpath";
import legacy from "@vitejs/plugin-legacy";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },

  plugins: [
    reactRefresh(),
    pluginRewriteAll(),
    legacy({
      targets: ["defaults", "not ie <= 8"],
    }),
    useDynamicPublicPath(),
  ],

  build: {
    target: "es2015",
  },

  define: {
    "process.env": {},
  },
  server: {
    host: "0.0.0.0",
  },
});
