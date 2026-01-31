<script lang="ts">
	import { Icon } from '$lib/components/ui';
	import { vrmStore } from '$lib/stores/vrm.svelte';

	interface Props {
		characterName: string;
		onComplete: () => void;
	}

	let { characterName, onComplete }: Props = $props();

	const activeModel = $derived(vrmStore.models.find((m) => m.id === vrmStore.activeModelId));
</script>

<div class="complete-wrapper">
	<div class="complete-layout">
		<div class="avatar-box">
			{#if activeModel?.previewUrl}
				<img src={activeModel.previewUrl} alt={activeModel.name} />
			{:else}
				<div class="avatar-fallback">
					<Icon name="user" size={48} />
				</div>
			{/if}
		</div>

		<div class="text-box">
			<p class="greeting">Hi, I'm <strong>{characterName}</strong>!</p>
			<p class="tagline">Your new AI companion</p>
			<button class="start-btn" onclick={onComplete}>
				Start Chatting
			</button>
		</div>
	</div>
</div>

<style>
	.complete-wrapper {
		padding: 2rem 1.5rem;
		display: flex;
		justify-content: center;
	}

	.complete-layout {
		display: flex;
		gap: 1.25rem;
		align-items: center;
	}

	.avatar-box {
		width: 100px;
		height: 100px;
	}

	.avatar-box img {
		width: 100%;
		height: 100%;
		border-radius: var(--radius-lg);
		object-fit: cover;
		background: var(--bg-secondary);
		display: block;
	}

	.avatar-fallback {
		width: 100px;
		height: 100px;
		border-radius: var(--radius-lg);
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary);
	}

	.text-box {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.greeting {
		font-size: 1.125rem;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.4;
	}

	.greeting strong {
		font-weight: 600;
	}

	.tagline {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.start-btn {
		margin-top: 0.75rem;
		padding: 0.625rem 1.25rem;
		background: #01B2FF;
		color: white;
		border: none;
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: var(--shadow-sm);
		width: fit-content;
	}

	.start-btn:hover {
		background: #00a0e6;
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}
</style>
