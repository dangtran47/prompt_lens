import React from "react";
import keys from "lodash/fp/keys";
import { Button } from "../ui/button";
import { Config } from "../../types/config";
import { ProviderCard } from "./ProviderCard";
import { ProviderForm } from "./ProviderForm";

interface ConfigurationScreenProps {
  config: Config;
  editingProvider: string | null;
  editingProviderData: {
    key: string;
    data: { name: string; apiKey: string; model: string };
  } | null;
  onAddProvider: () => void;
  onRemoveProvider: (providerKey: string) => void;
  onSetDefaultProvider: (providerKey: string) => void;
  onUpdateProvider: (providerKey: string, field: string, value: string) => void;
  onSaveEditingProvider: () => void;
  onCancelEditingProvider: () => void;
  onSetEditingProvider: (providerKey: string | null) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({
  config,
  editingProvider,
  editingProviderData,
  onAddProvider,
  onRemoveProvider,
  onSetDefaultProvider,
  onUpdateProvider,
  onSaveEditingProvider,
  onCancelEditingProvider,
  onSetEditingProvider,
  onCancel,
  onSave
}) => {
  const numProviders = keys(config?.providers).length;
  return (
    <div className="p-6 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold text-gray-800 mb-1">API Providers Setup</h1>
        <p className="text-sm text-gray-600">Configure your API providers</p>
      </div>

      <div className="space-y-4">
        {/* Existing Providers */}
        {numProviders > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configured Providers
            </label>
            <div className="space-y-2">
              {Object.entries(config.providers).map(([key, provider]) => (
                <ProviderCard
                  key={key}
                  providerKey={key}
                  provider={provider}
                  isDefault={config.defaultProvider === key}
                  onSetDefault={onSetDefaultProvider}
                  onEdit={onSetEditingProvider}
                  onRemove={onRemoveProvider}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add New Provider */}
        <Button variant="outline" className="w-full" onClick={onAddProvider}>
          + Add New Provider
        </Button>

        {/* Edit Provider Form */}
        {editingProviderData && (
          <ProviderForm
            providerKey={editingProviderData.key}
            provider={editingProviderData.data}
            onUpdateProvider={onUpdateProvider}
            onCancel={onCancelEditingProvider}
            onDone={onSaveEditingProvider}
          />
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={onSave}
          disabled={numProviders === 0 || !config.defaultProvider}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
