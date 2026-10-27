<script lang="ts">
	import TumbleSymbol from './TumbleSymbol.svelte';
	import { getContext } from '../game/context';

	const context = getContext();
</script>

{#each context.stateGameDerived.tumbleBoardCombined() as tumbleSymbols, reelIndex (reelIndex)}
	{#each tumbleSymbols as tumbleSymbol, symbolIndex (symbolIndex)}
		<TumbleSymbol {reelIndex} {tumbleSymbol} />
	{/each}
{/each}
