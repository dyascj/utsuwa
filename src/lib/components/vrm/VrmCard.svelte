<script lang="ts">
	import type { VrmModel } from '$lib/stores/vrm.svelte';
	import { Icon } from '$lib/components/ui';

	interface Props {
		model: VrmModel;
		isActive: boolean;
		onSelect: () => void;
		onDelete?: () => void;
	}

	let { model, isActive, onSelect, onDelete }: Props = $props();
</script>

<div class="vrm-card" class:active={isActive}>
	<button class="card-content" onclick={onSelect}>
		<div class="preview">
			{#if model.previewUrl}
				<img src={model.previewUrl} alt={model.name} />
			{:else}
				<div class="preview-placeholder">
					<Icon name="user" size={32} strokeWidth={1.5} />
				</div>
			{/if}
			{#if isActive}
				<div class="active-badge">
					<Icon name="check" size={14} strokeWidth={3} />
				</div>
			{/if}
		</div>
		<div class="info">
			<span class="name">{model.name}</span>
			{#if model.isDefault}
				<span class="badge">Default</span>
			{/if}
		</div>
	</button>

	{#if !model.isDefault && onDelete}
		<button class="delete-btn" onclick={onDelete} title="Delete model">
			<Icon name="trash" size={16} />
		</button>
	{/if}
</div>

<style>
	.vrm-card {
		position: relative;
		background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 1rem;
		overflow: hidden;
		transition: all 0.2s ease-out;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.08),
			0 2px 4px rgba(0, 0, 0, 0.04),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .vrm-card {
		background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.3),
			0 2px 4px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.vrm-card:hover {
		transform: translateY(-2px);
		box-shadow:
			0 8px 20px rgba(0, 0, 0, 0.12),
			0 4px 8px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .vrm-card:hover {
		box-shadow:
			0 8px 20px rgba(0, 0, 0, 0.4),
			0 4px 8px rgba(0, 0, 0, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.vrm-card.active {
		border-color: #01B2FF;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.08),
			0 0 16px rgba(1, 178, 255, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .vrm-card.active {
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.3),
			0 0 20px rgba(1, 178, 255, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		text-align: left;
	}

	.preview {
		position: relative;
		aspect-ratio: 1;
		background: var(--color-neutral-200);
		overflow: hidden;
	}

	:global(.dark) .preview {
		background: var(--color-neutral-700);
	}

	.preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: var(--color-neutral-400);
	}

	.active-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(180deg, #4ade80 0%, #22c55e 50%, #16a34a 100%);
		color: white;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow:
			0 3px 8px rgba(34, 197, 94, 0.4),
			0 1px 2px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	.info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.75rem;
	}

	.name {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-neutral-800);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.dark) .name {
		color: var(--color-neutral-200);
	}

	.badge {
		flex-shrink: 0;
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 100%);
		color: white;
		border-radius: 0.375rem;
		text-transform: uppercase;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
		box-shadow:
			0 2px 4px rgba(1, 178, 255, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.delete-btn {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(180deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		color: white;
		cursor: pointer;
		opacity: 0;
		transition: all 0.15s;
		box-shadow:
			0 3px 8px rgba(239, 68, 68, 0.35),
			0 1px 2px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.vrm-card:hover .delete-btn {
		opacity: 1;
	}

	.delete-btn:hover {
		background: linear-gradient(180deg, #fca5a5 0%, #f87171 50%, #ef4444 100%);
		box-shadow:
			0 4px 10px rgba(239, 68, 68, 0.45),
			0 2px 4px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}
</style>
