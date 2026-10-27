<script lang="ts" module>
	export type EmitterEventFreeSpinIntro =
		| { type: 'freeSpinIntroShow' }
		| { type: 'freeSpinIntroHide' }
		| { type: 'freeSpinIntroUpdate'; totalFreeSpins: number };
</script>

<script lang="ts">
	import { CanvasSizeRectangle } from 'components-layout';
	import { stateUrlDerived } from 'state-shared';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve } from 'utils-shared/wait';
	import { BitmapText, Container, SpineProvider, SpineSlot, SpineTrack, Sprite, Text } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { USE_PLACEHOLDER_ART } from '../game/constants';
	import PressToContinue from './PressToContinue.svelte';
	import FreeSpinAnimation from './FreeSpinAnimation.svelte';

	type AnimationName = 'intro' | 'idle';

	const context = getContext();

	let show = $state(false);
	let animationName = $state<AnimationName>('intro');
	let freeSpinsFromEvent = $state(0);
	let oncomplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinIntroShow: () => (show = true),
		freeSpinIntroHide: () => (show = false),
		freeSpinIntroUpdate: async (emitterEvent) => {
			// if (emitterEvent.extraSpins) {
			// 	context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_fs_respins' });
			// }
			// freeSpinsFromEvent = emitterEvent.extraSpins ?? emitterEvent.totalFreeSpins;
			freeSpinsFromEvent = emitterEvent.totalFreeSpins;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show}>
	<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

	<FreeSpinAnimation>
		{#snippet children({ sizes })}
			{#if USE_PLACEHOLDER_ART}
				<Text
					anchor={0.5}
					y={-sizes.width * 0.12}
					text="FREE SPINS"
					style={{
						fontFamily: 'Arial',
						fontSize: sizes.width * 0.16,
						fontWeight: '900',
						fill: 0xffffff,
						stroke: { color: 0xff5c8a, width: sizes.width * 0.03 },
					}}
				/>
			{:else}
				<Sprite
					anchor={{ x: 0.5, y: 1.2 }}
					width={500 * 2.2}
					height={156 * 2.2}
					key="freespins_{stateUrlDerived.lang()}.png"
				/>
			{/if}

			{#if USE_PLACEHOLDER_ART}
				<Container y={sizes.width * 0.06}>
					<BitmapText
						anchor={{ x: 0.5, y: 0.5 }}
						text={freeSpinsFromEvent}
						style={{
							fontFamily: 'Arial',
							fontSize: sizes.width * 0.3,
							fontWeight: '900',
							fill: 0xfff3a0,
							stroke: { color: 0x8a2b5e, width: sizes.width * 0.03 },
						}}
					/>
				</Container>
			{:else}
				<SpineProvider key="fsIntroNumber" width={sizes.width * 0.4}>
					<SpineTrack
						trackIndex={0}
						{animationName}
						loop={animationName === 'idle'}
						listener={{
							complete: () => (animationName = 'idle'),
						}}
					/>
					<SpineSlot slotName="slot_number">
						<BitmapText
							anchor={{ x: 0.5, y: 0.5 }}
							text={freeSpinsFromEvent}
							style={{
								fontFamily: 'gold',
								fontSize: sizes.width * 0.15,
								fontWeight: 'bold',
							}}
						/>
					</SpineSlot>
				</SpineProvider>
			{/if}

			{#if !USE_PLACEHOLDER_ART}
				<Sprite anchor={{ x: 0.5, y: -3 }} width={183 * 2.2} height={42 * 2.2} key="freespins.png" />
			{/if}
		{/snippet}
	</FreeSpinAnimation>

	<PressToContinue onpress={() => oncomplete()} />
</FadeContainer>
