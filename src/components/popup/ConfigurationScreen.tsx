import React, { useState } from "react";
import keys from "lodash/fp/keys";
import { Button } from "../ui/button";
import { Config } from "../../types/config";
import { ProviderCard } from "./ProviderCard";
import { ProviderForm } from "./ProviderForm";

type Provider = {
  providerKey?: string;
  name: string;
  apiKey: string;
  model: string;
};

interface ConfigurationScreenProps {
  config: Config;
  onAddOrUpdateProvider: (provider: Provider) => void;
  onRemoveProvider: (providerKey: string) => void;
  onSetDefaultProvider: (providerKey: string) => void;
}

export const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({
  config,
  onAddOrUpdateProvider,
  onRemoveProvider,
  onSetDefaultProvider
}) => {
  const numProviders = keys(config?.providers).length;
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [selectedProviderToEdit, setSelectedProviderToEdit] = useState<Provider | undefined>(
    undefined
  );
  const onEditClick = (providerKey: string, provider: Provider) => {
    setSelectedProviderToEdit({ ...provider, providerKey });
  };

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
                  disabled={isAddingProvider}
                  key={key}
                  providerKey={key}
                  provider={provider}
                  isDefault={config.defaultProvider === key}
                  onSetDefault={onSetDefaultProvider}
                  onEdit={() => onEditClick(key, provider)}
                  onRemove={onRemoveProvider}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add New Provider */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAddingProvider(true)}
          disabled={!!selectedProviderToEdit}
        >
          + Add New Provider
        </Button>

        {isAddingProvider && (
          <ProviderForm
            provider={undefined}
            onCancel={() => setIsAddingProvider(false)}
            onDone={(provider) => {
              onAddOrUpdateProvider(provider);
              setIsAddingProvider(false);
            }}
          />
        )}

        {selectedProviderToEdit && (
          <ProviderForm
            provider={selectedProviderToEdit}
            onCancel={() => setSelectedProviderToEdit(undefined)}
            onDone={(provider) => {
              onAddOrUpdateProvider(provider);
              setSelectedProviderToEdit(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};
