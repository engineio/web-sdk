<!--
	Procedural fruit-themed symbol art. Zero image dependencies.
	Swap to real art by setting USE_PLACEHOLDER_SYMBOLS = false.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Graphics as PixiGraphics } from 'pixi.js';

	import { Container, Graphics, Text } from 'pixi-svelte';

	import { SYMBOL_SIZE, PLACEHOLDER_SYMBOL_STYLES, PLACEHOLDER_PALETTE } from '../game/constants';
	import type { SymbolState } from '../game/types';

	type Props = {
		x?: number;
		y?: number;
		name: keyof typeof PLACEHOLDER_SYMBOL_STYLES;
		multiplier?: number;
		state: SymbolState;
		oncomplete?: () => void;
	};

	const props: Props = $props();

	const style = $derived(PLACEHOLDER_SYMBOL_STYLES[props.name]);
	const isHighlighted = $derived(['win', 'postWinStatic', 'explosion'].includes(props.state));
	const hasMultiplier = $derived(props.multiplier !== undefined);

	const S = SYMBOL_SIZE;
	const glyph = S * 0.72;

	onMount(() => props.oncomplete?.());

	$effect(() => {
		void props.state;
		props.oncomplete?.();
	});

	const starPoints = ({ spikes, outer, inner }: { spikes: number; outer: number; inner: number }) => {
		const points: number[] = [];
		for (let i = 0; i < spikes * 2; i += 1) {
			const angle = (Math.PI / spikes) * i - Math.PI / 2;
			const r = i % 2 === 0 ? outer : inner;
			points.push(Math.cos(angle) * r, Math.sin(angle) * r);
		}
		return points;
	};

	// Every fruit is drawn centred on (0, 0) within the symbol cell.
	const drawFruit = (g: PixiGraphics, shape: string, color: number, accent: number) => {
		switch (shape) {
			case 'watermelon':
				g.circle(0, S * 0.02, glyph * 0.48).fill({ color: accent });
				g.circle(0, S * 0.02, glyph * 0.42).fill({ color: 0xfff1f1 });
				g.circle(0, S * 0.02, glyph * 0.38).fill({ color });
				g.circle(-glyph * 0.12, -glyph * 0.1, glyph * 0.05).fill({ color: 0x2b2b2b });
				g.circle(glyph * 0.1, -glyph * 0.02, glyph * 0.05).fill({ color: 0x2b2b2b });
				g.circle(0, glyph * 0.14, glyph * 0.05).fill({ color: 0x2b2b2b });
				break;
			case 'orange':
				g.circle(0, 0, glyph * 0.46).fill({ color });
				g.circle(-glyph * 0.14, -glyph * 0.15, glyph * 0.2).fill({ color: accent, alpha: 0.5 });
				g.ellipse(0, -glyph * 0.42, glyph * 0.16, glyph * 0.08).fill({ color: accent });
				break;
			case 'grapes': {
				// Cluster of berries with a tapered silhouette and a leaf.
				const rows = [
					{ y: -0.26, count: 3, scale: 0.16 },
					{ y: -0.04, count: 4, scale: 0.18 },
					{ y: 0.2, count: 3, scale: 0.17 },
					{ y: 0.4, count: 2, scale: 0.15 },
				];
				rows.forEach((row, rowIndex) => {
					for (let i = 0; i < row.count; i += 1) {
						const spread = (i - (row.count - 1) / 2) * glyph * 0.19;
						const bx = spread;
						const by = row.y * glyph;
						const r = glyph * row.scale * 1.35;
						g.circle(bx, by, r).fill({ color: rowIndex % 2 ? color : accent });
						g.circle(bx - r * 0.3, by - r * 0.3, r * 0.32).fill({ color: 0xffffff, alpha: 0.35 });
					}
				});
				g.ellipse(glyph * 0.1, -glyph * 0.42, glyph * 0.2, glyph * 0.1).fill({ color: 0x7cb342 });
				break;
			}
			case 'lemon':
				g.ellipse(0, 0, glyph * 0.46, glyph * 0.34).fill({ color });
				g.ellipse(-glyph * 0.12, -glyph * 0.1, glyph * 0.18, glyph * 0.1).fill({
					color: accent,
					alpha: 0.6,
				});
				break;
			case 'apple':
				g.circle(0, glyph * 0.06, glyph * 0.42).fill({ color });
				g.circle(-glyph * 0.13, -glyph * 0.1, glyph * 0.16).fill({ color: 0xffffff, alpha: 0.35 });
				g.ellipse(glyph * 0.14, -glyph * 0.42, glyph * 0.16, glyph * 0.09).fill({ color: accent });
				break;
			case 'pear':
				g.circle(0, glyph * 0.14, glyph * 0.34).fill({ color });
				g.circle(0, -glyph * 0.2, glyph * 0.24).fill({ color });
				g.circle(-glyph * 0.1, -glyph * 0.24, glyph * 0.08).fill({ color: 0xffffff, alpha: 0.3 });
				break;
			case 'plum':
				g.circle(0, 0, glyph * 0.44).fill({ color });
				g.ellipse(-glyph * 0.05, 0, glyph * 0.06, glyph * 0.3).fill({ color: accent, alpha: 0.7 });
				g.circle(-glyph * 0.16, -glyph * 0.16, glyph * 0.1).fill({ color: 0xffffff, alpha: 0.3 });
				break;
			case 'blueberry':
				// Single plump berry with a crown notch.
				g.circle(0, glyph * 0.04, glyph * 0.42).fill({ color });
				g.circle(-glyph * 0.13, -glyph * 0.08, glyph * 0.16).fill({ color: 0xffffff, alpha: 0.32 });
				g.circle(-glyph * 0.2, -glyph * 0.16, glyph * 0.07).fill({ color: 0xffffff, alpha: 0.6 });
				// crown
				g.circle(0, -glyph * 0.3, glyph * 0.16).fill({ color: accent });
				g.circle(0, -glyph * 0.3, glyph * 0.07).fill({ color: 0x1e2f63 });
				break;
			case 'star':
				g.poly(starPoints({ spikes: 5, outer: glyph * 0.5, inner: glyph * 0.22 }))
					.fill({ color })
					.stroke({ width: S * 0.03, color: accent });
				break;
			case 'starburst':
			default:
				g.poly(starPoints({ spikes: 8, outer: glyph * 0.5, inner: glyph * 0.3 }))
					.fill({ color })
					.stroke({ width: S * 0.025, color: accent });
				break;
		}
	};
</script>

<Container x={props.x} y={props.y}>
	{#if isHighlighted}
		<Graphics
			draw={(g) => {
				g.roundRect(-S * 0.46, -S * 0.46, S * 0.92, S * 0.92, S * 0.18).fill({
					color: PLACEHOLDER_PALETTE.winGlow,
					alpha: 0.35,
				});
				g.roundRect(-S * 0.46, -S * 0.46, S * 0.92, S * 0.92, S * 0.18).stroke({
					width: S * 0.035,
					color: PLACEHOLDER_PALETTE.frameAccent,
					alpha: 0.95,
				});
			}}
		/>
	{/if}

	<!-- drop shadow -->
	<Graphics
		draw={(g) => {
			g.ellipse(0, S * 0.34, glyph * 0.34, glyph * 0.1).fill({ color: 0x3a1f4a, alpha: 0.18 });
		}}
	/>

	<Graphics
		draw={(g) => drawFruit(g, style?.shape ?? 'apple', style?.color ?? 0x999999, style?.accent ?? 0x666666)}
	/>

	<!-- gloss: specular highlight + bottom shading, clipped to a soft inner disc -->
	<Graphics
		draw={(g) => {
			if (style?.shape === 'star' || style?.shape === 'starburst') return;
			g.ellipse(-glyph * 0.14, -glyph * 0.19, glyph * 0.15, glyph * 0.09).fill({
				color: 0xffffff,
				alpha: 0.7,
			});
			g.ellipse(0, glyph * 0.2, glyph * 0.28, glyph * 0.1).fill({
				color: 0x000000,
				alpha: 0.12,
			});
		}}
	/>

	{#if hasMultiplier}
		<Text
			anchor={0.5}
			text={`${props.multiplier}X`}
			style={{
				fontFamily: 'Arial',
				fontSize: S * 0.26,
				fontWeight: '900',
				fill: 0xffffff,
				stroke: { color: 0x5a2d82, width: S * 0.05 },
			}}
		/>
	{/if}
</Container>
