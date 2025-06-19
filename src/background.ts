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

// Anthropic API call
const callAnthropicAPI = async (text: string, config: any, isTranslation: boolean) => {
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
      ]
    })
  };

  const response = await fetch(apiEndpoint, request);

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result.content?.[0]?.text || result.content || result;
};

// OpenAI API call
const callOpenAIAPI = async (text: string, config: any, isTranslation: boolean) => {
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
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || result.content || result;
};

// OpenRouter API call
const callOpenRouterAPI = async (text: string, config: any, isTranslation: boolean) => {
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
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || result.content || result;
};

// Cohere API call
const callCohereAPI = async (text: string, config: any, isTranslation: boolean) => {
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
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result.generations?.[0]?.text || result.content || result;
};

// HuggingFace API call
const callHuggingFaceAPI = async (text: string, config: any, isTranslation: boolean) => {
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
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result[0]?.generated_text || result.content || result;
};

// Replicate API call
const callReplicateAPI = async (text: string, config: any, isTranslation: boolean) => {
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
      }
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result.output || result.content || result;
};

// Together AI API call
const callTogetherAPI = async (text: string, config: any, isTranslation: boolean) => {
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
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result.output?.choices?.[0]?.text || result.content || result;
};

// Local/Ollama API call
const callLocalAPI = async (text: string, config: any, isTranslation: boolean) => {
  const apiEndpoint = getApiEndpoint("local");
  const model = getModel("local");

  const prompt = isTranslation
    ? `Translate the following text to English: "${text}"`
    : `Summarize the following text in a few concise sentences: "${text}"`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`${isTranslation ? "Translation" : "Summarization"} failed`);
  }

  const result = await response.json();
  return result.response || result.content || result;
};

// Main function to handle API calls based on provider
const callAPI = async (text: string, config: any, isTranslation: boolean) => {
  switch (config.provider) {
    case "anthropic":
      return await callAnthropicAPI(text, config, isTranslation);
    case "openai":
      return await callOpenAIAPI(text, config, isTranslation);
    case "openrouter":
      return await callOpenRouterAPI(text, config, isTranslation);
    case "cohere":
      return await callCohereAPI(text, config, isTranslation);
    case "huggingface":
      return await callHuggingFaceAPI(text, config, isTranslation);
    case "replicate":
      return await callReplicateAPI(text, config, isTranslation);
    case "together":
      return await callTogetherAPI(text, config, isTranslation);
    default:
      return await callLocalAPI(text, config, isTranslation);
  }
};

// Function to translate text using the configured API
const translateText = async (text: string, config: any) => {
  try {
    console.log("translateText", config.provider);
    const result = await callAPI(text, config, true);
    return { success: true, data: result };
  } catch (error) {
    console.error("Translation error:", error);
    return { success: false, error: "Translation failed" };
  }
};

// Function to summarize text using the configured API
const summarizeText = async (text: string, config: any) => {
  try {
    const result = await callAPI(text, config, false);
    return { success: true, data: result };
  } catch (error) {
    console.error("Summarization error:", error);
    return { success: false, error: "Summarization failed" };
  }
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    console.log("translateText", request.text, request.config);
    translateText(request.text, request.config).then(sendResponse);
    return true; // Keep the message channel open for async response
  } else if (request.action === "summarize") {
    summarizeText(request.text, request.config).then(sendResponse);
    return true; // Keep the message channel open for async response
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Prompt Lens extension installed");
});
