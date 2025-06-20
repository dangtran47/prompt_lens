import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { getProviderDisplayName, getProviderOptions } from "../../utils/providerUtils";

interface ProviderFormProps {
  providerKey: string;
  provider: {
    name: string;
    apiKey: string;
    model: string;
  };
  onUpdateProvider: (providerKey: string, field: string, value: string) => void;
  onStartModelSelection: (providerKey: string) => void;
  onCancel: () => void;
  onDone: () => void;
}

export const ProviderForm: React.FC<ProviderFormProps> = ({
  providerKey,
  provider,
  onUpdateProvider,
  onStartModelSelection,
  onCancel,
  onDone
}) => {
  const hasProviderAndKey = provider.name && provider.apiKey;
  const hasModel = provider.model;

  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <div className="text-sm font-medium text-blue-800 mb-3">
        {provider.name ? `Edit ${getProviderDisplayName(provider.name)}` : "Add New Provider"}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">Provider Type</label>
          <Select
            value={provider.name || ""}
            onChange={(e) => onUpdateProvider(providerKey, "name", e.target.value)}
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
            onChange={(e) => onUpdateProvider(providerKey, "apiKey", e.target.value)}
          />
        </div>

        {hasModel && (
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">
              Current Model: {provider.model}
            </label>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
              onClick={() => onStartModelSelection(providerKey)}
            >
              Change Model
            </Button>
          </div>
        )}

        {hasProviderAndKey && !hasModel && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
            onClick={() => onStartModelSelection(providerKey)}
          >
            Select Model
          </Button>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="default" size="sm" className="flex-1" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
};
