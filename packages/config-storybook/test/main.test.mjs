import assert from 'node:assert/strict';
import test from 'node:test';
import config from '../src/main.ts';

function flattenPluginNames(plugins) {
	return plugins.flatMap((plugin) => {
		if (Array.isArray(plugin)) return flattenPluginNames(plugin);
		if (plugin && typeof plugin === 'object' && 'name' in plugin) {
			return [plugin.name];
		}
		return [];
	});
}

test('filters nested Svelte docgen plugins and preserves other plugins', async () => {
	const docgen = { name: 'storybook:svelte-docgen-plugin' };
	const outerPlugin = { name: 'vite:outer-plugin' };
	const innerPlugin = { name: 'vite:inner-plugin' };
	const deepPlugin = { name: 'vite:deep-plugin' };
	const viteConfig = {
		plugins: [outerPlugin, [docgen, [innerPlugin, [docgen, deepPlugin]]]],
		resolve: { alias: { '@sdk': '/sdk' }, dedupe: ['existing-package'] },
	};

	const result = await config.viteFinal(viteConfig);
	const names = flattenPluginNames(result.plugins);

	assert.equal(names.includes('storybook:svelte-docgen-plugin'), false);
	assert.equal(names.filter((name) => name === 'vite:outer-plugin').length, 1);
	assert.equal(names.filter((name) => name === 'vite:inner-plugin').length, 1);
	assert.equal(names.filter((name) => name === 'vite:deep-plugin').length, 1);
	assert.deepEqual(result.resolve.alias, { '@sdk': '/sdk' });
	assert.ok(result.resolve.dedupe.includes('existing-package'));
	assert.equal(result.resolve.dedupe.filter((name) => name === '@lingui/core').length, 1);
});

test('adds Lingui deduplication when no prior Vite resolve options exist', async () => {
	const result = await config.viteFinal({ plugins: [] });

	assert.deepEqual(result.resolve.dedupe, ['@lingui/core']);
});
