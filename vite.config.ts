import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.tsx"),
        background: resolve(__dirname, "src/background.ts")
      },
      output: {
        entryFileNames: "[name].js",
        dir: "dist",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "assets/content.css";
          }
          return "assets/[name][extname]";
        }
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
