<script lang="ts">
	import { Icon } from '$lib/components/ui';

	interface Props {
		name: string;
		systemPrompt: string;
		onNameChange: (name: string) => void;
		onSystemPromptChange: (prompt: string) => void;
		onNext: () => void;
		onBack: () => void;
	}

	let { name, systemPrompt, onNameChange, onSystemPromptChange, onNext, onBack }: Props = $props();

	const isValid = $derived(name.trim().length > 0);
</script>

<div class="step-content">
	<div class="step-header">
		<Icon name="user" size={24} />
		<h2 class="title">Name Your Companion</h2>
		<p class="subtitle">Give your AI companion a name and personality</p>
	</div>

	<div class="form-group">
		<label for="name" class="label">Name</label>
		<input
			id="name"
			type="text"
			class="input"
			value={name}
			oninput={(e) => onNameChange(e.currentTarget.value)}
			placeholder="Enter a name..."
		/>
	</div>

	<div class="form-group">
		<label for="personality" class="label">Core Personality</label>
		<textarea
			id="personality"
			class="textarea"
			value={systemPrompt}
			oninput={(e) => onSystemPromptChange(e.currentTarget.value)}
			placeholder="Describe their personality, speaking style, background..."
			rows="5"
		></textarea>
		<span class="hint">This shapes how your companion talks and behaves</span>
	</div>

	<div class="actions">
		<button class="back-btn" onclick={onBack}>
			<Icon name="chevron-left" size={16} />
			Back
		</button>
		<button class="next-btn" onclick={onNext} disabled={!isValid}>
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

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.input {
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		color: var(--text-primary);
		transition: all 0.2s;
	}

	.input:focus {
		outline: none;
		border-color: #01B2FF;
		box-shadow: 0 0 0 3px rgba(1, 178, 255, 0.15);
	}

	.input::placeholder {
		color: var(--text-tertiary);
	}

	.textarea {
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		color: var(--text-primary);
		font-family: inherit;
		resize: vertical;
		min-height: 100px;
		line-height: 1.6;
		transition: all 0.2s;
	}

	.textarea:focus {
		outline: none;
		border-color: #01B2FF;
		box-shadow: 0 0 0 3px rgba(1, 178, 255, 0.15);
	}

	.textarea::placeholder {
		color: var(--text-tertiary);
	}

	.hint {
		font-size: 0.75rem;
		color: var(--text-tertiary);
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

	.next-btn:hover:not(:disabled) {
		background: #00a0e6;
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.next-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
