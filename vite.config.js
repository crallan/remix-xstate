import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
	plugins: [remix(), tailwindcss(), eslint()],
});
