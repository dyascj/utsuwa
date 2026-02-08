import { browser } from '$app/environment';
import { webSpeechService } from '$lib/services/stt/web-speech';
import { groqSttService } from '$lib/services/stt/groq-stt';
import { isTauri } from '$lib/services/platform/platform';
import { settingsStore } from '$lib/stores/settings.svelte';

function createSttStore() {
	let isListening = $state(false);
	let isTranscribing = $state(false);
	let transcript = $state('');
	let interimTranscript = $state('');
	let error = $state<string | null>(null);
	let audioLevel = $state(0);
	let errorTimeout: ReturnType<typeof setTimeout> | null = null;

	// Use Groq if API key is configured (works on any platform), otherwise Web Speech
	const useGroq = $derived(browser && !!settingsStore.getProviderConfig('groq-stt').apiKey);

	async function startListening(onComplete: (text: string) => void) {
		if (!browser) return;
		if (isListening || isTranscribing) return;

		error = null;
		transcript = '';
		interimTranscript = '';
		audioLevel = 0.2;

		if (useGroq) {
			// Feed the latest API key to the service
			const config = settingsStore.getProviderConfig('groq-stt');
			if (config.apiKey) {
				groqSttService.setApiKey(config.apiKey);
			}

			const started = await groqSttService.startListening({
				onResult: (text, isFinal) => {
					if (isFinal) {
						transcript = transcript ? transcript + ' ' + text : text;
						interimTranscript = '';
					} else {
						interimTranscript = text;
					}
				},
				onEnd: () => {
					isListening = false;
					isTranscribing = false;
					audioLevel = 0;
					const finalText = transcript.trim();
					transcript = '';
					interimTranscript = '';
					if (finalText) {
						onComplete(finalText);
					}
				},
				onError: (err) => {
					console.error('[STT Store] Error:', err);
					setError(err);
					isListening = false;
					isTranscribing = false;
					transcript = '';
					interimTranscript = '';
					audioLevel = 0;
				},
				onAudioLevel: (level) => {
					audioLevel = level;
				}
			});

			if (started) {
				isListening = true;
			}
		} else {
			const started = webSpeechService.startListening({
				onResult: (text, isFinal) => {
					if (isFinal) {
						transcript = transcript ? transcript + ' ' + text : text;
						interimTranscript = '';
						audioLevel = 0.3;
					} else {
						interimTranscript = text;
						audioLevel = 0.5 + Math.random() * 0.5;
					}
				},
				onEnd: () => {
					isListening = false;
					audioLevel = 0;
					const finalText = transcript.trim();
					transcript = '';
					interimTranscript = '';
					if (finalText) {
						onComplete(finalText);
					}
				},
				onError: (err) => {
					console.error('[STT Store] Error:', err);
					setError(err);
					isListening = false;
					transcript = '';
					interimTranscript = '';
					audioLevel = 0;
				}
			});

			if (started) {
				isListening = true;
			}
		}
	}

	function stopListening() {
		if (useGroq) {
			// Groq: stop recording → triggers async transcription
			isTranscribing = true;
			groqSttService.stopListening();
		} else {
			webSpeechService.stopListening();
		}
	}

	function cancel() {
		if (useGroq) {
			groqSttService.abort();
		} else {
			webSpeechService.abort();
		}
		isListening = false;
		isTranscribing = false;
		transcript = '';
		interimTranscript = '';
		audioLevel = 0;
	}

	function isSupported() {
		if (!browser) return false;
		// Groq works if API key is configured and mic access available
		const groqReady = groqSttService.isSupported() && !!settingsStore.getProviderConfig('groq-stt').apiKey;
		if (groqReady) return true;
		// Web Speech only works in browsers (not Tauri's webview)
		if (!isTauri() && webSpeechService.isSupported()) return true;
		return false;
	}

	function showUnsupportedError() {
		if (isTauri()) {
			setError('Add your Groq API key in Settings → Persona for voice input on desktop.');
		} else {
			setError('Voice input is not supported in this browser. Add a Groq API key in Settings → Persona, or try Chrome/Edge.');
		}
	}

	function setError(message: string) {
		if (errorTimeout) {
			clearTimeout(errorTimeout);
		}
		error = message;
		errorTimeout = setTimeout(() => {
			error = null;
			errorTimeout = null;
		}, 4000);
	}

	function clearError() {
		if (errorTimeout) {
			clearTimeout(errorTimeout);
			errorTimeout = null;
		}
		error = null;
	}

	return {
		get isListening() {
			return isListening;
		},
		get isTranscribing() {
			return isTranscribing;
		},
		get transcript() {
			return transcript;
		},
		get interimTranscript() {
			return interimTranscript;
		},
		get displayTranscript() {
			if (transcript && interimTranscript) {
				return transcript + ' ' + interimTranscript;
			}
			return transcript || interimTranscript;
		},
		get error() {
			return error;
		},
		get audioLevel() {
			return audioLevel;
		},
		startListening,
		stopListening,
		cancel,
		isSupported,
		showUnsupportedError,
		clearError
	};
}

export const sttStore = createSttStore();
