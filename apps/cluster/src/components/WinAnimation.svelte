<script lang="ts">
	import type { Snippet } from 'svelte';

	import { SpineProvider, SpineTrack, SpineSlot } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { USE_PLACEHOLDER_ART } from '../game/constants';
	import PlaceholderBanner from './PlaceholderBanner.svelte';

	type AnimationState = 'intro' | 'idle' | 'outro';

	type Props = {
		animationMap: {
			intro:
				| 'big_win_intro'
				| 'epic_win_intro'
				| 'max_win_intro'
				| 'mega_win_intro'
				| 'super_win_intro';
			idle: 'big_win_idle' | 'epic_win_idle' | 'max_win_idle' | 'mega_win_idle' | 'super_win_idle';
			outro: 'big_win_exit' | 'epic_win_exit' | 'max_win_exit' | 'mega_win_exit' | 'super_win_exit';
		};
		children: Snippet;
	};

	const props: Props = $props();
	const context = getContext();

	let oncomplete = $state(() => {});
	let animationState = $state<AnimationState>('intro');

	// Map the spine anim name to a placeholder label + tier, purely for display.
	const PLACEHOLDER_MAP = {
		big_win: { label: 'BIG WIN', tier: 'big' },
		super_win: { label: 'SUPER WIN', tier: 'epic' },
		mega_win: { label: 'MEGA WIN', tier: 'mega' },
		epic_win: { label: 'EPIC WIN', tier: 'epic' },
		max_win: { label: 'MAX WIN', tier: 'max' },
	} as const;

	const placeholder = $derived(
		PLACEHOLDER_MAP[
			props.animationMap.intro.replace('_intro', '') as keyof typeof PLACEHOLDER_MAP
		],
	);
</script>

{#if USE_PLACEHOLDER_ART}
	<PlaceholderBanner
		label={placeholder?.label ?? 'WIN'}
		tier={placeholder?.tier ?? 'big'}
		visible
		x={0}
		y={-140}
	/>
	{@render props.children()}
{:else}
	<SpineProvider width={context.stateGameDerived.boardLayout().width} key="bigwin">
		<SpineTrack
			trackIndex={0}
			animationName={props.animationMap[animationState]}
			loop={animationState === 'idle'}
			listener={{
				complete: () => {
					if (animationState === 'intro') animationState = 'idle';
					if (animationState === 'outro') oncomplete();
				},
			}}
		/>
		<SpineSlot slotName="slot_win_count">
			{@render props.children()}
		</SpineSlot>
	</SpineProvider>
{/if}
