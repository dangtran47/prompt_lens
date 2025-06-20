import React from "react";
import { Button } from "../ui/button";
import { getProviderDisplayName } from "../../utils/providerUtils";

interface ProviderCardProps {
  providerKey: string;
  provider: {
    name: string;
    apiKey: string;
    model: string;
  };
  isDefault: boolean;
  onSetDefault: (providerKey: string) => void;
  onEdit: (providerKey: string) => void;
  onRemove: (providerKey: string) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  providerKey,
  provider,
  isDefault,
  onSetDefault,
  onEdit,
  onRemove
}) => {
  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{getProviderDisplayName(provider.name)}</span>
          {isDefault && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
          )}
        </div>
        <div className="flex gap-1">
          {!isDefault && (
            <Button variant="outline" size="sm" onClick={() => onSetDefault(providerKey)}>
              Set Default
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onEdit(providerKey)}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onRemove(providerKey)}>
            Remove
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-600">Model: {provider.model || "Not set"}</div>
    </div>
  );
};
