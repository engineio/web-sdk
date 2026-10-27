import { setContextEventEmitter, getContextEventEmitter } from 'utils-event-emitter';
import { setContextXstate, getContextXstate } from 'utils-xstate';
import { setContextLayout, getContextLayout } from 'utils-layout';
import { setContextApp, getContextApp } from 'pixi-svelte';
import { stateMeta } from 'state-shared';

import { eventEmitter, type EmitterEvent } from './eventEmitter';
import { stateXstate, stateXstateDerived } from './stateXstate';
import { stateLayout, stateLayoutDerived } from './stateLayout';
import { stateApp } from './stateApp';

import { stateGame, stateGameDerived } from './stateGame.svelte';
import { i18nDerived } from '../i18n/i18nDerived';
import config from './config';

// The default bet-mode meta is a template superset. Drop any mode this game's
// maths does not declare, so the UI never offers a bet the RGS would reject.
const pruneBetModes = () => {
	const supported = new Set(Object.keys(config.betModes).map((key) => key.toLowerCase()));

	for (const key of Object.keys(stateMeta.betModeMeta)) {
		if (!supported.has(key.toLowerCase())) delete stateMeta.betModeMeta[key];
	}
};

export const setContext = () => {
	pruneBetModes();

	setContextEventEmitter<EmitterEvent>({ eventEmitter });
	setContextXstate({ stateXstate, stateXstateDerived });
	setContextLayout({ stateLayout, stateLayoutDerived });
	setContextApp({ stateApp });
};

export const getContext = () => ({
	...getContextEventEmitter<EmitterEvent>(),
	...getContextLayout(),
	...getContextXstate(),
	...getContextApp(),
	stateGame,
	stateGameDerived,
	i18nDerived,
});
