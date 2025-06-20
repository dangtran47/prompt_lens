import React from "react";
import { usePopupState } from "../../hooks/usePopupState";
import { ModeSelection } from "./ModeSelection";
import { ConfigurationScreen } from "./ConfigurationScreen";
import { ModelSelectionScreen } from "./ModelSelectionScreen";
import { ConfigurationComplete } from "./ConfigurationComplete";

export const PopupApp: React.FC = () => {
  const {
    // State
    currentMode,
    config,
    isConfiguring,
    isSelectingModel,
    currentProviderKey,
    models,
    isLoadingModels,
    modelError,
    editingProvider,

    // Actions
    handleModeSelect,
    addProvider,
    removeProvider,
    setDefaultProvider,
    updateProvider,
    startModelSelection,
    handleModelSelect,
    resetConfig,
    setIsConfiguring,
    setEditingProvider,
    setCurrentProviderKey,
    setIsSelectingModel
  } = usePopupState();

  // Mode selection screen
  if (!currentMode && !isConfiguring) {
    return (
      <ModeSelection config={config} onModeSelect={handleModeSelect} onResetConfig={resetConfig} />
    );
  }

  // Configuration screen
  if (isConfiguring && currentMode === "local" && !isSelectingModel) {
    return (
      <ConfigurationScreen
        config={config}
        editingProvider={editingProvider}
        onAddProvider={addProvider}
        onRemoveProvider={removeProvider}
        onSetDefaultProvider={setDefaultProvider}
        onUpdateProvider={updateProvider}
        onStartModelSelection={startModelSelection}
        onSetEditingProvider={setEditingProvider}
        onCancel={() => {
          setIsConfiguring(false);
          setCurrentMode(null);
        }}
        onSave={() => setIsConfiguring(false)}
      />
    );
  }

  // Model selection screen
  if (isSelectingModel) {
    const currentProvider = config.providers[currentProviderKey];

    return (
      <ModelSelectionScreen
        currentProviderKey={currentProviderKey}
        currentProvider={currentProvider}
        models={models}
        isLoadingModels={isLoadingModels}
        modelError={modelError}
        onUpdateProvider={updateProvider}
        onBack={() => {
          setIsSelectingModel(false);
          setCurrentProviderKey("");
        }}
        onSave={handleModelSelect}
      />
    );
  }

  // Configuration complete screen
  return (
    <ConfigurationComplete
      config={config}
      onManageProviders={() => setIsConfiguring(true)}
      onResetConfig={resetConfig}
    />
  );
};
