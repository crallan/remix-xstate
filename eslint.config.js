import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: { globals: globals.browser },
	},
	globalIgnores(['node_modules/*', 'build/*', 'vite.config.js', 'tailwind.config.js']),
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		rules: {
			'react/react-in-jsx-scope': 'off',
		},
	},
]);
