<script lang="ts">
	import { Rectangle, SpineProvider, SpineTrack, Sprite } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { SECOND } from 'constants-shared/time';

	import { getContext } from '../game/context';
	import { USE_PLACEHOLDER_ART } from '../game/constants';

	const context = getContext();
	const backgroundProps = $derived(
		context.stateLayoutDerived.normalBackgroundLayout({ scale: 0.5 }),
	);
	const showBaseBackground = $derived(context.stateGame.gameType === 'basegame');
	const showFeatureBackground = $derived(context.stateGame.gameType === 'freegame');
	const canvasSizes = $derived(context.stateLayoutDerived.canvasSizes());

	// Cover-fit: scale to fill the canvas, crop the overflow instead of stretching.
	const BG_RATIO = 1376 / 768;
	const coverSizes = $derived.by(() => {
		const cw = canvasSizes.width;
		const ch = canvasSizes.height;
		return cw / ch > BG_RATIO
			? { width: cw, height: cw / BG_RATIO }
			: { width: ch * BG_RATIO, height: ch };
	});
</script>

<Rectangle {...canvasSizes} backgroundColor={0x000000} zIndex={-3} />

{#if USE_PLACEHOLDER_ART}
	<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
		<Sprite
			key="background"
			anchor={0.5}
			x={canvasSizes.width * 0.5}
			y={canvasSizes.height * 0.5}
			width={coverSizes.width}
			height={coverSizes.height}
		/>
	</FadeContainer>

	<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
		<Sprite
			key="background"
			anchor={0.5}
			x={canvasSizes.width * 0.5}
			y={canvasSizes.height * 0.5}
			width={coverSizes.width}
			height={coverSizes.height}
		/>
		<Rectangle {...canvasSizes} backgroundColor={0x2a0a4a} backgroundAlpha={0.35} />
	</FadeContainer>
{:else}
	<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
		<SpineProvider key="foregroundAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="idle" loop />
		</SpineProvider>
		<SpineProvider key="foregroundAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="dust" loop />
		</SpineProvider>
	</FadeContainer>

	<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
		<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="idle" loop />
		</SpineProvider>
		<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="dust" loop />
		</SpineProvider>
	</FadeContainer>
{/if}
