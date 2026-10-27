<script lang="ts" module>
	export type EmitterEventMultiplierGrid =
		| { type: 'multiplierGridShow' }
		| { type: 'multiplierGridHide' }
		| { type: 'multiplierGridUpdate'; grid: number[][] }
		| { type: 'multiplierGridClear' };
</script>

<script lang="ts">
	import { BitmapText, Container, SpineProvider, SpineTrack } from 'pixi-svelte';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	const context = getContext();
	const DEFAULT_GRID = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	];

	let show = $state(false);
	let grid = $state(DEFAULT_GRID);

	context.eventEmitter.subscribeOnMount({
		multiplierGridShow: () => (show = true),
		multiplierGridHide: () => (show = false),
		multiplierGridUpdate: (emitterEvent) => (grid = emitterEvent.grid),
		multiplierGridClear: () => (grid = DEFAULT_GRID),
	});
</script>

<BoardContainer>
	{#if show}
		{#each grid as reel, reelIndex (reelIndex)}
			{#each reel as multiplier, rowIndex (rowIndex)}
				{#if multiplier > 0}
					<Container x={(reelIndex + 0.5) * SYMBOL_SIZE} y={(rowIndex + 0.5) * SYMBOL_SIZE}>
						<SpineProvider key="anticipation" width={SYMBOL_SIZE * 0.19}>
							<SpineTrack trackIndex={0} animationName="payframe" loop />
						</SpineProvider>
						{#if multiplier > 1}
							<BitmapText
								x={-SYMBOL_SIZE * 0.05}
								anchor={{
									x: 0.5,
									y: 0.5,
								}}
								text={`${multiplier} X`}
								style={{
									fontFamily: 'gold',
									fontSize: SYMBOL_SIZE * 0.5,
									letterSpacing: -5,
								}}
							/>
						{/if}
					</Container>
				{/if}
			{/each}
		{/each}
	{/if}
</BoardContainer>
