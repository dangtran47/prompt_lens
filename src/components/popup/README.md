# Popup Components

This directory contains the refactored popup components for the Prompt Lens Chrome extension.

## Structure

```
src/
├── components/
│   └── popup/
│       ├── PopupApp.tsx              # Main orchestrator component
│       ├── ModeSelection.tsx         # Initial mode selection screen
│       ├── ConfigurationScreen.tsx   # Provider configuration screen
│       ├── ModelSelectionScreen.tsx  # Model selection screen
│       ├── ConfigurationComplete.tsx # Configuration complete screen
│       ├── ProviderCard.tsx          # Individual provider card component
│       ├── ProviderForm.tsx          # Provider configuration form
│       ├── index.ts                  # Export barrel
│       └── README.md                 # This file
├── hooks/
│   └── usePopupState.ts              # Custom hook for popup state management
├── services/
│   ├── configService.ts              # Configuration storage service
│   ├── modelsService.ts              # Model fetching service
│   └── index.ts                      # Service exports
├── types/
│   └── config.ts                     # TypeScript interfaces and types
├── utils/
│   └── providerUtils.ts              # Provider utility functions
└── popup.tsx                         # Entry point (simplified)
```

## Components

### PopupApp.tsx

The main orchestrator component that manages the different screens and state transitions.

### ModeSelection.tsx

Displays the initial mode selection screen where users choose between online and local modes.

### ConfigurationScreen.tsx

The main configuration screen where users can add, edit, and manage API providers.

### ModelSelectionScreen.tsx

Screen for selecting models from available providers.

### ConfigurationComplete.tsx

Shows the completion screen with current configuration summary.

### ProviderCard.tsx

Reusable component for displaying individual provider information.

### ProviderForm.tsx

Form component for adding/editing provider configurations.

## Services

### ConfigService

Handles Chrome storage operations for configuration persistence.

### ModelsService

Manages API calls to fetch available models from different providers.

## Hooks

### usePopupState

Custom hook that encapsulates all popup state management logic, including:

- Configuration loading/saving
- Provider management
- Model fetching
- Screen state transitions

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components like ProviderCard can be reused
3. **Maintainability**: Smaller files are easier to understand and modify
4. **Testability**: Individual components can be tested in isolation
5. **Type Safety**: Strong TypeScript interfaces throughout
6. **Clean Architecture**: Services handle business logic, components handle UI

## Usage

The main entry point is `src/popup.tsx`, which simply renders the `PopupApp` component. All the complex logic is now organized into smaller, focused files.
