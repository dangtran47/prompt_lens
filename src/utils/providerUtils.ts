export const getProviderDisplayName = (providerType: string): string => {
  const names: { [key: string]: string } = {
    openai: "OpenAI",
    openrouter: "OpenRouter",
    anthropic: "Anthropic",
    cohere: "Cohere",
    huggingface: "Hugging Face",
    replicate: "Replicate",
    together: "Together AI",
    custom: "Custom Provider"
  };
  return names[providerType] || providerType;
};

export const getProviderOptions = (): { value: string; label: string }[] => [
  { value: "anthropic", label: "Anthropic" },
  { value: "openai", label: "OpenAI" }
  // { value: "openrouter", label: "OpenRouter" },
  // { value: "cohere", label: "Cohere" },
  // { value: "huggingface", label: "Hugging Face" },
  // { value: "replicate", label: "Replicate" },
  // { value: "together", label: "Together AI" },
  // { value: "custom", label: "Custom Provider" },
];
