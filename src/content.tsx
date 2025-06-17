import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./components/ui/button";
import { TranslateIcon } from "./components/icons/translate-icon";
import { SummarizeIcon } from "./components/icons/summarize-icon";
import "./styles/globals.css";

interface Config {
  mode: "online" | "local" | null;
  provider: string;
  apiKey: string;
}

// Function to get API endpoint based on provider
const getApiEndpoint = (provider: string): string => {
  switch (provider) {
    case "openai":
      return "https://api.openai.com/v1/chat/completions";
    case "openrouter":
      return "https://openrouter.ai/api/v1/chat/completions";
    case "anthropic":
      return "https://api.anthropic.com/v1/messages";
    case "cohere":
      return "https://api.cohere.ai/v1/generate";
    case "huggingface":
      return "https://api-inference.huggingface.co/models";
    case "replicate":
      return "https://api.replicate.com/v1/predictions";
    case "together":
      return "https://api.together.xyz/inference";
    default:
      return "http://localhost:11434/api/generate"; // Default for custom/local
  }
};

// Function to get model based on provider
const getModel = (provider: string): string => {
  switch (provider) {
    case "openai":
      return "gpt-3.5-turbo";
    case "openrouter":
      return "meta-llama/llama-2-7b-chat";
    case "anthropic":
      return "claude-3-haiku-20240307";
    case "cohere":
      return "command";
    case "huggingface":
      return "microsoft/DialoGPT-medium";
    case "replicate":
      return "meta/llama-2-7b-chat";
    case "together":
      return "togethercomputer/llama-2-7b-chat";
    default:
      return "llama3.1"; // Default for custom/local
  }
};

// Function to translate text using the configured API
const translateText = async (text: string, config: Config) => {
  try {
    const apiEndpoint = getApiEndpoint(config.provider);
    const model = getModel(config.provider);

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        model: model,
        prompt: `Translate the following text to English: "${text}"`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const result = await response.json();
    console.log("Translation result:", result.response || result.content || result);
    // You can display this in a popup or overlay
  } catch (error) {
    console.error("Translation error:", error);
  }
};

// Function to summarize text using the configured API
const summarizeText = async (text: string, config: Config) => {
  try {
    const apiEndpoint = getApiEndpoint(config.provider);
    const model = getModel(config.provider);

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        model: model,
        prompt: `Summarize the following text in a few concise sentences: "${text}"`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Summarization failed");
    }

    const result = await response.json();
    console.log("Summarization result:", result.response || result.content || result);
    // You can display this in a popup or overlay
  } catch (error) {
    console.error("Summarization error:", error);
  }
};

const TranslationButtons: React.FC = () => {
  return (
    <div
      className="flex gap-2 p-2 bg-white shadow-lg rounded-md border border-gray-200"
      style={{ zIndex: 10000 }}
    >
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-gray-100"
        onClick={async () => {
          const selectedText = window.getSelection()?.toString();
          if (selectedText) {
            // Get stored configuration
            chrome.storage.sync.get(["extensionConfig"], (result) => {
              if (result.extensionConfig) {
                const config = JSON.parse(result.extensionConfig);
                if (config.mode === "local" && config.provider) {
                  translateText(selectedText, config);
                } else {
                  console.log("Please configure the extension first");
                }
              } else {
                console.log("Please configure the extension first");
              }
            });
          }
        }}
      >
        <TranslateIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-gray-100"
        onClick={async () => {
          const selectedText = window.getSelection()?.toString();
          if (selectedText) {
            // Get stored configuration
            chrome.storage.sync.get(["extensionConfig"], (result) => {
              if (result.extensionConfig) {
                const config = JSON.parse(result.extensionConfig);
                if (config.mode === "local" && config.provider) {
                  summarizeText(selectedText, config);
                } else {
                  console.log("Please configure the extension first");
                }
              } else {
                console.log("Please configure the extension first");
              }
            });
          }
        }}
      >
        <SummarizeIcon />
      </Button>
    </div>
  );
};

let buttonsContainer: HTMLDivElement | null = null;

const createButtonsContainer = () => {
  if (!buttonsContainer) {
    buttonsContainer = document.createElement("div");
    buttonsContainer.id = "translation-buttons-container";
    buttonsContainer.style.position = "fixed";
    buttonsContainer.style.zIndex = "10000";
    buttonsContainer.style.pointerEvents = "auto";
    document.body.appendChild(buttonsContainer);
    ReactDOM.render(<TranslationButtons />, buttonsContainer);
  }
};

const removeButtonsContainer = () => {
  if (buttonsContainer) {
    ReactDOM.unmountComponentAtNode(buttonsContainer);
    buttonsContainer.remove();
    buttonsContainer = null;
  }
};

const positionButtons = (selection: Selection) => {
  if (!buttonsContainer) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  buttonsContainer.style.position = "fixed";
  buttonsContainer.style.left = `${rect.right + 10}px`;
  buttonsContainer.style.top = `${rect.top - 12}px`;
  buttonsContainer.style.display = "block";
};

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();

  if (selection && selection.toString().trim()) {
    createButtonsContainer();
    positionButtons(selection);
  } else {
    removeButtonsContainer();
  }
});

document.addEventListener("mousedown", (e) => {
  if (buttonsContainer && !buttonsContainer.contains(e.target as Node)) {
    removeButtonsContainer();
  }
});

// Handle scroll to hide buttons
document.addEventListener("scroll", () => {
  removeButtonsContainer();
});

// Handle window resize to hide buttons
window.addEventListener("resize", () => {
  removeButtonsContainer();
});
