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
      return "claude-3-7-sonnet-20250219";
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

// Stream response handler
const handleStreamResponse = async (response: Response, sendMessage: (data: any) => void) => {
  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            sendMessage({ type: "done" });
            return;
          }
          try {
            const parsed = JSON.parse(data);
            sendMessage({ type: "chunk", data: parsed });
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};

// Anthropic API call with streaming
const callAnthropicAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = getApiEndpoint("anthropic");
  const model = getModel("anthropic");

  const prompt = isTranslation
    ? `Translate the following text to Vietnamese: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true
    })
  };

  const response = await fetch(apiEndpoint, request);

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// OpenAI API call with streaming
const callOpenAIAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = getApiEndpoint("openai");
  const model = getModel("openai");

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// OpenRouter API call with streaming
const callOpenRouterAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = getApiEndpoint("openrouter");
  const model = getModel("openrouter");

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// Cohere API call with streaming
const callCohereAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = getApiEndpoint("cohere");
  const model = getModel("cohere");

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// HuggingFace API call with streaming
const callHuggingFaceAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = `${getApiEndpoint("huggingface")}/${getModel("huggingface")}`;

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_length: 1000,
        temperature: 0.7,
        stream: true
      }
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// Replicate API call with streaming
const callReplicateAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = getApiEndpoint("replicate");
  const model = getModel("replicate");

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${config.apiKey}`
    },
    body: JSON.stringify({
      version: model,
      input: {
        prompt: prompt,
        max_length: 1000
      },
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// Together AI API call with streaming
const callTogetherAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = getApiEndpoint("together");
  const model = getModel("together");

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// Local/Ollama API call with streaming
const callLocalAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  const apiEndpoint = getApiEndpoint("local");
  const model = getModel("local");

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  console.log("callLocalAPI", apiEndpoint, model, prompt);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("fetching...");
  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: true
    })
  });

  console.log({ response });
  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  await handleStreamResponse(response, sendMessage);
};

// Main function to handle API calls based on provider
const callAPI = async (
  text: string,
  config: any,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  switch (config.provider) {
    case "anthropic":
      return await callAnthropicAPI(text, config, isTranslation, sendMessage);
    case "openai":
      return await callOpenAIAPI(text, config, isTranslation, sendMessage);
    case "openrouter":
      return await callOpenRouterAPI(text, config, isTranslation, sendMessage);
    case "cohere":
      return await callCohereAPI(text, config, isTranslation, sendMessage);
    case "huggingface":
      return await callHuggingFaceAPI(text, config, isTranslation, sendMessage);
    case "replicate":
      return await callReplicateAPI(text, config, isTranslation, sendMessage);
    case "together":
      return await callTogetherAPI(text, config, isTranslation, sendMessage);
    default:
      return await callLocalAPI(text, config, isTranslation, sendMessage);
  }
};

// Function to translate text using the configured API
const translateText = async (text: string, config: any, sendMessage: (data: any) => void) => {
  try {
    console.log("translateText", config.provider);
    await callAPI(text, config, true, sendMessage);
  } catch (error) {
    console.error("Translation error:", error);
    sendMessage({ type: "error", error: "Translation failed" });
  }
};

// Function to summarize text using the configured API
const summarizeText = async (text: string, config: any, sendMessage: (data: any) => void) => {
  try {
    await callAPI(text, config, false, sendMessage);
  } catch (error) {
    console.error("Summarization error:", error);
    sendMessage({ type: "error", error: "Summarization failed" });
  }
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    console.log("translateText", request.text, request.config);

    // Send initial response to content script
    sendResponse({ success: true, streaming: true });

    // Use sendMessage to communicate with content script instead of port
    const sendStreamMessage = (data: any) => {
      chrome.tabs
        .sendMessage(sender.tab!.id!, {
          type: "stream",
          data: data
        })
        .catch((error) => {
          console.error("Failed to send stream message:", error);
        });
    };

    translateText(request.text, request.config, sendStreamMessage);
    return true;
  } else if (request.action === "summarize") {
    // Send initial response to content script
    sendResponse({ success: true, streaming: true });

    // Use sendMessage to communicate with content script instead of port
    const sendStreamMessage = (data: any) => {
      chrome.tabs
        .sendMessage(sender.tab!.id!, {
          type: "stream",
          data: data
        })
        .catch((error) => {
          console.error("Failed to send stream message:", error);
        });
    };

    summarizeText(request.text, request.config, sendStreamMessage);
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Prompt Lens extension installed");
});
