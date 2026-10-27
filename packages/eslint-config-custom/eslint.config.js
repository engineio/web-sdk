import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import turbo from 'eslint-config-turbo/flat';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';

const GLOBS = {
	js: ['**/*.js', '**/*.mjs', '**/*.cjs'],
	ts: ['**/*.ts', '**/*.mts', '**/*.cts'],
	svelte: ['**/*.svelte'],
};

const IGNORES = [
	'**/.svelte-kit/**',
	'**/build/**',
	'**/dist/**',
	'**/node_modules/**',
	'**/.turbo/**',
	'**/storybook-static/**',
	'**/*.min.js',
];

// Svelte files that hold runes ($state etc.) outside a component.
const SVELTE_TS_FILES = ['**/*.svelte.ts', '**/*.svelte.js'];

// Svelte's parser needs a per-language parser for TypeScript script blocks.
// This must be applied after the svelte configs, which install svelte-eslint-parser.
const svelteTypescript = {
	files: [...GLOBS.svelte, ...SVELTE_TS_FILES, '**/*.svelte.js', '**/*.svelte.ts'],
	languageOptions: {
		parserOptions: {
			parser: tseslint.parser,
			extraFileExtensions: ['.svelte'],
		},
	},
};

export default [
	{ ignores: IGNORES },
	js.configs.recommended,
	...tseslint.configs.recommended,
	...turbo,
	...svelte.configs.recommended,
	svelteTypescript,
	{
		files: [...GLOBS.js, ...GLOBS.ts, ...GLOBS.svelte],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
		},
	},
	...svelte.configs.prettier,
	prettier,
];
