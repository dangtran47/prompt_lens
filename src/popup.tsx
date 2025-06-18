import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";
import "./styles/globals.css";

interface Config {
  mode: "online" | "local" | null;
  provider: string;
  apiKey: string;
}

const PopupApp: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<"online" | "local" | null>(null);
  const [config, setConfig] = useState<Config>({
    mode: null,
    provider: "",
    apiKey: ""
  });
  const [isConfiguring, setIsConfiguring] = useState(false);

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

  const handleModeSelect = (mode: "online" | "local") => {
    if (mode === "online") {
      // Online mode is disabled for now
      return;
    }

    setCurrentMode(mode);
    setIsConfiguring(true);
  };

  const handleConfigSave = () => {
    const newConfig = {
      ...config,
      mode: currentMode
    };
    setConfig(newConfig);
    saveConfig(newConfig);
    setIsConfiguring(false);
  };

  const handleConfigChange = (field: keyof Config, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const resetConfig = () => {
    const resetConfig = {
      mode: null,
      provider: "",
      apiKey: ""
    };
    setConfig(resetConfig);
    setCurrentMode(null);
    setIsConfiguring(false);
    saveConfig(resetConfig);
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

        {config.mode && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Current Configuration:</div>
            <div className="text-sm text-gray-700">
              Mode: {config.mode} {config.provider && `• Provider: ${config.provider}`}
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={resetConfig}>
              Reset Configuration
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (isConfiguring && currentMode === "local") {
    return (
      <div className="p-6 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-800 mb-1">Local Mode Setup</h1>
          <p className="text-sm text-gray-600">Configure your API key provider</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select API Key Provider
            </label>
            <Select
              value={config.provider}
              onChange={(e) => handleConfigChange("provider", e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <Input
              type="password"
              placeholder="Enter your API key"
              value={config.apiKey}
              onChange={(e) => handleConfigChange("apiKey", e.target.value)}
            />
          </div>
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
            onClick={handleConfigSave}
            disabled={!config.provider || !config.apiKey}
          >
            Save
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
          <div className="text-gray-600">Provider: {config.provider}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={() => setIsConfiguring(true)}>
          Edit Configuration
        </Button>
        <Button variant="outline" className="w-full" onClick={resetConfig}>
          Reset to Mode Selection
        </Button>
      </div>
    </div>
  );
};

ReactDOM.render(<PopupApp />, document.getElementById("popup-root"));
