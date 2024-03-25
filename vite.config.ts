import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	plugins: [
	    wasm(),
    	topLevelAwait(),
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
