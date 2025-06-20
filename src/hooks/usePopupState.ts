import { useState, useEffect } from "react";
import { Config } from "../types/config";
import { ConfigService } from "../services/configService";

const isProviderComplete = (provider: { name: string; apiKey: string; model: string }) => {
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

  // Start adding a new provider (do not add to config yet)
  const addProvider = () => {
    const providerKey = `provider_${Date.now()}`;
    setEditingProvider(providerKey);
    setEditingProviderData({
      key: providerKey,
      data: { name: "", apiKey: "", model: "" }
    });
  };

  // Remove provider from config
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
  const editProvider = (providerKey: string) => {
    const existingProvider = config.providers[providerKey];
    if (existingProvider) {
      setEditingProvider(providerKey);
      setEditingProviderData({
        key: providerKey,
        data: { ...existingProvider }
      });
    }
  };

  // Update local editing provider data
  const updateProvider = (providerKey: string, field: string, value: string) => {
    if (editingProviderData && editingProviderData.key === providerKey) {
      setEditingProviderData({
        key: providerKey,
        data: { ...editingProviderData.data, [field]: value }
      });
    } else {
      // Editing an existing provider (make a local copy if not already)
      setEditingProvider(providerKey);
      setEditingProviderData({
        key: providerKey,
        data: { ...config.providers[providerKey], [field]: value }
      });
    }
  };

  // Save provider to config if complete
  const saveEditingProvider = () => {
    if (editingProviderData && isProviderComplete(editingProviderData.data)) {
      const newConfig = {
        ...config,
        providers: {
          ...config.providers,
          [editingProviderData.key]: editingProviderData.data
        }
      };
      setConfig(newConfig);
      saveConfig(newConfig);
      setEditingProvider(null);
      setEditingProviderData(null);
    }
  };

  // Cancel editing/adding provider
  const cancelEditingProvider = () => {
    setEditingProvider(null);
    setEditingProviderData(null);
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
    addProvider,
    removeProvider,
    setDefaultProvider,
    editProvider,
    updateProvider,
    saveEditingProvider,
    cancelEditingProvider,
    resetConfig,
    setIsConfiguring,
    setEditingProvider,
    setCurrentMode
  };
};
