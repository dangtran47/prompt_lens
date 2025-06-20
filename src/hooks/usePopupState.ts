import { useState, useEffect } from "react";
import { Config } from "../types/config";
import { ConfigService } from "../services/configService";

export const usePopupState = () => {
  const [currentMode, setCurrentMode] = useState<"online" | "local" | null>(null);
  const [config, setConfig] = useState<Config>({
    mode: null,
    defaultProvider: "",
    providers: {}
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
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

  const resetConfig = () => {
    const resetConfig = ConfigService.getDefaultConfig();
    setConfig(resetConfig);
    setCurrentMode(null);
    setIsConfiguring(false);
    setEditingProvider(null);
    saveConfig(resetConfig);
  };

  return {
    // State
    currentMode,
    config,
    isConfiguring,
    editingProvider,

    // Actions
    handleModeSelect,
    addProvider,
    removeProvider,
    setDefaultProvider,
    updateProvider,
    resetConfig,
    setIsConfiguring,
    setEditingProvider,
    setCurrentMode
  };
};
