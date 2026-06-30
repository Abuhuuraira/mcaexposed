/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ADMIN_USERNAME?: string
	readonly VITE_ADMIN_PASSWORD_HASH?: string
	readonly VITE_AUTH_SALT_PREFIX?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

interface Window {
	// Seeded by the prerenderer into each generated HTML file so the first
	// client render matches the server-rendered markup during hydration.
	__SSR_DATA__?: import('./ssr/data').InitialData
}
