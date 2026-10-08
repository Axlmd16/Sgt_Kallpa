/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: 'http://127.0.0.1:8000' | string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
