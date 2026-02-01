<script lang="ts">
	import { goto } from '$app/navigation';
	import { Icon } from '$lib/components/ui';

	interface Props {
		onInfoClick: () => void;
	}

	let { onInfoClick }: Props = $props();
</script>

<div class="top-right-buttons">
	<button class="icon-btn" onclick={onInfoClick} aria-label="App info">
		<Icon name="info" size={20} />
	</button>
	<button class="icon-btn" onclick={() => goto('/settings')} aria-label="Settings">
		<Icon name="settings" size={20} />
	</button>
</div>

<style>
	.top-right-buttons {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 40;
		display: flex;
		gap: 0.5rem;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 14px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease-out;
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.1),
			0 1px 3px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .icon-btn {
		background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.35),
			0 1px 3px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.icon-btn:hover {
		background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%);
		border-color: rgba(1, 178, 255, 0.3);
		color: var(--text-primary);
		transform: translateY(-2px);
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.12),
			0 2px 6px rgba(0, 0, 0, 0.08),
			0 0 0 2px rgba(1, 178, 255, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .icon-btn:hover {
		background: linear-gradient(180deg, #333333 0%, #282828 100%);
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.45),
			0 2px 6px rgba(0, 0, 0, 0.25),
			0 0 0 2px rgba(1, 178, 255, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.icon-btn:focus {
		outline: none;
		border-color: #01B2FF;
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.1),
			0 0 0 3px rgba(1, 178, 255, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .icon-btn:focus {
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.35),
			0 0 0 3px rgba(1, 178, 255, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.icon-btn:active {
		transform: translateY(0) scale(0.97);
		box-shadow:
			0 1px 4px rgba(0, 0, 0, 0.1),
			inset 0 2px 4px rgba(0, 0, 0, 0.06);
	}

	:global(.dark) .icon-btn:active {
		box-shadow:
			0 1px 4px rgba(0, 0, 0, 0.3),
			inset 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
