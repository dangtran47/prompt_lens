import { copyFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const filesToCopy = [
  ["manifest.json", "dist/manifest.json"],
  ["icons/icon16.png", "dist/icons/icon16.png"],
  ["icons/icon48.png", "dist/icons/icon48.png"],
  ["icons/icon128.png", "dist/icons/icon128.png"],
  ["dist/assets/content.css", "dist/assets/content.css"]
];

// Create dist directory if it doesn't exist
mkdirSync("dist", { recursive: true });
mkdirSync("dist/icons", { recursive: true });
mkdirSync("dist/assets", { recursive: true });

// Copy files
filesToCopy.forEach(([src, dest]) => {
  try {
    copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src}:`, error);
  }
});
