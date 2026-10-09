import type { StorybookConfig } from '@storybook/sveltekit';
import type { PluginOption } from 'vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs'],
	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},
	staticDirs: ['../static'],
	async viteFinal(config) {
		// Storybook 9's Svelte docgen plugin stalls on .svelte story imports in this SDK.
		const filterPlugins = (plugins: PluginOption[]): PluginOption[] =>
			plugins.flatMap((plugin): PluginOption[] => {
				if (Array.isArray(plugin)) return [filterPlugins(plugin)];
				if (
					typeof plugin === 'object' &&
					plugin !== null &&
					'name' in plugin &&
					plugin.name === 'storybook:svelte-docgen-plugin'
				) {
					return [];
				}
				return [plugin];
			});
		config.plugins = filterPlugins(config.plugins || []);
		config.resolve = {
			...(config.resolve || {}),
			dedupe: [...new Set([...(config.resolve?.dedupe || []), '@lingui/core'])],
		};
		return config;
	},
};

export default config;
