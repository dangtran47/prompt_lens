import React from "react";
import keys from "lodash/fp/keys";
import { Button } from "../ui/button";
import { Config } from "../../types/config";
import { getProviderDisplayName } from "../../utils/providerUtils";

interface ModeSelectionProps {
  config: Config;
  onModeSelect: (mode: "online" | "local") => void;
  onResetConfig: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  config,
  onModeSelect,
  onResetConfig
}) => {
  const numProviders = keys(config?.providers).length;
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
          onClick={() => onModeSelect("online")}
        >
          <div className="flex flex-col items-center">
            <span className="font-medium text-gray-400">Online Mode</span>
            <span className="text-xs text-gray-400">Coming Soon</span>
          </div>
        </Button>

        <Button variant="default" className="w-full h-12" onClick={() => onModeSelect("local")}>
          <span className="font-medium">Local Mode</span>
        </Button>
      </div>

      {config.mode && numProviders > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-gray-500 mb-2">Current Configuration:</div>
          <div className="text-sm text-gray-700">
            Mode: {config.mode} • Providers: {numProviders}
            {config.defaultProvider &&
              ` • Default: ${getProviderDisplayName(
                config.providers[config.defaultProvider]?.name || "Unknown"
              )}`}
          </div>
          <Button variant="outline" size="sm" className="mt-2 w-full" onClick={onResetConfig}>
            Reset Configuration
          </Button>
        </div>
      )}
    </div>
  );
};
