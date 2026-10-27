<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Sprite, REM } from 'pixi-svelte';
	import { stateModal } from 'state-shared';

	import { UI, UiGameName, setContextUiTheme } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';

	import { getContext } from '../game/context';
	import {
		USE_PLACEHOLDER_ART,
		PLACEHOLDER_PALETTE,
	} from '../game/constants';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import MultiplierGrid from './MultiplierGrid.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
	import ClusterWinAmounts from './ClusterWinAmounts.svelte';
	import TumbleBoard from './TumbleBoard.svelte';
	import TumbleWinAmount from './TumbleWinAmount.svelte';
	import GlobalMultiplier from './GlobalMultiplier.svelte';
	import Win from './Win.svelte';
	import FreeSpinIntro from './FreeSpinIntro.svelte';
	import FreeSpinCounter from './FreeSpinCounter.svelte';
	import FreeSpinOutro from './FreeSpinOutro.svelte';
	import Transition from './Transition.svelte';

	const context = getContext();

	// Theme override so this game's UI panels match the candy palette without
	// touching the shared component defaults used by the other apps.
	if (USE_PLACEHOLDER_ART) {
		setContextUiTheme({
			dark: 0x3a1b4a,
			light: 0xfff6ec,
			disabled: 0x6b5578,
			onDark: 0xffffff,
			onLight: 0x3a1b4a,
			borderOnDark: PLACEHOLDER_PALETTE.frameAccent,
			borderOnLight: PLACEHOLDER_PALETTE.frameAccent,
		});
	}

	onMount(() => (context.stateLayout.showLoadingScreen = true));

	// Theme override so this game's UI panels match the candy palette without
	// touching the shared component defaults used by the other apps.
	if (USE_PLACEHOLDER_ART) {
		setContextUiTheme({
			dark: 0x2d1b45,
			light: 0xfff6ec,
			disabled: 0x6b5578,
			onDark: 0xffffff,
			onLight: 0x3a1b4a,
			borderOnDark: PLACEHOLDER_PALETTE.frameAccent,
			borderOnLight: PLACEHOLDER_PALETTE.frameAccent,
		});
	}

	context.eventEmitter.subscribeOnMount({
		buyBonusConfirm: () => {
			stateModal.modal = { name: 'buyBonusConfirm' };
		},
	});
</script>

<App>
	<EnableSound />
	<EnableHotkey />
	<EnableGameActor />
	<EnablePixiExtension />

	<Background />

	{#if context.stateLayout.showLoadingScreen}
		<LoadingScreen onloaded={() => (context.stateLayout.showLoadingScreen = false)} />
	{:else}
		<ResumeBet />
		<!--
			The reason why <Sound /> is rendered after clicking the loading screen:
			"Autoplay with sound is allowed if: The user has interacted with the domain (click, tap, etc.)."
			Ref: https://developer.chrome.com/blog/autoplay
		-->
		<Sound />

		<MainContainer>
			<BoardFrame />
		</MainContainer>

		<MainContainer>
			<MultiplierGrid />
		</MainContainer>

		<MainContainer>
			<Board />
			<Anticipations />
			<TumbleWinAmount />
			<GlobalMultiplier />
		</MainContainer>

		<MainContainer>
			<TumbleBoard />
			<ClusterWinAmounts />
		</MainContainer>

		<UI>
			{#snippet gameName()}
				<UiGameName name="JUICED UP" />
			{/snippet}
			{#snippet logo()}
				<Sprite key="gameLogo" anchor={{ x: 1, y: 0 }} width={REM * 13} height={REM * 3.83} />
			{/snippet}
		</UI>
		<Win />
		<FreeSpinIntro />
		{#if ['desktop', 'landscape'].includes(context.stateLayoutDerived.layoutType())}
			<FreeSpinCounter />
		{/if}
		<FreeSpinOutro />
		<Transition />
	{/if}
</App>

<Modals>
	{#snippet version()}
		<GameVersion version="0.0.0" />
	{/snippet}
</Modals>
