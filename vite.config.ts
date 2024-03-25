import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	plugins: [
		mkcert(),
		sveltekit(),
],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {
		exclude: ['@instrumentbible/staff.js', "@syntect/wasm"]
	},
	server: {
		https: true,
		proxy: {}
	}
});
