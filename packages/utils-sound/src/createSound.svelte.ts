import { Howl, Howler } from 'howler';

import { type LoadedAudio } from 'pixi-svelte';
import { stateSoundDerived } from 'state-shared';

import { createPlayer, type Player } from './createPlayer.svelte';
import { createPlayMusic } from './createPlayMusic.svelte';
import { createPlayLoop } from './createPlayLoop.svelte';
import { createPlayOnce } from './createPlayOnce.svelte';
import type { FadeOptions, RateOptions, StopOptions } from './types';

function createSound<TSoundName extends string>() {
	type PlayMusic = ReturnType<typeof createPlayMusic<TSoundName>>['play'];
	type PlayLoop = ReturnType<typeof createPlayLoop<TSoundName>>['play'];
	type PlayOnce = ReturnType<typeof createPlayOnce<TSoundName>>['play'];

	let loadedAudio: LoadedAudio<TSoundName>;
	let audioContextState = $state<AudioContext['state']>('running');
	let visibilityState = $state<DocumentVisibilityState>('visible');
	let players: {
		music: Player<TSoundName, PlayMusic>;
		loop: Player<TSoundName, PlayLoop>;
		once: Player<TSoundName, PlayOnce>;
	};

	const load = (loadedAudioValue: LoadedAudio<TSoundName>) => {
		// loadedAudio
		loadedAudio = loadedAudioValue;

		let destroyed = false;
		let objectUrl: string | null = null;
		let howl: Howl | null = null;

		const onAudioContextChange = () => (audioContextState = Howler.ctx.state);
		const onVisibilityStateChange = () => (visibilityState = document.visibilityState);

		const getMimeType = (url: string) => {
			if (/\.mp3($|\?)/i.test(url)) return 'audio/mpeg';
			if (/\.ogg($|\?)/i.test(url)) return 'audio/ogg';
			if (/\.m4a($|\?)/i.test(url)) return 'audio/mp4';
			if (/\.ac3($|\?)/i.test(url)) return 'audio/ac3';
			return 'application/octet-stream';
		};

		// Howler picks the codec from the URL extension and rejects URLs without one
		// (e.g. blob: URLs) with "No codec support for selected audio sources." Passing
		// the extension explicitly via the `format` option lets Howler accept the blob URL.
		const getFormat = (url: string) => {
			const clean = url.split('?')[0].split('#')[0];
			const match = /\.([^.]+)$/.exec(clean);
			return match ? match[1].toLowerCase() : undefined;
		};

		const setupPlayers = (src: string | string[], html5: boolean, format?: string[]) => {
			if (destroyed) return;

			const howlInstance = new Howl({
				src,
				sprite: loadedAudio.sprite,
				volume: 1,
				html5,
				format,
			});
			howl = howlInstance;

			// players
			players = {
				music: createPlayer<TSoundName, PlayMusic>({ loadedAudio, loop: true, howl: howlInstance, createPlay: createPlayMusic<TSoundName> }), // prettier-ignore
				loop: createPlayer<TSoundName, PlayLoop>({ loadedAudio, loop: true, howl: howlInstance, createPlay: createPlayLoop<TSoundName> }), // prettier-ignore
				once: createPlayer<TSoundName, PlayOnce>({ loadedAudio, loop: false, howl: howlInstance, createPlay: createPlayOnce<TSoundName> }), //  prettier-ignore
			};

			// audioContextState and visibilityState
			Howler.ctx.addEventListener('statechange', onAudioContextChange);
			document.addEventListener('visibilitychange', onVisibilityStateChange);

			// apply the current volume settings to the freshly created players
			volumeMusicEffect();
			volumeLoopEffect();
			volumeOnceEffect();
		};

		// Preload the audio ourselves with a Range request and hand Howler a Blob URL.
		// Some dev servers/browsers cancel a plain GET of an audio file with a 204 (empty
		// body -> "Decoding audio data failed"), while a ranged request returns the whole
		// file (206). Loading from a Blob keeps Howler on the WebAudio path, which supports
		// real audio sprites and overlapping one-shot effects.
		const preload = async () => {
			const srcList = Array.isArray(loadedAudio.src) ? loadedAudio.src : [loadedAudio.src];

			for (const rawSrc of srcList) {
				try {
					const response = await fetch(rawSrc, { headers: { Range: 'bytes=0-' } });
					if (!response.ok && response.status !== 206) continue;

					const buffer = await response.arrayBuffer();
					if (buffer.byteLength === 0) continue;

					objectUrl = URL.createObjectURL(
						new Blob([buffer], { type: getMimeType(rawSrc) }),
					);

					if (destroyed) {
						URL.revokeObjectURL(objectUrl);
						objectUrl = null;
						return;
					}

					const format = getFormat(rawSrc);
					setupPlayers(objectUrl, false, format ? [format] : undefined);
					return;
				} catch (error) {
					// try the next source
				}
			}

			// Fallback: let Howler load the source directly through the HTML5 media path.
			if (!destroyed) setupPlayers(loadedAudio.src, true);
		};

		preload();

		const destroy = () => {
			destroyed = true;

			Howler.ctx.removeEventListener('statechange', onAudioContextChange);
			document.removeEventListener('visibilitychange', onVisibilityStateChange);

			if (howl) howl.unload();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};

		return {
			destroy,
		};
	};

	const stop = (stopOptions: StopOptions<TSoundName>) => {
		if (players) {
			players.music.stop(stopOptions);
			players.loop.stop(stopOptions);
			players.once.stop(stopOptions);
		}
	};

	const fade = async (fadeOptions: FadeOptions<TSoundName>) => {
		if (players) {
			const getPromises = () => [
				players.music.fade(fadeOptions),
				players.loop.fade(fadeOptions),
				players.once.fade(fadeOptions),
			];

			await Promise.all(getPromises());
		}
	};

	const rate = (rateOptions: RateOptions<TSoundName>) => {
		if (players) {
			players.music.rate(rateOptions);
			players.loop.rate(rateOptions);
			players.once.rate(rateOptions);
		}
	};

	const disable = () => {
		Howler.volume(0);
		Howler.mute(true);
	};

	const enable = () => {
		Howler.volume(1);
		Howler.mute(false);
	};

	const enableEffect = () => {
		$effect(() => {
			if (audioContextState === 'running' && visibilityState === 'visible') {
				enable();
			} else {
				disable();
			}
		});
	};


	const volumeMusicEffect = () => {
		if (players) {
			players.music.volume(stateSoundDerived.volumeMusic());
		}
	};

	const volumeLoopEffect = () => {
		if (players) {
			players.loop.volume(stateSoundDerived.volumeSoundEffect());
		}
	};

	const volumeOnceEffect = () => {
		if (players) {
			players.once.volume(stateSoundDerived.volumeSoundEffect());
		}
	};

	const volumeEffect = () => {
		$effect(() => {
			volumeMusicEffect();
		});

		$effect(() => {
			volumeLoopEffect();
		});

		$effect(() => {
			volumeOnceEffect();
		});
	};

	return {
		load,
		stop,
		fade,
		rate,
		volumeEffect,
		enableEffect,
		get players() {
			return players;
		},
	};
}

export { createSound };
