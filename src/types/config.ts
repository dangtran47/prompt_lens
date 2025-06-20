export interface Config {
  mode: "online" | "local" | null;
  defaultProvider: string;
  providers: {
    [key: string]: {
      name: string;
      apiKey: string;
      model: string;
    };
  };
}

export interface Model {
  id: string;
  name?: string;
  display_name?: string;
}

export type ProviderType =
  | "openai"
  | "openrouter"
  | "anthropic"
  | "cohere"
  | "huggingface"
  | "replicate"
  | "together"
  | "custom";

export interface Provider {
  name: string;
  apiKey: string;
  model: string;
}
