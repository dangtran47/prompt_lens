import { Model, ProviderType } from "../types/config";
import { MOCK_CONFIG } from "../config/mockConfig";

export class ModelsService {
  static async fetchModels(provider: string, apiKey: string): Promise<Model[]> {
    if (MOCK_CONFIG.ENABLE_MOCK_MODELS) {
      console.log("Using mock models for", provider);
      return this.getMockModels(provider as ProviderType);
    }

    try {
      let models: Model[] = [];

      switch (provider) {
        case "anthropic":
          models = await this.fetchAnthropicModels(apiKey);
          break;

        case "openai":
          models = await this.fetchOpenAIModels(apiKey);
          break;

        case "openrouter":
          models = await this.fetchOpenRouterModels(apiKey);
          break;

        default:
          models = this.getDefaultModels(provider as ProviderType);
          break;
      }

      return models;
    } catch (error) {
      console.error("Error fetching models:", error);
      // Fallback to default models
      return this.getDefaultModels(provider as ProviderType);
    }
  }

  private static getMockModels(provider: ProviderType): Model[] {
    switch (provider) {
      case "anthropic":
        return [
          {
            id: "claude-3-5-sonnet-20241022",
            name: "Claude 3.5 Sonnet",
            display_name: "Claude 3.5 Sonnet"
          },
          { id: "claude-3-opus-20240229", name: "Claude 3 Opus", display_name: "Claude 3 Opus" },
          {
            id: "claude-3-sonnet-20240229",
            name: "Claude 3 Sonnet",
            display_name: "Claude 3 Sonnet"
          },
          { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", display_name: "Claude 3 Haiku" }
        ];
      case "openai":
        return [
          { id: "gpt-4o", name: "GPT-4o", display_name: "GPT-4o" },
          { id: "gpt-4o-mini", name: "GPT-4o Mini", display_name: "GPT-4o Mini" },
          { id: "gpt-4-turbo", name: "GPT-4 Turbo", display_name: "GPT-4 Turbo" },
          { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", display_name: "GPT-3.5 Turbo" }
        ];
      case "openrouter":
        return [
          { id: "openai/gpt-4o", name: "GPT-4o", display_name: "GPT-4o (via OpenRouter)" },
          {
            id: "anthropic/claude-3-5-sonnet",
            name: "Claude 3.5 Sonnet",
            display_name: "Claude 3.5 Sonnet (via OpenRouter)"
          },
          {
            id: "meta-llama/llama-3.1-8b-instruct",
            name: "Llama 3.1 8B",
            display_name: "Llama 3.1 8B Instruct"
          },
          {
            id: "meta-llama/llama-3.1-70b-instruct",
            name: "Llama 3.1 70B",
            display_name: "Llama 3.1 70B Instruct"
          }
        ];
      default:
        return this.getDefaultModels(provider);
    }
  }

  private static async fetchAnthropicModels(apiKey: string): Promise<Model[]> {
    const response = await fetch("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Anthropic models");
    }

    const data = await response.json();
    return data.data.map((model: any) => ({
      id: model.id,
      name: model.name,
      display_name: model.display_name
    }));
  }

  private static async fetchOpenAIModels(apiKey: string): Promise<Model[]> {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch OpenAI models");
    }

    const data = await response.json();
    return data.data
      .filter((model: any) => model.id.includes("gpt"))
      .map((model: any) => ({
        id: model.id,
        name: model.id,
        display_name: model.id
      }));
  }

  private static async fetchOpenRouterModels(apiKey: string): Promise<Model[]> {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch OpenRouter models");
    }

    const data = await response.json();
    return data.data.map((model: any) => ({
      id: model.id,
      name: model.name,
      display_name: model.description || model.name
    }));
  }

  private static getDefaultModels(provider: ProviderType): Model[] {
    switch (provider) {
      case "cohere":
        return [
          { id: "command", name: "Command", display_name: "Command" },
          { id: "command-light", name: "Command Light", display_name: "Command Light" }
        ];
      case "huggingface":
        return [
          {
            id: "microsoft/DialoGPT-medium",
            name: "DialoGPT Medium",
            display_name: "DialoGPT Medium"
          },
          { id: "gpt2", name: "GPT-2", display_name: "GPT-2" }
        ];
      case "replicate":
        return [
          { id: "meta/llama-2-7b-chat", name: "Llama 2 7B Chat", display_name: "Llama 2 7B Chat" },
          {
            id: "meta/llama-2-13b-chat",
            name: "Llama 2 13B Chat",
            display_name: "Llama 2 13B Chat"
          }
        ];
      case "together":
        return [
          {
            id: "togethercomputer/llama-2-7b-chat",
            name: "Llama 2 7B Chat",
            display_name: "Llama 2 7B Chat"
          },
          {
            id: "togethercomputer/llama-2-13b-chat",
            name: "Llama 2 13B Chat",
            display_name: "Llama 2 13B Chat"
          }
        ];
      default:
        return [
          { id: "llama3.1", name: "Llama 3.1", display_name: "Llama 3.1" },
          { id: "llama3.2", name: "Llama 3.2", display_name: "Llama 3.2" }
        ];
    }
  }
}
