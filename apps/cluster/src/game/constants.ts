import _ from 'lodash';

import type { RawSymbol, SymbolState } from './types';

export const SYMBOL_SIZE = 80;

export const REEL_PADDING = 0.53;

// Set to false once real symbol art is wired up in SYMBOL_INFO_MAP / assets.ts.
// While true, symbols render as flat procedural shapes instead of textures.
export const USE_PLACEHOLDER_SYMBOLS = false;

// Set to false once real background / frame art is wired up.
export const USE_PLACEHOLDER_ART = true;


// Placeholder palette. Art direction only — change these to match your theme.
export const PLACEHOLDER_PALETTE = {
	baseBackgroundTop: 0x8fd6f5,
	baseBackgroundBottom: 0xf7b2d0,
	featureBackgroundTop: 0xd7b6f2,
	featureBackgroundBottom: 0x8a5bb8,
	frameFill: 0xfff6ec,
	frameBorder: 0xff9ec4,
	frameAccent: 0xff5c8a,
	frameDash: 0xff5c8a,
	boardCell: 0xffe8d6,
	panel: 0xffb3cd,
	winGlow: 0xfff3a0,
} as const;

// Fruit theme. `draw` names a shape in SymbolPlaceholder.svelte; `label` is the
// fallback text and accessibility name. Never gameplay data.
export const PLACEHOLDER_SYMBOL_STYLES = {
	H1: { shape: 'watermelon', color: 0xff4d6d, accent: 0x2e8b57, label: 'WATERMELON' },
	H2: { shape: 'orange', color: 0xff9f1c, accent: 0xffd166, label: 'ORANGE' },
	H3: { shape: 'grapes', color: 0x8e5bd0, accent: 0x4b2e83, label: 'GRAPES' },
	H4: { shape: 'lemon', color: 0xffd93d, accent: 0xffe97f, label: 'LEMON' },
	L1: { shape: 'apple', color: 0xe63946, accent: 0x7cb342, label: 'APPLE' },
	L2: { shape: 'pear', color: 0xb5d134, accent: 0x7cb342, label: 'PEAR' },
	L3: { shape: 'plum', color: 0x9b4dca, accent: 0x6a2c91, label: 'PLUM' },
	L4: { shape: 'blueberry', color: 0x4a6fd4, accent: 0x2f4a9e, label: 'BLUEBERRY' },
	W: { shape: 'star', color: 0xffb703, accent: 0xffffff, label: 'WILD', ring: true },
	S: { shape: 'starburst', color: 0xff5c8a, accent: 0xfff3a0, label: 'SCATTER', ring: true },
} as const;

// initial board (padded top and bottom)
export const INITIAL_BOARD: RawSymbol[][] = [
	[
		{
			name: 'L1',
		},
		{
			name: 'H1',
		},
		{
			name: 'L1',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
	],
	[
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'H2',
		},
	],
	[
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
		{
			name: 'L1',
		},
		{
			name: 'L1',
		},
		{
			name: 'H4',
		},
		{
			name: 'L2',
		},
		{
			name: 'H4',
		},
		{
			name: 'H4',
		},
		{
			name: 'H2',
		},
	],
	[
		{
			name: 'H4',
		},
		{
			name: 'L1',
		},
		{
			name: 'H2',
		},
		{
			name: 'H2',
		},
		{
			name: 'H4',
		},
		{
			name: 'H2',
		},
		{
			name: 'H2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
	],
	[
		{
			name: 'L1',
		},
		{
			name: 'L1',
		},
		{
			name: 'H3',
		},
		{
			name: 'H1',
		},
		{
			name: 'H1',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
	],
	[
		{
			name: 'L1',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'H1',
		},
		{
			name: 'H4',
		},
		{
			name: 'H4',
		},
		{
			name: 'H2',
		},
		{
			name: 'H3',
		},
		{
			name: 'H2',
		},
	],
	[
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
		{
			name: 'H1',
		},
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
		{
			name: 'H3',
		},
		{
			name: 'H2',
		},
	],
];

export const BOARD_DIMENSIONS = { x: INITIAL_BOARD.length, y: INITIAL_BOARD[0].length - 2 };

export const BOARD_SIZES = {
	width: SYMBOL_SIZE * BOARD_DIMENSIONS.x,
	height: SYMBOL_SIZE * BOARD_DIMENSIONS.y,
};

export const BACKGROUND_RATIO = 2039 / 1000;
export const PORTRAIT_BACKGROUND_RATIO = 1242 / 2208;
const PORTRAIT_RATIO = 800 / 1422;
const LANDSCAPE_RATIO = 1600 / 900;
const DESKTOP_RATIO = 1422 / 800;

const DESKTOP_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 900;
const PORTRAIT_HEIGHT = 1422;
export const DESKTOP_MAIN_SIZES = { width: DESKTOP_HEIGHT * DESKTOP_RATIO, height: DESKTOP_HEIGHT };
export const LANDSCAPE_MAIN_SIZES = {
	width: LANDSCAPE_HEIGHT * LANDSCAPE_RATIO,
	height: LANDSCAPE_HEIGHT,
};
export const PORTRAIT_MAIN_SIZES = {
	width: PORTRAIT_HEIGHT * PORTRAIT_RATIO,
	height: PORTRAIT_HEIGHT,
};

export const HIGH_SYMBOLS = ['H1', 'H2', 'H3', 'H4', 'H5'];

export const INITIAL_SYMBOL_STATE: SymbolState = 'static';


const SPIN_OPTIONS_SHARED = {
	reelFallInDelay: 80,
	reelPaddingMultiplierNormal: 1.25,
	reelPaddingMultiplierAnticipated: 18,
	reelFallOutDelay: 145,
};

export const SPIN_OPTIONS_DEFAULT = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 3.5,
	symbolFallInInterval: 30,
	symbolFallInBounceSpeed: 0.15,
	symbolFallInBounceSizeMulti: 0.5,
	symbolFallOutSpeed: 3.5,
	symbolFallOutInterval: 20,
};

export const SPIN_OPTIONS_FAST = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 7,
	symbolFallInInterval: 0,
	symbolFallInBounceSpeed: 0.3,
	symbolFallInBounceSizeMulti: 0.25,
	symbolFallOutSpeed: 7,
	symbolFallOutInterval: 0,
};

export const MOTION_BLUR_VELOCITY = 31;

export const zIndexes = {
	background: {
		backdrop: -3,
		normal: -2,
		feature: -1,
	},
};

const explosion = {
	type: 'spine',
	assetKey: 'explosion',
	animationName: 'explosion',
	sizeRatios: { width: 1, height: 1 },
};

const h1Static = { type: 'sprite', assetKey: 'H1_art', sizeRatios: { width: 1, height: 1 } };
const h2Static = { type: 'sprite', assetKey: 'H2_art', sizeRatios: { width: 1, height: 1 } };
const h3Static = { type: 'sprite', assetKey: 'H3_art', sizeRatios: { width: 1, height: 1 } };
const h4Static = { type: 'sprite', assetKey: 'H4_art', sizeRatios: { width: 1, height: 1 } };

const l1Static = { type: 'sprite', assetKey: 'L1_art', sizeRatios: { width: 1, height: 1 } };
const l2Static = { type: 'sprite', assetKey: 'L2_art', sizeRatios: { width: 1, height: 1 } };
const l3Static = { type: 'sprite', assetKey: 'L3_art', sizeRatios: { width: 1, height: 1 } };
const l4Static = { type: 'sprite', assetKey: 'L4_art', sizeRatios: { width: 1, height: 1 } };

const sStatic = { type: 'sprite', assetKey: 'S_art', sizeRatios: { width: 1, height: 1 } };
const wStatic = { type: 'sprite', assetKey: 'W_art', sizeRatios: { width: 1, height: 1 } };


export const SYMBOL_INFO_MAP = {
	H1: {
		explosion,
		win: h1Static,
		postWinStatic: h1Static,
		static: h1Static,
		spin: h1Static,
		land: h1Static,
	},
	H2: {
		explosion,
		win: h2Static,
		postWinStatic: h2Static,
		static: h2Static,
		spin: h2Static,
		land: h2Static,
	},
	H3: {
		explosion,
		win: h3Static,
		postWinStatic: h3Static,
		static: h3Static,
		spin: h3Static,
		land: h3Static,
	},
	H4: {
		explosion,
		win: h4Static,
		postWinStatic: h4Static,
		static: h4Static,
		spin: h4Static,
		land: h4Static,
	},
	L1: {
		explosion,
		win: l1Static,
		postWinStatic: l1Static,
		static: l1Static,
		spin: l1Static,
		land: l1Static,
	},
	L2: {
		explosion,
		win: l2Static,
		postWinStatic: l2Static,
		static: l2Static,
		spin: l2Static,
		land: l2Static,
	},
	L3: {
		explosion,
		win: l3Static,
		postWinStatic: l3Static,
		static: l3Static,
		spin: l3Static,
		land: l3Static,
	},
	L4: {
		explosion,
		win: l4Static,
		postWinStatic: l4Static,
		static: l4Static,
		spin: l4Static,
		land: l4Static,
	},
	W: {
		explosion,
		postWinStatic: wStatic,
		static: wStatic,
		spin: wStatic,
		win: wStatic,
		land: wStatic,
	},
	S: {
		explosion,
		postWinStatic: sStatic,
		static: sStatic,
		spin: sStatic,
		win: sStatic,
		land: sStatic,
	},
} as const;

export const SCATTER_LAND_SOUND_MAP = {
	1: 'sfx_scatter_stop_1',
	2: 'sfx_scatter_stop_2',
	3: 'sfx_scatter_stop_3',
	4: 'sfx_scatter_stop_4',
	5: 'sfx_scatter_stop_5',
} as const;
