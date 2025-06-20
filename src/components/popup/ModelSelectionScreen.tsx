import React from "react";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { Model } from "../../types/config";
import { getProviderDisplayName } from "../../utils/providerUtils";

interface ModelSelectionScreenProps {
  currentProviderKey: string;
  currentProvider: {
    name: string;
    apiKey: string;
    model: string;
  };
  models: Model[];
  isLoadingModels: boolean;
  modelError: string;
  onUpdateProvider: (providerKey: string, field: string, value: string) => void;
  onBack: () => void;
  onSave: () => void;
}

export const ModelSelectionScreen: React.FC<ModelSelectionScreenProps> = ({
  currentProviderKey,
  currentProvider,
  models,
  isLoadingModels,
  modelError,
  onUpdateProvider,
  onBack,
  onSave
}) => {
  return (
    <div className="p-6 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold text-gray-800 mb-1">Select Model</h1>
        <p className="text-sm text-gray-600">
          Choose model for {getProviderDisplayName(currentProvider.name)}
        </p>
      </div>

      {isLoadingModels ? (
        <div className="text-center py-8">
          <div className="text-sm text-gray-600">Loading available models...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {modelError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{modelError}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
            <Select
              value={currentProvider?.model || ""}
              onChange={(e) => onUpdateProvider(currentProviderKey, "model", e.target.value)}
            >
              <option value="">Choose a model...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.display_name || model.name || model.id}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={onSave}
          disabled={!currentProvider?.model}
        >
          Save Model
        </Button>
      </div>
    </div>
  );
};
