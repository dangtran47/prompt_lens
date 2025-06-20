# Prompt Lens - AI Assistant Chrome Extension

A Chromium-based browser extension that shows an AI assistant icon when text is selected on any webpage, enabling translation and custom LLM interactions.

![Demo](assets/demo/gif)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the extension:

```bash
npm run build
```

3. Load the extension in your browser:
   - Open Chrome/Edge/Brave and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## Development

To start development with hot reloading:

```bash
npm run dev
```

## Features

- Shows an AI assistant icon when text is selected
- Icon appears next to the selected text
- Click the icon to:
  - Translate the selected text
  - Process text with custom LLM prompts
  - Access various AI-powered features
- Customizable prompts and AI interactions
- Support for multiple Chromium-based browsers (Chrome, Edge, Brave)

## Project Structure

- `src/content.tsx` - Main content script that handles text selection and icon display
- `src/background.ts` - Background script for extension initialization
- `src/content.css` - Styles for the AI assistant icon
- `src/utils/` - Custom LLM prompts and AI utilities
- `manifest.json` - Browser extension configuration
- `webpack.config.js` - Webpack configuration for bundling
- `tsconfig.json` - TypeScript configuration

## Customization

You can customize the extension by:

- Adding your own LLM prompts in the utils directory
- Configuring different AI models and endpoints
- Customizing the appearance of the AI assistant icon
- Adding new AI-powered features
