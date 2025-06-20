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
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-colors relative ${
        isDefault ? "bg-blue-50 border-blue-200" : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={() => !isDefault && onSetDefault(providerKey)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{getProviderDisplayName(provider.name)}</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(providerKey);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(providerKey);
            }}
          >
            Remove
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-600">Model: {provider.model || "Not set"}</div>

      {isDefault && (
        <div className="absolute bottom-2 right-2">
          <div className="bg-blue-500 text-white p-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
