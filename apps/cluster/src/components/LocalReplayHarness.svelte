<!-- TEMP dev harness - remove before shipping. -->
<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import { i18n } from '@lingui/core';
	import { stateBet } from 'state-shared';
	import { getContextApp } from 'pixi-svelte';
	import { getContextLayout } from 'utils-layout';

	import Game from '../components/Game.svelte';
	import { setContext } from '../game/context';
	import { playBet } from '../game/utils';
	import baseBooks from '../stories/data/base_books';

	type Props = { children: Snippet };
	const props: Props = $props();

	setContext();
	i18n.load('en', {});
	i18n.activate('en');

	const appContext = getContextApp();
	const layoutContext = getContextLayout();
	const books = baseBooks as any[];

	let index = $state(0);
	let spinning = $state(false);

	const play = async () => {
		if (spinning) return;
		spinning = true;
		try {
			const book = books[index];
			await playBet({ ...book, state: book.events } as any);
		} finally {
			spinning = false;
		}
	};

	onMount(() => {
		stateBet.currency = 'USD';
		stateBet.balanceAmount = 10000;
		stateBet.betAmount = 1;
		stateBet.wageredBetAmount = 1;
	});

	$effect(() => {
		if (appContext.stateApp.loaded) layoutContext.stateLayout.showLoadingScreen = false;
	});
</script>

<Game />

<div class="harness">
	<button onclick={() => play()} disabled={spinning}>
		{spinning ? 'Playing...' : `Play book #${index}`}
	</button>
	<button onclick={() => (index = Math.floor(Math.random() * books.length))} disabled={spinning}>
		Random
	</button>
	<span>{books.length} books</span>
</div>

{@render props.children()}

<style lang="scss">
	.harness {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9999;
		display: flex;
		gap: 8px;
		padding: 6px;
		background: rgba(0, 0, 0, 0.75);
		color: white;
		font-family: sans-serif;
		font-size: 13px;
	}
</style>
