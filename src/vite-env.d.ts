/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Strapi CMS, e.g. http://localhost:1337 (no trailing /api). */
  readonly VITE_CMS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
