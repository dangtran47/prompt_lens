import React from "react";
import { usePopupState } from "../../hooks/usePopupState";
import { ModeSelection } from "./ModeSelection";
import { ConfigurationScreen } from "./ConfigurationScreen";
import { ConfigurationComplete } from "./ConfigurationComplete";

export const PopupApp: React.FC = () => {
  const {
    // State
    currentMode,
    config,
    isConfiguring,
    editingProvider,
    editingProviderData,

    // Actions
    handleModeSelect,
    addProvider,
    removeProvider,
    setDefaultProvider,
    updateProvider,
    saveEditingProvider,
    cancelEditingProvider,
    resetConfig,
    setIsConfiguring,
    setEditingProvider,
    setCurrentMode
  } = usePopupState();

  // Mode selection screen
  if (!currentMode && !isConfiguring) {
    return (
      <ModeSelection config={config} onModeSelect={handleModeSelect} onResetConfig={resetConfig} />
    );
  }

  // Configuration screen
  if (isConfiguring && currentMode === "local") {
    return (
      <ConfigurationScreen
        config={config}
        editingProvider={editingProvider}
        editingProviderData={editingProviderData}
        onAddProvider={addProvider}
        onRemoveProvider={removeProvider}
        onSetDefaultProvider={setDefaultProvider}
        onUpdateProvider={updateProvider}
        onSaveEditingProvider={saveEditingProvider}
        onCancelEditingProvider={cancelEditingProvider}
        onSetEditingProvider={setEditingProvider}
        onCancel={() => {
          setIsConfiguring(false);
          setCurrentMode(null);
        }}
        onSave={() => setIsConfiguring(false)}
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
