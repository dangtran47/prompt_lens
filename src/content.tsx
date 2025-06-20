import "./styles/content.css";

interface Config {
  mode: "online" | "local" | null;
  provider: string;
  apiKey: string;
}

// Create and show streaming result popup
const showStreamingResult = () => {
  const popup = document.createElement("div");
  popup.className = "prompt-lens-result-popup";
  popup.innerHTML = `
    <div class="prompt-lens-result-content">
      <div class="prompt-lens-streaming-content">
        <div class="prompt-lens-streaming-text"></div>
        <div class="prompt-lens-streaming-indicator">
          <span class="prompt-lens-dot"></span>
          <span class="prompt-lens-dot"></span>
          <span class="prompt-lens-dot"></span>
        </div>
      </div>
      <button class="prompt-lens-close-btn">×</button>
    </div>
  `;
  document.body.appendChild(popup);

  // Position the result popup to the right of the buttons
  if (buttonsContainer) {
    const buttonRect = buttonsContainer.getBoundingClientRect();
    popup.style.position = "fixed";
    popup.style.left = `${buttonRect.right + 10}px`;
    popup.style.top = `${buttonRect.top}px`;
  }

  const closeBtn = popup.querySelector(".prompt-lens-close-btn");
  closeBtn?.addEventListener("click", () => {
    popup.remove();
  });

  return popup;
};

// Create and show result popup (for non-streaming fallback)
const showResult = (text: string) => {
  const popup = document.createElement("div");
  popup.className = "prompt-lens-result-popup";
  popup.innerHTML = `
    <div class="prompt-lens-result-content">
      <p>${text}</p>
      <button class="prompt-lens-close-btn">×</button>
    </div>
  `;
  document.body.appendChild(popup);

  // Position the result popup to the right of the buttons
  if (buttonsContainer) {
    const buttonRect = buttonsContainer.getBoundingClientRect();
    popup.style.position = "fixed";
    popup.style.left = `${buttonRect.right + 10}px`;
    popup.style.top = `${buttonRect.top}px`;
  }

  const closeBtn = popup.querySelector(".prompt-lens-close-btn");
  closeBtn?.addEventListener("click", () => {
    popup.remove();
  });
};

// Show error message
const showError = (message: string) => {
  const popup = document.createElement("div");
  popup.className = "prompt-lens-error-popup";
  popup.innerHTML = `
    <div class="prompt-lens-error-content">
      <p>${message}</p>
      <button class="prompt-lens-close-btn">×</button>
    </div>
  `;
  document.body.appendChild(popup);

  const closeBtn = popup.querySelector(".prompt-lens-close-btn");
  closeBtn?.addEventListener("click", () => {
    popup.remove();
  });

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (popup.parentNode) {
      popup.remove();
    }
  }, 5000);
};

// Extract text content from streaming response based on provider
const extractTextFromChunk = (chunk: any, provider: string): string => {
  switch (provider) {
    case "openai":
    case "openrouter":
      return chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || "";
    case "anthropic":
      return chunk.content?.[0]?.text || chunk.delta?.text || "";
    case "cohere":
      return chunk.text || chunk.generations?.[0]?.text || "";
    case "huggingface":
      return chunk.generated_text || chunk[0]?.generated_text || "";
    case "replicate":
      return chunk.output || "";
    case "together":
      return chunk.output?.choices?.[0]?.text || "";
    default: // local/ollama
      return chunk.response || chunk.content || "";
  }
};

// Handle streaming response
const handleStreamingResponse = (provider: string) => {
  const popup = showStreamingResult();
  const textElement = popup.querySelector(".prompt-lens-streaming-text") as HTMLElement;
  const indicator = popup.querySelector(".prompt-lens-streaming-indicator") as HTMLElement;
  let fullText = "";

  // Listen for stream messages from background script
  const messageListener = (message: any) => {
    if (message.type === "stream") {
      const streamData = message.data;

      if (streamData.type === "chunk") {
        const chunkText = extractTextFromChunk(streamData.data, provider);
        if (chunkText) {
          fullText += chunkText;
          textElement.textContent = fullText;
        }
      } else if (streamData.type === "done") {
        // Stop loading - hide the streaming indicator
        if (indicator) {
          indicator.style.display = "none";
        }
        // Remove the message listener
        chrome.runtime.onMessage.removeListener(messageListener);
      } else if (streamData.type === "error") {
        showError(streamData.error || "Operation failed");
        popup.remove();
        // Remove the message listener
        chrome.runtime.onMessage.removeListener(messageListener);
      }
    }
  };

  // Add the message listener
  chrome.runtime.onMessage.addListener(messageListener);

  return popup;
};

// Create floating buttons
const createFloatingButtons = () => {
  const container = document.createElement("div");
  container.className = "prompt-lens-buttons";

  // Create translate button with icon
  const translateBtn = document.createElement("button");
  translateBtn.className = "prompt-lens-btn translate-btn";
  translateBtn.title = "Translate";
  translateBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
  `;

  // Create summarize button with icon
  const summarizeBtn = document.createElement("button");
  summarizeBtn.className = "prompt-lens-btn summarize-btn";
  summarizeBtn.title = "Summarize";
  summarizeBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  `;

  container.appendChild(translateBtn);
  container.appendChild(summarizeBtn);
  document.body.appendChild(container);

  translateBtn.addEventListener("click", () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      chrome.storage.sync.get(["extensionConfig"], (result) => {
        if (result.extensionConfig) {
          const config = JSON.parse(result.extensionConfig);
          if (config.mode === "local" && config.provider) {
            // Send message to background script
            chrome.runtime.sendMessage(
              {
                action: "translate",
                text: selectedText,
                config: config
              },
              (response) => {
                if (response.success && response.streaming) {
                  // Handle streaming response
                  handleStreamingResponse(config.provider);
                } else if (response.success) {
                  // Fallback to non-streaming
                  showResult(response.data);
                } else {
                  showError(response.error || "Translation failed");
                }
              }
            );
          } else {
            showError("Please configure the extension first");
          }
        } else {
          showError("Please configure the extension first");
        }
      });
    }
  });

  summarizeBtn.addEventListener("click", () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      chrome.storage.sync.get(["extensionConfig"], (result) => {
        if (result.extensionConfig) {
          const config = JSON.parse(result.extensionConfig);
          if (config.mode === "local" && config.provider) {
            // Send message to background script
            chrome.runtime.sendMessage(
              {
                action: "summarize",
                text: selectedText,
                config: config
              },
              (response) => {
                if (response.success && response.streaming) {
                  // Handle streaming response
                  handleStreamingResponse(config.provider);
                } else if (response.success) {
                  // Fallback to non-streaming
                  showResult(response.data);
                } else {
                  showError(response.error || "Summarization failed");
                }
              }
            );
          } else {
            showError("Please configure the extension first");
          }
        } else {
          showError("Please configure the extension first");
        }
      });
    }
  });

  return container;
};

let buttonsContainer: HTMLDivElement | null = null;

const positionButtons = (selection: Selection) => {
  if (!buttonsContainer) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  buttonsContainer.style.position = "fixed";
  buttonsContainer.style.left = `${rect.right + 10}px`;
  buttonsContainer.style.top = `${rect.top - 12}px`;
  buttonsContainer.style.display = "block";
};

// Remove all result popups
const removeAllResultPopups = () => {
  const resultPopups = document.querySelectorAll(".prompt-lens-result-popup");
  resultPopups.forEach((popup) => popup.remove());
};

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();

  if (selection && selection.toString().trim()) {
    if (!buttonsContainer) {
      buttonsContainer = createFloatingButtons();
    }
    positionButtons(selection);
  } else if (buttonsContainer) {
    buttonsContainer.remove();
    buttonsContainer = null;
    removeAllResultPopups();
  }
});

document.addEventListener("mousedown", (e) => {
  if (buttonsContainer && !buttonsContainer.contains(e.target as Node)) {
    buttonsContainer.remove();
    buttonsContainer = null;
    removeAllResultPopups();
  }
});

// document.addEventListener("scroll", () => {
//   if (buttonsContainer) {
//     buttonsContainer.remove();
//     buttonsContainer = null;
//     removeAllResultPopups();
//   }
// });

window.addEventListener("resize", () => {
  if (buttonsContainer) {
    buttonsContainer.remove();
    buttonsContainer = null;
    removeAllResultPopups();
  }
});
