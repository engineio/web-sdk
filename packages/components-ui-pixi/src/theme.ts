import { getContext, setContext } from 'svelte';

export type UiTheme = {
	/** Panel / button background (dark variant). */
	dark: number;
	/** Panel / button background (light variant). */
	light: number;
	/** Background when a control is disabled. */
	disabled: number;
	/** Text colour on dark backgrounds. */
	onDark: number;
	/** Text colour on light backgrounds. */
	onLight: number;
	/** Active/selected border. */
	borderOnDark: number;
	borderOnLight: number;
};

export const DEFAULT_UI_THEME: UiTheme = {
	dark: 0x000000,
	light: 0xffffff,
	disabled: 0xaaaaaa,
	onDark: 0xffffff,
	onLight: 0x000000,
	borderOnDark: 0xffffff,
	borderOnLight: 0x000000,
};

const UI_THEME_NS = '@@ui-theme';

export const setContextUiTheme = (theme: Partial<UiTheme> = {}) => {
	setContext(UI_THEME_NS, { ...DEFAULT_UI_THEME, ...theme } as UiTheme);
};

export const getContextUiTheme = (): UiTheme =>
	(getContext(UI_THEME_NS) as UiTheme | undefined) ?? DEFAULT_UI_THEME;
