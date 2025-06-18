import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "manifest.json", dest: "." },
        { src: "icons/icon16.png", dest: "./icons" },
        { src: "icons/icon48.png", dest: "./icons" },
        { src: "icons/icon128.png", dest: "./icons" },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.tsx"),
        background: resolve(__dirname, "src/background.ts"),
        popup: resolve(__dirname, "popup/index.html"),
      },
      output: {
        entryFileNames: "[name].js",
        dir: "dist",
        assetFileNames: "assets/[name][extname]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
