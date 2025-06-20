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

    // Actions
    handleModeSelect,
    addOrUpdateProvider,
    removeProvider,
    setDefaultProvider,
    resetConfig,
    setIsConfiguring
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
        onAddOrUpdateProvider={addOrUpdateProvider}
        onRemoveProvider={removeProvider}
        onSetDefaultProvider={setDefaultProvider}
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
