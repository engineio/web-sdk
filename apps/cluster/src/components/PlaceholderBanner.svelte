<!--
	Flat procedural banner for win / feature overlays. Zero image dependencies.
	Only used while USE_PLACEHOLDER_ART is true.
-->
<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { backOut, sineIn } from 'svelte/easing';

	import { Container, Graphics, Text } from 'pixi-svelte';

	import { SYMBOL_SIZE, PLACEHOLDER_PALETTE } from '../game/constants';

	type Props = {
		label: string;
		sublabel?: string;
		/** Purely visual tier; drives the banner colour. */
		tier?: 'big' | 'epic' | 'mega' | 'max' | 'feature';
		x?: number;
		y?: number;
		visible?: boolean;
	};

	const props: Props = $props();

	const TIER_COLORS = {
		big: { from: 0xff9f1c, to: 0xff5c8a },
		epic: { from: 0xff5c8a, to: 0x9b4dca },
		mega: { from: 0x4a6fd4, to: 0x9b4dca },
		max: { from: 0xff4d6d, to: 0xffb703 },
		feature: { from: 0x2ec4b6, to: 0x4a6fd4 },
	} as const;

	const colors = $derived(TIER_COLORS[props.tier ?? 'big']);
	const bannerWidth = SYMBOL_SIZE * 6.4;
	const bannerHeight = SYMBOL_SIZE * 1.5;
	const radius = SYMBOL_SIZE * 0.3;

	const scale = new Tween(0.6);
	const alpha = new Tween(0);

	$effect(() => {
		if (props.visible) {
			scale.set(1, { duration: 420, easing: backOut });
			alpha.set(1, { duration: 220 });
		} else {
			scale.set(0.85, { duration: 260, easing: sineIn });
			alpha.set(0, { duration: 220 });
		}
	});
</script>

{#if alpha.current > 0.01}
	<Container x={props.x ?? 0} y={props.y ?? 0} scale={scale.current} alpha={alpha.current}>
		<!-- outer glow -->
		<Graphics
			draw={(g) => {
				g.roundRect(
					-bannerWidth / 2 - SYMBOL_SIZE * 0.08,
					-bannerHeight / 2 - SYMBOL_SIZE * 0.08,
					bannerWidth + SYMBOL_SIZE * 0.16,
					bannerHeight + SYMBOL_SIZE * 0.16,
					radius,
				).fill({ color: colors.to, alpha: 0.35 });
			}}
		/>

		<!-- body -->
		<Graphics
			draw={(g) => {
				g.roundRect(-bannerWidth / 2, -bannerHeight / 2, bannerWidth, bannerHeight, radius).fill({
					color: colors.from,
				});
				// inner top highlight
				g.roundRect(
					-bannerWidth / 2 + SYMBOL_SIZE * 0.06,
					-bannerHeight / 2 + SYMBOL_SIZE * 0.06,
					bannerWidth - SYMBOL_SIZE * 0.12,
					bannerHeight * 0.42,
					radius * 0.7,
				).fill({ color: 0xffffff, alpha: 0.22 });
				g.roundRect(-bannerWidth / 2, -bannerHeight / 2, bannerWidth, bannerHeight, radius).stroke({
					width: SYMBOL_SIZE * 0.06,
					color: 0xffffff,
					alpha: 0.9,
				});
			}}
		/>

		<Text
			anchor={0.5}
			y={props.sublabel ? -SYMBOL_SIZE * 0.16 : 0}
			text={props.label}
			style={{
				fontFamily: 'Arial',
				fontSize: SYMBOL_SIZE * 0.52,
				fontWeight: '900',
				fill: 0xffffff,
				stroke: { color: 0x8a2b5e, width: SYMBOL_SIZE * 0.09 },
				dropShadow: { color: 0x000000, alpha: 0.35, distance: SYMBOL_SIZE * 0.06, angle: Math.PI / 2 },
			}}
		/>

		{#if props.sublabel}
			<Text
				anchor={0.5}
				y={SYMBOL_SIZE * 0.36}
				text={props.sublabel}
				style={{
					fontFamily: 'Arial',
					fontSize: SYMBOL_SIZE * 0.26,
					fontWeight: '700',
					fill: PLACEHOLDER_PALETTE.winGlow,
					stroke: { color: 0x8a2b5e, width: SYMBOL_SIZE * 0.05 },
				}}
			/>
		{/if}
	</Container>
{/if}
