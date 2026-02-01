<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from './Icon.svelte';

	interface Props {
		stat: string;
		delta: number;
		color: string;
		icon: string;
		onComplete?: () => void;
	}

	let { stat, delta, color, icon, onComplete }: Props = $props();

	// Design language colors - skeuomorphic style
	const INDICATOR_COLORS = {
		light: {
			background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
			border: 'rgba(0, 0, 0, 0.08)',
			shadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
		},
		dark: {
			background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
			border: 'rgba(255, 255, 255, 0.1)',
			shadow: '0 4px 12px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
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

	const bgColor = $derived(isDark ? INDICATOR_COLORS.dark.background : INDICATOR_COLORS.light.background);
	const borderColor = $derived(isDark ? INDICATOR_COLORS.dark.border : INDICATOR_COLORS.light.border);
	const shadowStyle = $derived(isDark ? INDICATOR_COLORS.dark.shadow : INDICATOR_COLORS.light.shadow);

	// Trigger completion callback after animation
	$effect(() => {
		const timer = setTimeout(() => {
			onComplete?.();
		}, 2000);

		return () => clearTimeout(timer);
	});
</script>

<div class="indicator" style="--stat-color: {color}; background: {bgColor}; border-color: {borderColor}; box-shadow: {shadowStyle}">
	<Icon name={icon} size={14} />
	<span class="delta">{delta > 0 ? '+' : ''}{delta}</span>
</div>

<style>
	.indicator {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-radius: 20px;
		border: 1px solid;
		color: var(--stat-color);
		font-weight: 700;
		font-size: 0.875rem;
		white-space: nowrap;
		animation: float-fade 2s ease-out forwards;
	}

	.delta {
		font-variant-numeric: tabular-nums;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	@keyframes float-fade {
		0% {
			opacity: 0;
			transform: translateY(10px) scale(0.8);
		}
		15% {
			opacity: 1;
			transform: translateY(0) scale(1.05);
		}
		25% {
			transform: translateY(-5px) scale(1);
		}
		70% {
			opacity: 1;
			transform: translateY(-40px) scale(1);
		}
		100% {
			opacity: 0;
			transform: translateY(-60px) scale(0.9);
		}
	}
</style>
