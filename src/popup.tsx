import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";
import "./styles/globals.css";

interface Config {
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

interface Model {
  id: string;
  name?: string;
  display_name?: string;
}

const PopupApp: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<"online" | "local" | null>(null);
  const [config, setConfig] = useState<Config>({
    mode: null,
    defaultProvider: "",
    providers: {}
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isSelectingModel, setIsSelectingModel] = useState(false);
  const [currentProviderKey, setCurrentProviderKey] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState("");
  const [editingProvider, setEditingProvider] = useState<string | null>(null);

  // Load saved configuration on component mount
  useEffect(() => {
    chrome.storage.sync.get(["extensionConfig"], (result) => {
      if (result.extensionConfig) {
        const savedConfig = JSON.parse(result.extensionConfig);
        setConfig(savedConfig);
        setCurrentMode(savedConfig.mode);
      }
    });
  }, []);

  // Save configuration to Chrome storage
  const saveConfig = (newConfig: Config) => {
    chrome.storage.sync.set(
      {
        extensionConfig: JSON.stringify(newConfig)
      },
      () => {
        console.log("Configuration saved");
      }
    );
  };

  // Fetch available models from the API
  const fetchModels = async (provider: string, apiKey: string) => {
    setIsLoadingModels(true);
    setModelError("");

    try {
      let models: Model[] = [];

      switch (provider) {
        case "anthropic":
          const anthropicResponse = await fetch("https://api.anthropic.com/v1/models", {
            headers: {
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01"
            }
          });

          if (!anthropicResponse.ok) {
            throw new Error("Failed to fetch Anthropic models");
          }

          const anthropicData = await anthropicResponse.json();
          models = anthropicData.data.map((model: any) => ({
            id: model.id,
            name: model.name,
            display_name: model.display_name
          }));
          break;

        case "openai":
          const openaiResponse = await fetch("https://api.openai.com/v1/models", {
            headers: {
              Authorization: `Bearer ${apiKey}`
            }
          });

          if (!openaiResponse.ok) {
            throw new Error("Failed to fetch OpenAI models");
          }

          const openaiData = await openaiResponse.json();
          models = openaiData.data
            .filter((model: any) => model.id.includes("gpt"))
            .map((model: any) => ({
              id: model.id,
              name: model.id,
              display_name: model.id
            }));
          break;

        case "openrouter":
          const openrouterResponse = await fetch("https://openrouter.ai/api/v1/models", {
            headers: {
              Authorization: `Bearer ${apiKey}`
            }
          });

          if (!openrouterResponse.ok) {
            throw new Error("Failed to fetch OpenRouter models");
          }

          const openrouterData = await openrouterResponse.json();
          models = openrouterData.data.map((model: any) => ({
            id: model.id,
            name: model.name,
            display_name: model.description || model.name
          }));
          break;

        default:
          // For other providers, use default models
          models = getDefaultModels(provider);
          break;
      }

      setModels(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      setModelError("Failed to fetch models. Please check your API key.");
      // Fallback to default models
      setModels(getDefaultModels(provider));
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Get default models for providers that don't support model fetching
  const getDefaultModels = (provider: string): Model[] => {
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
  };

  const handleModeSelect = (mode: "online" | "local") => {
    if (mode === "online") {
      // Online mode is disabled for now
      return;
    }

    setCurrentMode(mode);
    setIsConfiguring(true);
  };

  const addProvider = () => {
    const providerKey = `provider_${Date.now()}`;
    const newConfig = {
      ...config,
      providers: {
        ...config.providers,
        [providerKey]: {
          name: "",
          apiKey: "",
          model: ""
        }
      }
    };
    setConfig(newConfig);
    setEditingProvider(providerKey);
    saveConfig(newConfig);
  };

  const removeProvider = (providerKey: string) => {
    const newProviders = { ...config.providers };
    delete newProviders[providerKey];

    const newConfig = {
      ...config,
      providers: newProviders,
      defaultProvider: config.defaultProvider === providerKey ? "" : config.defaultProvider
    };

    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const setDefaultProvider = (providerKey: string) => {
    const newConfig = {
      ...config,
      defaultProvider: providerKey
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const updateProvider = (providerKey: string, field: string, value: string) => {
    const newConfig = {
      ...config,
      providers: {
        ...config.providers,
        [providerKey]: {
          ...config.providers[providerKey],
          [field]: value
        }
      }
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const startModelSelection = async (providerKey: string) => {
    const provider = config.providers[providerKey];
    if (provider.apiKey) {
      setCurrentProviderKey(providerKey);
      await fetchModels(provider.name, provider.apiKey);
      setIsSelectingModel(true);
    }
  };

  const handleModelSelect = () => {
    if (currentProviderKey && config.providers[currentProviderKey]?.model) {
      // Model is already updated via the Select onChange
      setIsSelectingModel(false);
      setCurrentProviderKey("");
    }
  };

  const resetConfig = () => {
    const resetConfig = {
      mode: null,
      defaultProvider: "",
      providers: {}
    };
    setConfig(resetConfig);
    setCurrentMode(null);
    setIsConfiguring(false);
    setIsSelectingModel(false);
    setModels([]);
    setModelError("");
    setEditingProvider(null);
    saveConfig(resetConfig);
  };

  const getProviderDisplayName = (providerType: string) => {
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

  if (!currentMode && !isConfiguring) {
    return (
      <div className="p-6 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Prompt Lens</h1>
          <p className="text-sm text-gray-600">Choose your preferred mode</p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-12 relative"
            disabled
            onClick={() => handleModeSelect("online")}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-400">Online Mode</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
          </Button>

          <Button
            variant="default"
            className="w-full h-12"
            onClick={() => handleModeSelect("local")}
          >
            <span className="font-medium">Local Mode</span>
          </Button>
        </div>

        {config.mode && Object.keys(config?.providers || {}).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Current Configuration:</div>
            <div className="text-sm text-gray-700">
              Mode: {config.mode} • Providers: {Object.keys(config.providers).length}
              {config.defaultProvider &&
                ` • Default: ${config.providers[config.defaultProvider]?.name || "Unknown"}`}
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={resetConfig}>
              Reset Configuration
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (isConfiguring && currentMode === "local" && !isSelectingModel) {
    return (
      <div className="p-6 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-800 mb-1">API Providers Setup</h1>
          <p className="text-sm text-gray-600">Configure your API providers</p>
        </div>

        <div className="space-y-4">
          {/* Existing Providers */}
          {Object.keys(config?.providers || {}).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Configured Providers
              </label>
              <div className="space-y-2">
                {Object.entries(config.providers).map(([key, provider]) => (
                  <div key={key} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {getProviderDisplayName(provider.name)}
                        </span>
                        {config.defaultProvider === key && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {config.defaultProvider !== key && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultProvider(key)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setEditingProvider(key)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => removeProvider(key)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Model: {provider.model || "Not set"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Provider */}
          <Button variant="outline" className="w-full" onClick={addProvider}>
            + Add New Provider
          </Button>

          {/* Edit Provider Form */}
          {editingProvider && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="text-sm font-medium text-blue-800 mb-3">
                {config.providers[editingProvider]?.name
                  ? `Edit ${getProviderDisplayName(config.providers[editingProvider].name)}`
                  : "Add New Provider"}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">
                    Provider Type
                  </label>
                  <Select
                    value={config.providers[editingProvider]?.name || ""}
                    onChange={(e) => updateProvider(editingProvider, "name", e.target.value)}
                  >
                    <option value="">Choose a provider...</option>
                    <option value="openai">OpenAI</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="cohere">Cohere</option>
                    <option value="huggingface">Hugging Face</option>
                    <option value="replicate">Replicate</option>
                    <option value="together">Together AI</option>
                    <option value="custom">Custom Provider</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">API Key</label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={config.providers[editingProvider]?.apiKey || ""}
                    onChange={(e) => updateProvider(editingProvider, "apiKey", e.target.value)}
                  />
                </div>

                {config.providers[editingProvider]?.model && (
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">
                      Current Model: {config.providers[editingProvider].model}
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
                      onClick={() => startModelSelection(editingProvider)}
                    >
                      Change Model
                    </Button>
                  </div>
                )}

                {config.providers[editingProvider]?.name &&
                  config.providers[editingProvider]?.apiKey &&
                  !config.providers[editingProvider]?.model && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
                      onClick={() => startModelSelection(editingProvider)}
                    >
                      Select Model
                    </Button>
                  )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingProvider(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingProvider(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setIsConfiguring(false);
              setCurrentMode(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={() => setIsConfiguring(false)}
            disabled={Object.keys(config?.providers || {}).length === 0 || !config.defaultProvider}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    );
  }

  if (isSelectingModel) {
    const currentProvider = config.providers[currentProviderKey];

    return (
      <div className="p-6 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-800 mb-1">Select Model</h1>
          <p className="text-sm text-gray-600">
            Choose model for{" "}
            {currentProvider ? getProviderDisplayName(currentProvider.name) : "provider"}
          </p>
        </div>

        {isLoadingModels ? (
          <div className="text-center py-8">
            <div className="text-sm text-gray-600">Loading available models...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {modelError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{modelError}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
              <Select
                value={currentProvider?.model || ""}
                onChange={(e) => updateProvider(currentProviderKey, "model", e.target.value)}
              >
                <option value="">Choose a model...</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.display_name || model.name || model.id}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setIsSelectingModel(false);
              setCurrentProviderKey("");
            }}
          >
            Back
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={handleModelSelect}
            disabled={!currentProvider?.model}
          >
            Save Model
          </Button>
        </div>
      </div>
    );
  }

  // Configuration complete state
  return (
    <div className="p-6 bg-white">
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-800 mb-1">Configuration Complete</h1>
        <p className="text-sm text-gray-600">Your extension is ready to use</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-sm">
          <div className="font-medium text-gray-700">Mode: {config.mode}</div>
          <div className="text-gray-600">
            Providers: {Object.keys(config?.providers || {}).length}
          </div>
          {config.defaultProvider && (
            <div className="text-gray-600">
              Default:{" "}
              {getProviderDisplayName(config.providers[config.defaultProvider]?.name || "")}(
              {config.providers[config.defaultProvider]?.model || "No model"})
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={() => setIsConfiguring(true)}>
          Manage Providers
        </Button>
        <Button variant="outline" className="w-full" onClick={resetConfig}>
          Reset Configuration
        </Button>
      </div>
    </div>
  );
};

ReactDOM.render(<PopupApp />, document.getElementById("popup-root"));
