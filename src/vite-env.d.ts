/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_MOCK_MODELS: string;
  readonly VITE_MOCK_DELAY_MIN: string;
  readonly VITE_MOCK_DELAY_MAX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
