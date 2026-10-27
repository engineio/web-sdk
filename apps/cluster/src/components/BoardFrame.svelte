<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Graphics, Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { USE_PLACEHOLDER_ART, PLACEHOLDER_PALETTE, SYMBOL_SIZE } from '../game/constants';

	const context = getContext();
	const SPINE_SCALE = { width: 0.6, height: 0.6 };
	const SPRITE_SCALE = { width: 1.07, height: 1.19 };
	const BG_RATIO = 937 / 806;
	const POSITION_ADJUSTMENT = 1.01;

	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const frameX = $derived(boardLayout.x * POSITION_ADJUSTMENT);
	const frameY = $derived(boardLayout.y * POSITION_ADJUSTMENT);
	const frameWidth = $derived(boardLayout.width * BG_RATIO * SPRITE_SCALE.width);
	const frameHeight = $derived(boardLayout.height + SYMBOL_SIZE * 0.9);
	const framePadding = SYMBOL_SIZE * 0.12;
	const frameRadius = SYMBOL_SIZE * 0.28;
	const glowAlpha = $derived(animationName ? 0.55 : 0.18);

	type AnimationName = 'reelhouse_glow_start' | 'reelhouse_glow_idle' | 'reelhouse_glow_exit';

	let animationName = $state<AnimationName | undefined>(undefined);
	let loop = $state(false);

	context.eventEmitter.subscribeOnMount({
		boardFrameGlowShow: () => {
			animationName = 'reelhouse_glow_start';
			loop = false;
		},
		boardFrameGlowHide: () => {
			if (animationName) animationName = 'reelhouse_glow_exit';
		},
	});
</script>

{#if USE_PLACEHOLDER_ART}
	{#if animationName}
		<Graphics
			zIndex={-1}
			draw={(g) => {
				g.roundRect(
					frameX - frameWidth / 2,
					frameY - frameHeight / 2,
					frameWidth,
					frameHeight,
					frameRadius,
				).stroke({
					width: SYMBOL_SIZE * 0.16,
					color: PLACEHOLDER_PALETTE.frameAccent,
					alpha: glowAlpha,
				});
			}}
		/>
	{/if}

	<Graphics
		draw={(g) => {
			g.roundRect(
				frameX - frameWidth / 2 - framePadding,
				frameY - frameHeight / 2 - framePadding,
				frameWidth + framePadding * 2,
				frameHeight + framePadding * 2,
				frameRadius,
			)
				.fill({ color: PLACEHOLDER_PALETTE.boardCell, alpha: 0.93 })
				.stroke({ width: SYMBOL_SIZE * 0.08, color: PLACEHOLDER_PALETTE.frameFill });

			// dashed inner accent
			const dash = SYMBOL_SIZE * 0.22;
			const gap = SYMBOL_SIZE * 0.16;
			const innerW = frameWidth + framePadding * 2 - SYMBOL_SIZE * 0.16;
			const innerH = frameHeight + framePadding * 2 - SYMBOL_SIZE * 0.16;
			const left = frameX - innerW / 2;
			const top = frameY - innerH / 2;
			for (let x = left; x < left + innerW; x += dash + gap) {
				g.rect(x, top, Math.min(dash, left + innerW - x), SYMBOL_SIZE * 0.035).fill({
					color: PLACEHOLDER_PALETTE.frameDash,
				});
				g.rect(x, top + innerH, Math.min(dash, left + innerW - x), SYMBOL_SIZE * 0.035).fill({
					color: PLACEHOLDER_PALETTE.frameDash,
				});
			}
			for (let y = top; y < top + innerH; y += dash + gap) {
				g.rect(left, y, SYMBOL_SIZE * 0.035, Math.min(dash, top + innerH - y)).fill({
					color: PLACEHOLDER_PALETTE.frameDash,
				});
				g.rect(left + innerW, y, SYMBOL_SIZE * 0.035, Math.min(dash, top + innerH - y)).fill({
					color: PLACEHOLDER_PALETTE.frameDash,
				});
			}
		}}
	/>
{:else}
	{#if animationName}
		<SpineProvider
			zIndex={-1}
			key="reelhouse"
			x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
			y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
			width={context.stateGameDerived.boardLayout().width * SPINE_SCALE.width}
			height={context.stateGameDerived.boardLayout().height * SPINE_SCALE.height}
		>
			<SpineTrack
				trackIndex={0}
				{animationName}
				{loop}
				listener={{
					complete: (entry) => {
						if (entry.animation) {
							if (entry.animation.name === 'reelhouse_glow_start') {
								animationName = 'reelhouse_glow_idle';
								loop = true;
							}

							if (entry.animation.name === 'reelhouse_glow_exit') {
								animationName = undefined;
								loop = false;
							}
						}
					},
				}}
			/>
		</SpineProvider>
	{/if}

	<Sprite
		key="frame_bg.png"
		anchor={0.5}
		x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
		y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
		width={context.stateGameDerived.boardLayout().width * BG_RATIO * SPRITE_SCALE.width}
		height={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.height}
	/>

	<Sprite
		key="frame_edge.png"
		anchor={0.5}
		x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
		y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
		width={context.stateGameDerived.boardLayout().width * BG_RATIO * SPRITE_SCALE.width}
		height={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.height}
	/>
{/if}
	{#if animationName}
		<SpineProvider
		zIndex={-1}
		key="reelhouse"
		x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
		y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
		width={context.stateGameDerived.boardLayout().width * SPINE_SCALE.width}
		height={context.stateGameDerived.boardLayout().height * SPINE_SCALE.height}
	>
		<SpineTrack
			trackIndex={0}
			{animationName}
			{loop}
			listener={{
				complete: (entry) => {
					if (entry.animation) {
						if (entry.animation.name === 'reelhouse_glow_start') {
							animationName = 'reelhouse_glow_idle';
							loop = true;
						}

						if (entry.animation.name === 'reelhouse_glow_exit') {
							animationName = undefined;
							loop = false;
						}
					}
				},
			}}
		/>
	</SpineProvider>
{/if}
