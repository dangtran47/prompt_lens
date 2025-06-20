import { Model, ProviderType } from "../types/config";

export class ModelsService {
  static async fetchModels(provider: string, apiKey: string): Promise<Model[]> {
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
