// Mock configuration - set via environment variables in .env file
export const MOCK_CONFIG = {
  // Enable mock responses for all API calls (translation, summarization)
  ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === "true",

  // Enable mock responses for model fetching
  ENABLE_MOCK_MODELS: import.meta.env.VITE_ENABLE_MOCK_MODELS === "true",

  // Mock response delay settings (in milliseconds)
  MOCK_DELAY: {
    MIN: parseInt(import.meta.env.VITE_MOCK_DELAY_MIN || "50", 10),
    MAX: parseInt(import.meta.env.VITE_MOCK_DELAY_MAX || "150", 10)
  }
};

// Helper function to check if mock mode is enabled
export const isMockModeEnabled = (): boolean => {
  return MOCK_CONFIG.ENABLE_MOCK_API || MOCK_CONFIG.ENABLE_MOCK_MODELS;
};
