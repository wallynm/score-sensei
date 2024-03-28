import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const base = process.env.NODE_ENV === 'production' ? '/score-sensei' : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: adapter({
			fallback: undefined,
			precompress: true,
			strict: false
		}),
		paths: {
			base
		}
	}
};

export default config;




