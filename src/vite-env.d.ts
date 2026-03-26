/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ADMIN_USERNAME?: string
	readonly VITE_ADMIN_PASSWORD_HASH?: string
	readonly VITE_AUTH_SALT_PREFIX?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
