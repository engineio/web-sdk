<script lang="ts" module>
	import type { WinLevelData } from '../game/winLevelMap';

	export type EmitterEventFreeSpinOutro =
		| { type: 'freeSpinOutroShow' }
		| { type: 'freeSpinOutroHide' }
		| { type: 'freeSpinOutroCountUp'; amount: number; winLevelData: WinLevelData };
</script>

<script lang="ts">
	import { BitmapText, Sprite, SpineProvider, SpineTrack, SpineSlot, Text } from 'pixi-svelte';
	import { FadeContainer, WinCountUpProvider, ResponsiveBitmapText } from 'components-pixi';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { waitForResolve } from 'utils-shared/wait';
	import { CanvasSizeRectangle } from 'components-layout';
	import { OnMount } from 'components-shared';
	import { stateUrlDerived } from 'state-shared';

	import { getContext } from '../game/context';
	import { USE_PLACEHOLDER_ART } from '../game/constants';
	import FreeSpinAnimation from './FreeSpinAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';
	import WinCoins from './WinCoins.svelte';

	type AnimationName = 'intro' | 'idle';

	const context = getContext();

	let show = $state(true);
	let animationName = $state<AnimationName>('intro');
	let amount = $state(0);
	let winLevelData = $state<WinLevelData>();
	let oncomplete = $state(() => {});
	let onCountUpComplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinOutroShow: () => (show = true),
		freeSpinOutroHide: async () => (show = false),
		freeSpinOutroCountUp: async (emitterEvent) => {
			amount = emitterEvent.amount;
			winLevelData = emitterEvent.winLevelData;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show}>
	{#if winLevelData}
		{@const duration = winLevelData.presentDuration}
		{@const isBigWin = winLevelData.type === 'big'}
		<WinCountUpProvider {amount} {duration} oncomplete={() => onCountUpComplete()}>
			{#snippet children({ countUpAmount, startCountUp, finishCountUp, countUpCompleted })}
				<OnMount onmount={() => startCountUp()} />

				<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

				<FreeSpinAnimation>
					{#snippet children({ sizes })}
						{#if USE_PLACEHOLDER_ART}
							<Text
								anchor={0.5}
								y={-sizes.width * 0.12}
								text={isBigWin ? 'FREE SPINS TOTAL' : 'TOTAL WIN'}
								style={{
									fontFamily: 'Arial',
									fontSize: sizes.width * (isBigWin ? 0.12 : 0.16),
									fontWeight: '900',
									fill: 0xffffff,
									stroke: { color: 0xff5c8a, width: sizes.width * 0.025 },
								}}
							/>
						{:else if isBigWin}
							<Sprite
								anchor={{ x: 0.5, y: 1.2 }}
								width={500 * 2.2}
								height={156 * 2.2}
								key="freespins_{stateUrlDerived.lang()}.png"
							/>
						{:else}
							<Sprite
								anchor={{ x: 0.5, y: 1.2 }}
								width={500 * 4.5}
								height={80 * 4.5}
								key="winsmall_{stateUrlDerived.lang()}.png"
							/>
						{/if}

						{#if USE_PLACEHOLDER_ART}
							<BitmapText
								anchor={{ x: 0.5, y: 0.5 }}
								y={sizes.width * 0.06}
								text={bookEventAmountToCurrencyString(countUpAmount)}
								style={{
									fontFamily: 'Arial',
									fontSize: sizes.width * 0.22,
									fontWeight: '900',
									fill: 0xfff3a0,
									stroke: { color: 0x8a2b5e, width: sizes.width * 0.025 },
								}}
							/>
						{:else}
							<SpineProvider key="fsOutroNumber" width={sizes.width * 0.4}>
								<SpineTrack
									trackIndex={0}
									{animationName}
									loop={animationName === 'idle'}
									listener={{
										complete: () => (animationName = 'idle'),
									}}
								/>
								<SpineSlot slotName="slot_number">
									<ResponsiveBitmapText
										anchor={{ x: 0.5, y: 0.5 }}
										style={{
											fontFamily: 'gold',
											fontSize: sizes.width * 0.15,
										}}
										text={bookEventAmountToCurrencyString(countUpAmount)}
										maxWidth={sizes.width}
									/>
								</SpineSlot>
							</SpineProvider>
						{/if}

						{#if !USE_PLACEHOLDER_ART}
							<Sprite
								y={0}
								anchor={{ x: 0.5, y: isBigWin ? -3.2 : -2 }}
								width={177 * (isBigWin ? 2.2 : 3)}
								height={42 * (isBigWin ? 2.2 : 3)}
								key="totalwin.png"
							/>
						{/if}
					{/snippet}
				</FreeSpinAnimation>

				<WinCoins emit={!countUpCompleted} levelAlias={winLevelData?.alias} />

				<PressToContinue onpress={() => (countUpCompleted ? oncomplete() : finishCountUp())} />
			{/snippet}
		</WinCountUpProvider>
	{/if}
</FadeContainer>
