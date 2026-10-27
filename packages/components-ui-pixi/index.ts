import UI from './src/components/UI.svelte';
import UiGameName from './src/components/UiGameName.svelte';

import messagesMap from './src/i18n/messagesMap';
import { i18nDerived } from './src/i18n/i18nDerived';

export * from './src/types';

export { setContextUiTheme, getContextUiTheme, DEFAULT_UI_THEME } from './src/theme';
export type { UiTheme } from './src/theme';

export { default as LabelBalance } from './src/components/LabelBalance.svelte';
export { default as LabelWin } from './src/components/LabelWin.svelte';
export { default as LabelBet } from './src/components/LabelBet.svelte';
export { default as ButtonBuyBonus } from './src/components/ButtonBuyBonus.svelte';
export { default as ButtonBet } from './src/components/ButtonBet.svelte';
export { default as ButtonTurbo } from './src/components/ButtonTurbo.svelte';
export { default as ButtonAutoSpin } from './src/components/ButtonAutoSpin.svelte';
export { default as ButtonIncrease } from './src/components/ButtonIncrease.svelte';
export { default as ButtonDecrease } from './src/components/ButtonDecrease.svelte';
export { default as ButtonMenu } from './src/components/ButtonMenu.svelte';
export { default as ButtonMenuClose } from './src/components/ButtonMenuClose.svelte';
export { default as ButtonPayTable } from './src/components/ButtonPayTable.svelte';
export { default as ButtonGameRules } from './src/components/ButtonGameRules.svelte';
export { default as ButtonSettings } from './src/components/ButtonSettings.svelte';
export { default as ButtonSoundSwitch } from './src/components/ButtonSoundSwitch.svelte';

export { messagesMap, i18nDerived, UI, UiGameName };
