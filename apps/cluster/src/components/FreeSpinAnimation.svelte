<script lang="ts">
	import type { Snippet } from 'svelte';

	import {
		anchorToPivot,
		Container,
		Graphics,
		SpineProvider,
		SpineSlot,
		SpineTrack,
		type Sizes,
	} from 'pixi-svelte';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import {
		SYMBOL_SIZE,
		BOARD_DIMENSIONS,
		USE_PLACEHOLDER_ART,
		PLACEHOLDER_PALETTE,
	} from '../game/constants';

	type Props = {
		children: Snippet<[{ sizes: Sizes }]>;
	};

	const props: Props = $props();

	type AnimationName = 'intro' | 'idle';

	const context = getContext();
	const BACKGROUND_RATIO = 920 / 720;
	const BACKGROUND_WIDTH = SYMBOL_SIZE * BOARD_DIMENSIONS.y;
	const BACKGROUND_SIZES = {
		width: BACKGROUND_WIDTH,
		height: BACKGROUND_WIDTH / BACKGROUND_RATIO,
	};
	const PANEL_SIZES = {
		width: SYMBOL_SIZE * BOARD_DIMENSIONS.y,
		height: SYMBOL_SIZE * BOARD_DIMENSIONS.y,
	};

	let animationName = $state<AnimationName>('intro');
</script>

<MainContainer>
	<Container
		x={context.stateGameDerived.boardLayout().x}
		y={context.stateGameDerived.boardLayout().y}
		pivot={anchorToPivot({ anchor: 0.5, sizes: BACKGROUND_SIZES })}
	>
		{#if USE_PLACEHOLDER_ART}
			<Container x={PANEL_SIZES.width * 0.5} y={PANEL_SIZES.height * 0.4}>
				<Graphics
					draw={(g) => {
						const w = PANEL_SIZES.width;
						const h = PANEL_SIZES.height * 0.62;
						g.roundRect(-w / 2, -h / 2, w, h, SYMBOL_SIZE * 0.6)
							.fill({ color: PLACEHOLDER_PALETTE.panel, alpha: 0.92 })
							.stroke({ width: SYMBOL_SIZE * 0.14, color: 0xffffff, alpha: 0.85 });
					}}
				/>
				{@render props.children({ sizes: BACKGROUND_SIZES })}
			</Container>
		{:else}
			<SpineProvider
				key="fsIntro"
				width={PANEL_SIZES.width}
				x={PANEL_SIZES.width * 0.5}
				y={PANEL_SIZES.height * 0.4}
			>
				<SpineTrack
					trackIndex={0}
					{animationName}
					loop={animationName === 'idle'}
					listener={{
						complete: () => (animationName = 'idle'),
					}}
				/>
				<SpineSlot slotName="slot_text_placeholder">
					{@render props.children({ sizes: BACKGROUND_SIZES })}
				</SpineSlot>
			</SpineProvider>
		{/if}
	</Container>
</MainContainer>
