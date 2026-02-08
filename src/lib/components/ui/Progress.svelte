<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		variant?: 'default' | 'energy' | 'loneliness' | 'boredom' | 'health' | 'tier' | 'affection';
		size?: 'sm' | 'md' | 'lg';
		gradientColor?: string;
		class?: string;
	}

	let {
		value,
		max = 100,
		variant = 'default',
		size = 'md',
		gradientColor,
		class: className = ''
	}: Props = $props();

	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div
	class="progress-root size-{size} {className}"
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
>
	<div
		class="progress-fill variant-{variant}"
		style="width: {percentage}%; {gradientColor ? `background: ${gradientColor}` : ''}"
	></div>
</div>

<style>
	.progress-root {
		position: relative;
		width: 100%;
		overflow: hidden;
		background: var(--bg-tertiary);
		border-radius: 9999px;
	}

	.progress-root.size-sm {
		height: 6px;
	}

	.progress-root.size-md {
		height: 8px;
	}

	.progress-root.size-lg {
		height: 12px;
	}

	.progress-fill {
		height: 100%;
		border-radius: 9999px;
		transition: width 0.3s ease-out;
	}

	.progress-fill.variant-default {
		background: var(--color-primary-500);
	}

	.progress-fill.variant-energy {
		background: linear-gradient(to right, #f9e154, #40c057);
	}

	.progress-fill.variant-loneliness {
		background: linear-gradient(to right, #40c057, #f06595);
	}

	.progress-fill.variant-boredom {
		background: linear-gradient(to right, #4dabf7, #fd7e14);
	}

	.progress-fill.variant-health {
		/* Uses gradientColor prop for dynamic color */
	}

	.progress-fill.variant-tier {
		background: linear-gradient(to right, #f06595, #ff8787);
	}

	.progress-fill.variant-affection {
		background: #01B2FF;
		box-shadow: 0 0 8px rgba(1, 178, 255, 0.4);
	}
</style>
