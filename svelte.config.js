

import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';
import { reactivePreprocess } from 'svelte-reactive-preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		sveltePreprocess(),
		reactivePreprocess()
	],
	kit: {
		adapter: adapter()
	}
};

export default config;
