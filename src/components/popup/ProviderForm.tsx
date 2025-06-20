import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { getProviderDisplayName, getProviderOptions } from "../../utils/providerUtils";
import { ModelsService } from "../../services/modelsService";
import { Model } from "../../types/config";

type Provider = {
  providerKey?: string;
  name: string;
  apiKey: string;
  model: string;
};

interface ProviderFormProps {
  provider?: Provider;
  onCancel: () => void;
  onDone: (provider: Provider) => void;
}

export const ProviderForm: React.FC<ProviderFormProps> = ({
  provider: initialProvider = {
    providerKey: undefined,
    name: "",
    apiKey: "",
    model: ""
  },
  onCancel,
  onDone
}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState("");
  const [provider, setProvider] = useState<Provider>(initialProvider);

  const hasProviderAndKey = provider.name && provider.apiKey;
  const isProviderComplete = provider.name && provider.apiKey && provider.model;

  const onDoneClick = () => {
    console.log("onDoneClick", provider);
    onDone(provider);
  };

  // Fetch models when provider or API key changes
  useEffect(() => {
    const fetchModels = async () => {
      if (provider.name && provider.apiKey) {
        setIsLoadingModels(true);
        setModelError("");

        try {
          const availableModels = await ModelsService.fetchModels(provider.name, provider.apiKey);
          setModels(availableModels);
        } catch (error) {
          console.error("Error fetching models:", error);
          setModelError("Failed to fetch models. Please check your API key.");
          setModels([]);
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        setModels([]);
        setModelError("");
      }
    };

    fetchModels();
  }, [provider.name, provider.apiKey]);

  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <div className="text-sm font-medium text-blue-800 mb-3">
        {initialProvider.providerKey
          ? `Edit ${getProviderDisplayName(initialProvider.name)}`
          : "Add New Provider"}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">Provider Type</label>
          <Select
            value={provider.name || ""}
            onChange={(e) => setProvider({ ...provider, name: e.target.value })}
          >
            <option value="">Choose a provider...</option>
            {getProviderOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">API Key</label>
          <Input
            type="password"
            placeholder="Enter your API key"
            value={provider.apiKey || ""}
            onChange={(e) => setProvider({ ...provider, apiKey: e.target.value })}
          />
        </div>

        {hasProviderAndKey && (
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">Model</label>
            {modelError ? (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{modelError}</div>
            ) : (
              <Select
                value={provider.model || ""}
                onChange={(e) => setProvider({ ...provider, model: e.target.value })}
                disabled={isLoadingModels}
              >
                <option value="">Choose a model...</option>
                {isLoadingModels ? (
                  provider.model && !models.find((m) => m.id === provider.model) ? (
                    <option value={provider.model}>{provider.model}</option>
                  ) : null
                ) : (
                  models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.display_name || model.name || model.id}
                    </option>
                  ))
                )}
              </Select>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={onDoneClick}
          disabled={!isProviderComplete}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
