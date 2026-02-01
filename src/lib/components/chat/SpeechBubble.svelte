<script lang="ts">
	import { browser } from '$app/environment';
	import { vrmStore } from '$lib/stores/vrm.svelte';

	interface Props {
		message: string;
		isTyping?: boolean;
		onHide?: () => void;
	}

	let { message, isTyping = false, onHide }: Props = $props();

	// Design language colors - skeuomorphic style
	const BUBBLE_COLORS = {
		light: {
			background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
			border: 'rgba(0, 0, 0, 0.08)',
			text: '#1a1a1a',
			dots: '#01B2FF',
			shadow: '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
			tailColor: '#f5f5f5'
		},
		dark: {
			background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
			border: 'rgba(255, 255, 255, 0.1)',
			text: '#fafafa',
			dots: '#01B2FF',
			shadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
			tailColor: '#1f1f1f'
		}
	};

	// Detect dark mode
	let isDark = $state(false);
	$effect(() => {
		if (browser) {
			const checkDark = () => {
				isDark = document.documentElement.classList.contains('dark');
			};
			checkDark();
			const observer = new MutationObserver(checkDark);
			observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
			return () => observer.disconnect();
		}
	});

	// Simple color getters based on dark mode
	const glassBackground = $derived(() => {
		return isDark ? BUBBLE_COLORS.dark.background : BUBBLE_COLORS.light.background;
	});
	const glassBorder = $derived(() => {
		return isDark ? BUBBLE_COLORS.dark.border : BUBBLE_COLORS.light.border;
	});
	const glassShadow = $derived(() => {
		return isDark ? BUBBLE_COLORS.dark.shadow : BUBBLE_COLORS.light.shadow;
	});
	const tailColor = $derived(() => {
		return isDark ? BUBBLE_COLORS.dark.tailColor : BUBBLE_COLORS.light.tailColor;
	});
	const textColor = $derived(() => {
		return isDark ? BUBBLE_COLORS.dark.text : BUBBLE_COLORS.light.text;
	});
	const dotsColor = $derived(() => {
		return isDark ? BUBBLE_COLORS.dark.dots : BUBBLE_COLORS.light.dots;
	});

	// Get screen position from VRM store for 3D tracking
	const screenPos = $derived(vrmStore.headScreenPosition);

	// Calculate bubble position (offset to the right of head)
	// Typing indicator appears closer to model, message bubble has more offset
	const bubbleStyle = $derived(() => {
		if (!screenPos) {
			// Fallback to fixed position if no tracking available
			return isTyping ? 'top: 25%; right: 25%;' : 'top: 22%; right: 15%;';
		}

		if (isTyping) {
			// Typing indicator: closer to the head
			const x = Math.min(Math.max(screenPos.x - 2, 5), 75);
			const y = Math.min(Math.max(screenPos.y - 6, 5), 60);
			return `top: ${y}%; left: ${x}%;`;
		} else {
			// Message: current position with more offset
			const x = Math.min(Math.max(screenPos.x + 3, 5), 80);
			const y = Math.min(Math.max(screenPos.y - 8, 5), 65);
			return `top: ${y}%; left: ${x}%;`;
		}
	});

	let visible = $state(true);

	// Reset visibility when new message/typing starts
	$effect(() => {
		if (message || isTyping) {
			visible = true;
		}
	});

	function handleClick() {
		visible = false;
		onHide?.();
	}
</script>

{#if visible && (message || isTyping)}
	<div class="speech-bubble-container" role="status" aria-live="polite" style={bubbleStyle()}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="speech-bubble"
			class:dark={isDark}
			onclick={handleClick}
			style="background: {glassBackground()}; border-color: {glassBorder()}; box-shadow: {glassShadow()};"
		>
			<div class="speech-bubble-content">
				{#if isTyping}
					<div class="typing-indicator" style="--dot-color: {dotsColor()}">
						<span></span>
						<span></span>
						<span></span>
					</div>
				{:else}
					<p class="message" style="color: {textColor()}">{message}</p>
				{/if}
			</div>
			<div class="bubble-tail" style="border-right-color: {tailColor()}"></div>
		</div>
	</div>
{/if}

<style>
	.speech-bubble-container {
		position: fixed;
		z-index: 50;
		pointer-events: none;
		animation: fadeIn 0.25s ease-out;
		/* Position set dynamically via style attribute */
		transition: top 0.1s ease-out, left 0.1s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.speech-bubble {
		position: relative;
		max-width: 280px;
		min-width: 60px;
		max-height: 120px;
		overflow: hidden;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid;
		border-radius: 16px;
		pointer-events: auto;
		cursor: pointer;
		transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
	}

	.speech-bubble:hover {
		transform: scale(1.02) translateY(-1px);
	}

	.speech-bubble-content {
		max-height: 120px;
		overflow-y: auto;
		padding: 0.75rem 1rem;
	}

	/* Custom scrollbar */
	.speech-bubble-content::-webkit-scrollbar {
		width: 6px;
	}

	.speech-bubble-content::-webkit-scrollbar-track {
		background: transparent;
		margin: 4px 0;
	}

	.speech-bubble-content::-webkit-scrollbar-thumb {
		background: var(--scrollbar-thumb);
		border-radius: 3px;
	}

	.speech-bubble-content::-webkit-scrollbar-thumb:hover {
		background: var(--scrollbar-thumb-hover);
	}

	.bubble-tail {
		position: absolute;
		left: -8px;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-top: 8px solid transparent;
		border-bottom: 8px solid transparent;
		border-right: 10px solid;
	}

	.message {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.5;
		word-wrap: break-word;
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		padding: 0.125rem 0;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		background: linear-gradient(180deg, #4dd0ff 0%, var(--dot-color) 100%);
		border-radius: 50%;
		animation: bounce 1.4s ease-in-out infinite;
		box-shadow:
			0 2px 4px rgba(1, 178, 255, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: 0s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-indicator span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes bounce {
		0%, 60%, 100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-4px);
		}
	}

	@media (max-width: 640px) {
		.speech-bubble {
			max-width: 220px;
		}
	}
</style>
