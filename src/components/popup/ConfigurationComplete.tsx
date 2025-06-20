import React from "react";
import keys from "lodash/fp/keys";
import { Button } from "../ui/button";
import { Config } from "../../types/config";
import { getProviderDisplayName } from "../../utils/providerUtils";

interface ConfigurationCompleteProps {
  config: Config;
  onManageProviders: () => void;
  onResetConfig: () => void;
}

export const ConfigurationComplete: React.FC<ConfigurationCompleteProps> = ({
  config,
  onManageProviders,
  onResetConfig
}) => {
  const numProviders = keys(config?.providers).length;
  return (
    <div className="p-6 bg-white">
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-800 mb-1">Configuration Complete</h1>
        <p className="text-sm text-gray-600">Your extension is ready to use</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-sm">
          <div className="font-medium text-gray-700">Mode: {config.mode}</div>
          <div className="text-gray-600">Providers: {numProviders}</div>
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
        <Button variant="outline" className="w-full" onClick={onManageProviders}>
          Manage Providers
        </Button>
        <Button variant="outline" className="w-full" onClick={onResetConfig}>
          Reset Configuration
        </Button>
      </div>
    </div>
  );
};
