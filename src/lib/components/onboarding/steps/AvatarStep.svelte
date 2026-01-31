<script lang="ts">
	import { Icon } from '$lib/components/ui';
	import { vrmStore } from '$lib/stores/vrm.svelte';
	import VrmUploader from '$lib/components/vrm/VrmUploader.svelte';

	interface Props {
		onNext: () => void;
		onBack: () => void;
	}

	let { onNext, onBack }: Props = $props();

	let showUploader = $state(false);

	async function handleUpload(file: File) {
		await vrmStore.addModel(file);
		showUploader = false;
	}

	function selectModel(id: string) {
		vrmStore.setActiveModel(id);
	}
</script>

<div class="step-content">
	<div class="step-header">
		<Icon name="user" size={24} />
		<h2 class="title">Choose Your Avatar</h2>
		<p class="subtitle">Select a VRM model or upload your own</p>
	</div>

	<div class="gallery">
		{#each vrmStore.models as model (model.id)}
			<button
				class="model-card"
				class:active={model.id === vrmStore.activeModelId}
				onclick={() => selectModel(model.id)}
			>
				<div class="model-preview">
					{#if model.previewUrl}
						<img src={model.previewUrl} alt={model.name} />
					{:else}
						<Icon name="user" size={32} />
					{/if}
					{#if model.id === vrmStore.activeModelId}
						<div class="active-badge">
							<Icon name="check" size={14} strokeWidth={3} />
						</div>
					{/if}
				</div>
				<span class="model-name">{model.name}</span>
				{#if model.isDefault}
					<span class="default-badge">Default</span>
				{/if}
			</button>
		{/each}

		<button class="upload-card" onclick={() => showUploader = true}>
			<div class="upload-icon">
				<Icon name="upload" size={24} />
			</div>
			<span class="upload-text">Upload VRM</span>
		</button>
	</div>

	{#if showUploader}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="uploader-overlay" onclick={() => showUploader = false}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="uploader-container" onclick={(e) => e.stopPropagation()}>
				<div class="uploader-header">
					<h3>Upload VRM Model</h3>
					<button class="close-btn" onclick={() => showUploader = false}>
						<Icon name="x" size={18} />
					</button>
				</div>
				<VrmUploader onUpload={handleUpload} />
			</div>
		</div>
	{/if}

	<div class="actions">
		<button class="back-btn" onclick={onBack}>
			<Icon name="chevron-left" size={16} />
			Back
		</button>
		<button class="next-btn" onclick={onNext}>
			Next
			<Icon name="chevron-right" size={16} />
		</button>
	</div>
</div>

<style>
	.step-content {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		gap: 1.25rem;
	}

	.step-header {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
	}

	.title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.75rem;
	}

	.model-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--bg-tertiary);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		opacity: 0.7;
	}

	.model-card:hover {
		opacity: 1;
		background: var(--bg-tertiary);
	}

	.model-card.active {
		border-color: #01B2FF;
		background: #01B2FF;
		opacity: 1;
	}

	.model-card.active .model-name {
		color: white;
	}

	.model-card.active .default-badge {
		background: rgba(255, 255, 255, 0.2);
		color: white;
	}

	.model-card.active .model-preview {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	.model-preview {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: var(--bg-tertiary);
		border-radius: var(--radius-sm);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary);
	}

	.model-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.active-badge {
		position: absolute;
		top: 0.375rem;
		right: 0.375rem;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		color: #01B2FF;
		border-radius: 50%;
	}

	.model-name {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.default-badge {
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--text-tertiary);
		background: var(--bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--radius-xs);
	}

	.upload-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: transparent;
		border: 2px dashed var(--border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		min-height: 120px;
	}

	.upload-card:hover {
		border-color: #01B2FF;
		background: rgba(1, 178, 255, 0.08);
	}

	.upload-icon {
		color: var(--text-tertiary);
	}

	.upload-card:hover .upload-icon {
		color: #01B2FF;
	}

	.upload-text {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-tertiary);
	}

	.uploader-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
	}

	.uploader-container {
		background: var(--bg-primary);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-xl);
		max-width: 400px;
		width: 90%;
		overflow: hidden;
		box-shadow: var(--shadow-xl);
	}

	.uploader-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border-light);
	}

	.uploader-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: transparent;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.uploader-container :global(.uploader) {
		margin: 1rem;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.back-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.75rem 1.25rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.back-btn:hover {
		background: var(--bg-tertiary);
		color: var(--text-primary);
	}

	.next-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.75rem 1.5rem;
		background: #01B2FF;
		color: white;
		border: none;
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: var(--shadow-sm);
	}

	.next-btn:hover {
		background: #00a0e6;
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}
</style>
