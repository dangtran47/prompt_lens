# Text Translator Chrome Extension

A Chrome extension that shows a translation icon when text is selected on any webpage.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the extension:

```bash
npm run build
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## Development

To start development with hot reloading:

```bash
npm run dev
```

## Features

- Shows a translation icon when text is selected
- Icon appears next to the selected text
- Click the icon to translate the selected text (translation functionality to be implemented)

## Project Structure

- `src/content.tsx` - Main content script that handles text selection and icon display
- `src/background.ts` - Background script for extension initialization
- `src/content.css` - Styles for the translation icon
- `manifest.json` - Chrome extension configuration
- `webpack.config.js` - Webpack configuration for bundling
- `tsconfig.json` - TypeScript configuration
