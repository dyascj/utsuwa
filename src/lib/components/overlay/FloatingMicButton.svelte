<script lang="ts">
	import { Icon } from '$lib/components/ui';
	import { sttStore } from '$lib/stores/stt.svelte';

	interface Props {
		onTranscript: (text: string) => void;
	}

	let { onTranscript }: Props = $props();

	const isListening = $derived(sttStore.isListening);
	const isTranscribing = $derived(sttStore.isTranscribing);

	function handleClick() {
		if (isTranscribing) return;

		if (isListening) {
			sttStore.stopListening();
		} else if (sttStore.isSupported()) {
			sttStore.startListening(onTranscript);
		} else {
			sttStore.showUnsupportedError();
		}
	}
</script>

{#if isListening}
	<div class="recording-container">
		<div class="listening-pill">
			<span class="listening-dot"></span>
			<span class="listening-text">Listening</span>
		</div>
		<button
			class="floating-mic-btn recording"
			onclick={handleClick}
			aria-label="Stop recording"
			title="Stop recording"
		>
			<span class="icon-inner">
				<Icon name="stop" size={18} />
			</span>
			<span class="pulse-ring"></span>
		</button>
	</div>
{:else if isTranscribing}
	<div class="recording-container">
		<div class="listening-pill transcribing-pill">
			<span class="listening-text">Transcribing...</span>
		</div>
		<button
			class="floating-mic-btn transcribing"
			disabled
			aria-label="Transcribing"
		>
			<span class="icon-inner">
				<Icon name="loader" size={20} />
			</span>
		</button>
	</div>
{:else}
	<button
		class="floating-mic-btn"
		onclick={handleClick}
		aria-label="Quick voice input"
		title="Quick voice input"
	>
		<span class="icon-inner">
			<Icon name="mic" size={20} />
		</span>
		<span class="btn-shine"></span>
	</button>
{/if}

<style>
	.floating-mic-btn {
		width: 48px;
		height: 48px;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		position: relative;
		overflow: hidden;

		background: linear-gradient(
			180deg,
			#66d9ff 0%,
			#4dd0ff 25%,
			#01B2FF 60%,
			#0099dd 100%
		);
		color: white;
		box-shadow:
			0 4px 16px rgba(1, 178, 255, 0.45),
			0 2px 4px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			inset 0 -1px 0 rgba(0, 0, 0, 0.1);
	}

	.floating-mic-btn:hover {
		background: linear-gradient(
			180deg,
			#80e0ff 0%,
			#66d9ff 25%,
			#1ebfff 60%,
			#00a6e6 100%
		);
		transform: translateY(-2px);
		box-shadow:
			0 6px 24px rgba(1, 178, 255, 0.55),
			0 3px 6px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			inset 0 -1px 0 rgba(0, 0, 0, 0.1);
	}

	.floating-mic-btn:active {
		transform: translateY(0) scale(0.96);
	}

	.floating-mic-btn.recording {
		background: linear-gradient(
			180deg,
			#ff4444 0%,
			#ee3333 50%,
			#cc2222 100%
		);
		box-shadow:
			0 4px 16px rgba(255, 68, 68, 0.5),
			0 2px 4px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			inset 0 -1px 0 rgba(0, 0, 0, 0.1);
		animation: pulse-glow 1.5s ease-in-out infinite;
	}

	.floating-mic-btn.transcribing {
		background: linear-gradient(
			180deg,
			#666 0%,
			#555 50%,
			#444 100%
		);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		cursor: wait;
	}

	.floating-mic-btn.transcribing .icon-inner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes pulse-glow {
		0%, 100% {
			box-shadow:
				0 4px 16px rgba(255, 68, 68, 0.5),
				0 2px 4px rgba(0, 0, 0, 0.1),
				inset 0 1px 0 rgba(255, 255, 255, 0.3);
		}
		50% {
			box-shadow:
				0 4px 24px rgba(255, 68, 68, 0.7),
				0 2px 4px rgba(0, 0, 0, 0.1),
				inset 0 1px 0 rgba(255, 255, 255, 0.3);
		}
	}

	.icon-inner {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-shine {
		position: absolute;
		top: 0;
		left: 0;
		right: 50%;
		height: 50%;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.4) 0%,
			rgba(255, 255, 255, 0) 100%
		);
		border-radius: 50% 50% 0 0;
		pointer-events: none;
	}

	.pulse-ring {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 2px solid rgba(255, 68, 68, 0.4);
		animation: pulse-ring-anim 1.5s ease-out infinite;
	}

	@keyframes pulse-ring-anim {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.4);
			opacity: 0;
		}
	}

	.recording-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		position: relative;
	}

	.listening-pill {
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		white-space: nowrap;
		animation: pill-appear 0.25s ease-out;

		background: linear-gradient(
			180deg,
			#3a3a3e 0%,
			#2a2a2e 50%,
			#222224 100%
		);
		color: #ff6b6b;
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.4),
			0 1px 2px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			inset 0 -1px 0 rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.transcribing-pill {
		color: rgba(255, 255, 255, 0.7);
	}

	.listening-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #ff4444;
		box-shadow: 0 0 6px rgba(255, 68, 68, 0.6);
		animation: dot-blink 1.2s ease-in-out infinite;
	}

	.listening-text {
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	@keyframes dot-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	@keyframes pill-appear {
		from {
			opacity: 0;
			transform: translateY(4px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
