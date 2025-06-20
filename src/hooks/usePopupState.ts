import { useState, useEffect } from "react";
import { Config, Model } from "../types/config";
import { ConfigService } from "../services/configService";
import { ModelsService } from "../services/modelsService";

export const usePopupState = () => {
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
    const loadConfig = async () => {
      const savedConfig = await ConfigService.loadConfig();
      setConfig(savedConfig);
      setCurrentMode(savedConfig.mode);
    };
    loadConfig();
  }, []);

  // Save configuration to Chrome storage
  const saveConfig = async (newConfig: Config) => {
    await ConfigService.saveConfig(newConfig);
  };

  // Fetch available models from the API
  const fetchModels = async (provider: string, apiKey: string) => {
    setIsLoadingModels(true);
    setModelError("");

    try {
      const models = await ModelsService.fetchModels(provider, apiKey);
      setModels(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      setModelError("Failed to fetch models. Please check your API key.");
    } finally {
      setIsLoadingModels(false);
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
    const resetConfig = ConfigService.getDefaultConfig();
    setConfig(resetConfig);
    setCurrentMode(null);
    setIsConfiguring(false);
    setIsSelectingModel(false);
    setModels([]);
    setModelError("");
    setEditingProvider(null);
    saveConfig(resetConfig);
  };

  return {
    // State
    currentMode,
    config,
    isConfiguring,
    isSelectingModel,
    currentProviderKey,
    models,
    isLoadingModels,
    modelError,
    editingProvider,

    // Actions
    handleModeSelect,
    addProvider,
    removeProvider,
    setDefaultProvider,
    updateProvider,
    startModelSelection,
    handleModelSelect,
    resetConfig,
    setIsConfiguring,
    setEditingProvider,
    setCurrentProviderKey,
    setIsSelectingModel,
    setCurrentMode
  };
};
