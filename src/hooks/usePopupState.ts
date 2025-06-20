import { useState, useEffect } from "react";
import { Config } from "../types/config";
import { ConfigService } from "../services/configService";
import keys from "lodash/fp/keys";

type Provider = {
  providerKey?: string;
  name: string;
  apiKey: string;
  model: string;
};

const isProviderComplete = (provider: Provider) => {
  return !!(provider.name && provider.apiKey && provider.model);
};

export const usePopupState = () => {
  const [currentMode, setCurrentMode] = useState<"online" | "local" | null>(null);
  const [config, setConfig] = useState<Config>({
    mode: null,
    defaultProvider: "",
    providers: {}
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [editingProviderData, setEditingProviderData] = useState<{
    key: string;
    data: { name: string; apiKey: string; model: string };
  } | null>(null);

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

  // Only show complete providers
  const getCompleteProviders = () => {
    const filtered = Object.fromEntries(
      Object.entries(config.providers).filter(([, provider]) => isProviderComplete(provider))
    );
    return filtered;
  };

  const handleModeSelect = (mode: "online" | "local") => {
    if (mode === "online") {
      // Online mode is disabled for now
      return;
    }
    setCurrentMode(mode);
    setIsConfiguring(true);
  };

  // Remove provider from config
  const removeProvider = (providerKey: string) => {
    const newProviders = { ...config.providers };
    delete newProviders[providerKey];
    const newConfig = {
      ...config,
      providers: newProviders,
      defaultProvider:
        config.defaultProvider === providerKey ? keys(newProviders)[0] : config.defaultProvider
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Set default provider
  const setDefaultProvider = (providerKey: string) => {
    const newConfig = {
      ...config,
      defaultProvider: providerKey
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Start editing an existing provider
  const addOrUpdateProvider = (provider: Provider) => {
    const providerKey = provider.providerKey || `provider_${Date.now()}`;
    const newProviders = { ...config.providers, [providerKey]: provider };
    const newConfig = {
      ...config,
      providers: newProviders
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
    setEditingProviderData(null);
    saveConfig(resetConfig);
  };

  return {
    // State
    currentMode,
    config: { ...config, providers: getCompleteProviders() },
    isConfiguring,
    editingProvider,
    editingProviderData,

    // Actions
    handleModeSelect,
    addOrUpdateProvider,
    removeProvider,
    setDefaultProvider,
    resetConfig,
    setIsConfiguring,
    setCurrentMode
  };
};
