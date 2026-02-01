<script lang="ts">
	import { Icon } from '$lib/components/ui';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		exportSave,
		importSave,
		validateSaveFile,
		getSaveFilePreview,
		downloadSaveFile,
		clearAllData,
		type SaveFile,
		type SaveFilePreview,
		type LegacySaveFile
	} from '$lib/db/export';

	let isExporting = $state(false);
	let isImporting = $state(false);
	let isClearing = $state(false);
	let showClearConfirm = $state(false);

	let importFile = $state<File | null>(null);
	let importPreview = $state<SaveFilePreview | null>(null);
	let importMode = $state<'merge' | 'replace'>('replace');
	let importError = $state<string | null>(null);
	let importSuccess = $state<{ imported: number; skipped: number } | null>(null);

	let fileInput: HTMLInputElement;

	async function handleExport() {
		isExporting = true;
		try {
			const saveFile = await exportSave();
			downloadSaveFile(saveFile);
		} catch (e) {
			console.error('Export failed:', e);
		} finally {
			isExporting = false;
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		importFile = file;
		importError = null;
		importSuccess = null;
		importPreview = null;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target?.result as string);
				const validated = validateSaveFile(json);

				if (!validated) {
					importError = 'Invalid save file format';
					importFile = null;
					return;
				}

				importPreview = getSaveFilePreview(validated);
			} catch {
				importError = 'Failed to parse JSON file';
				importFile = null;
			}
		};
		reader.readAsText(file);
	}

	async function handleImport() {
		if (!importFile || !importPreview) return;

		isImporting = true;
		importError = null;

		try {
			const reader = new FileReader();
			const saveFile = await new Promise<SaveFile | LegacySaveFile>((resolve, reject) => {
				reader.onload = (e) => {
					try {
						const json = JSON.parse(e.target?.result as string);
						const validated = validateSaveFile(json);
						if (!validated) reject(new Error('Invalid save file'));
						else resolve(validated);
					} catch {
						reject(new Error('Failed to parse file'));
					}
				};
				reader.onerror = () => reject(new Error('Failed to read file'));
				reader.readAsText(importFile!);
			});

			const result = await importSave(saveFile, importMode);
			importSuccess = result;
			importFile = null;
			importPreview = null;

			// Refresh the page after a short delay to reload stores
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (e) {
			importError = e instanceof Error ? e.message : 'Import failed';
		} finally {
			isImporting = false;
		}
	}

	function cancelImport() {
		importFile = null;
		importPreview = null;
		importError = null;
		importSuccess = null;
		if (fileInput) fileInput.value = '';
	}

	async function handleClear() {
		if (!showClearConfirm) {
			showClearConfirm = true;
			return;
		}

		isClearing = true;
		try {
			await clearAllData();
			showClearConfirm = false;
			// Refresh to reset stores
			setTimeout(() => {
				window.location.reload();
			}, 500);
		} catch (e) {
			console.error('Clear failed:', e);
		} finally {
			isClearing = false;
		}
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="data-management">
	<h2 class="section-title">Data Management</h2>
	<p class="section-description">
		Export your data as a save file or import a previous save. All data is stored locally in your
		browser.
	</p>

	<div class="actions">
		<!-- Export -->
		<div class="action-card">
			<div class="action-header">
				<Icon name="download" size={20} />
				<h3>Export Save</h3>
			</div>
			<p class="action-description">
				Download all your data as a JSON file. Includes character states, memories, conversation
				history, and milestones.
			</p>
			<Button onclick={handleExport} disabled={isExporting}>
				{#snippet children()}
					{#if isExporting}
						Exporting...
					{:else}
						<Icon name="download" size={16} />
						Download Save File
					{/if}
				{/snippet}
			</Button>
		</div>

		<!-- Import -->
		<div class="action-card">
			<div class="action-header">
				<Icon name="upload" size={20} />
				<h3>Import Save</h3>
			</div>
			<p class="action-description">Restore data from a previously exported save file.</p>

			<input
				type="file"
				accept=".json"
				onchange={handleFileSelect}
				bind:this={fileInput}
				class="file-input"
			/>

			{#if importError}
				<div class="error-message">
					<Icon name="warning" size={16} />
					{importError}
				</div>
			{/if}

			{#if importSuccess}
				<div class="success-message">
					<Icon name="check" size={16} />
					Imported {importSuccess.imported} records
					{#if importSuccess.skipped > 0}
						(skipped {importSuccess.skipped})
					{/if}
					- Reloading...
				</div>
			{/if}

			{#if importPreview && !importSuccess}
				<div class="import-preview">
					<div class="preview-header">
						<Icon name="file" size={16} />
						<span>Save File Preview</span>
					</div>
					<div class="preview-details">
						<div class="preview-row">
							<span class="label">Exported:</span>
							<span class="value">{formatDate(importPreview.exportedAt)}</span>
						</div>
						<div class="preview-row">
							<span class="label">Character:</span>
							<span class="value">{importPreview.characterName || 'Unknown'}</span>
						</div>
						<div class="preview-row">
							<span class="label">Records:</span>
							<span class="value">
								{importPreview.counts.facts} facts, {importPreview.counts.conversationTurns} messages
							</span>
						</div>
					</div>

					<div class="import-mode">
						<label class="mode-option">
							<input type="radio" bind:group={importMode} value="replace" />
							<span class="mode-label">Replace</span>
							<span class="mode-description">Clear existing data and import</span>
						</label>
						<label class="mode-option">
							<input type="radio" bind:group={importMode} value="merge" />
							<span class="mode-label">Merge</span>
							<span class="mode-description">Add to existing data (skip duplicates)</span>
						</label>
					</div>

					<div class="import-actions">
						<Button variant="secondary" onclick={cancelImport}>
							{#snippet children()}Cancel{/snippet}
						</Button>
						<Button onclick={handleImport} disabled={isImporting}>
							{#snippet children()}
								{#if isImporting}
									Importing...
								{:else}
									<Icon name="upload" size={16} />
									Import
								{/if}
							{/snippet}
						</Button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Clear Data -->
		<div class="action-card danger">
			<div class="action-header">
				<Icon name="trash" size={20} />
				<h3>Clear All Data</h3>
			</div>
			<p class="action-description">
				Permanently delete all saved data. This cannot be undone. Consider exporting first.
			</p>

			{#if showClearConfirm}
				<div class="confirm-message">
					<Icon name="warning" size={16} />
					Are you sure? This will delete all your data permanently.
				</div>
				<div class="confirm-actions">
					<Button variant="secondary" onclick={() => (showClearConfirm = false)}>
						{#snippet children()}Cancel{/snippet}
					</Button>
					<Button variant="danger" onclick={handleClear} disabled={isClearing}>
						{#snippet children()}
							{#if isClearing}
								Clearing...
							{:else}
								Yes, Delete Everything
							{/if}
						{/snippet}
					</Button>
				</div>
			{:else}
				<Button variant="danger" onclick={handleClear}>
					{#snippet children()}
						<Icon name="trash" size={16} />
						Clear All Data
					{/snippet}
				</Button>
			{/if}
		</div>
	</div>
</div>

<style>
	.data-management {
		padding: 1.5rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.section-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.action-card {
		background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 14px;
		padding: 1.25rem;
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.06),
			0 1px 3px rgba(0, 0, 0, 0.04),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		transition: all 0.15s ease-out;
	}

	:global(.dark) .action-card {
		background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.25),
			0 1px 3px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.action-card:hover {
		transform: translateY(-1px);
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.08),
			0 2px 6px rgba(0, 0, 0, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .action-card:hover {
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.35),
			0 2px 6px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.action-card.danger {
		border-color: oklch(65% 0.15 25 / 0.3);
	}

	.action-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		color: #01B2FF;
	}

	.action-card.danger .action-header {
		color: oklch(55% 0.18 25);
	}

	:global(.dark) .action-card.danger .action-header {
		color: oklch(70% 0.15 25);
	}

	.action-header h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary);
	}

	.action-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.file-input {
		display: block;
		width: 100%;
		padding: 0.875rem 1rem;
		font-size: 0.875rem;
		border: 2px dashed rgba(1, 178, 255, 0.3);
		border-radius: 12px;
		background: linear-gradient(180deg, #f8f8f8 0%, #f0f0f0 100%);
		color: var(--text-secondary);
		cursor: pointer;
		margin-bottom: 1rem;
		transition: all 0.15s ease-out;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	:global(.dark) .file-input {
		background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
		border-color: rgba(1, 178, 255, 0.25);
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.file-input:hover {
		border-color: rgba(1, 178, 255, 0.5);
		background: linear-gradient(180deg, #f5f5f5 0%, #ebebeb 100%);
	}

	:global(.dark) .file-input:hover {
		background: linear-gradient(180deg, #1f1f1f 0%, #181818 100%);
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		background: linear-gradient(180deg, #fff5f5 0%, #ffebeb 100%);
		border: 1px solid oklch(65% 0.15 25 / 0.3);
		border-radius: 12px;
		color: oklch(50% 0.18 25);
		font-size: 0.875rem;
		margin-bottom: 1rem;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .error-message {
		background: linear-gradient(180deg, #3a2020 0%, #2a1515 100%);
		color: oklch(70% 0.15 25);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.success-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		background: linear-gradient(180deg, #f0fff5 0%, #e5ffed 100%);
		border: 1px solid oklch(65% 0.15 145 / 0.3);
		border-radius: 12px;
		color: oklch(45% 0.15 145);
		font-size: 0.875rem;
		margin-bottom: 1rem;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .success-message {
		background: linear-gradient(180deg, #1a3020 0%, #152515 100%);
		color: oklch(70% 0.12 145);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.import-preview {
		background: linear-gradient(180deg, #f8f8f8 0%, #f0f0f0 100%);
		border: 1px solid rgba(0, 0, 0, 0.06);
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 1rem;
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.05),
			0 1px 0 rgba(255, 255, 255, 0.8);
	}

	:global(.dark) .import-preview {
		background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
		border-color: rgba(255, 255, 255, 0.06);
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.2),
			0 1px 0 rgba(255, 255, 255, 0.03);
	}

	.preview-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: #01B2FF;
		margin-bottom: 0.75rem;
	}

	.preview-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.preview-row {
		display: flex;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.preview-row .label {
		color: var(--text-tertiary);
		min-width: 80px;
	}

	.preview-row .value {
		color: var(--text-secondary);
	}

	.import-mode {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.mode-option {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		gap: 0.25rem 0.75rem;
		cursor: pointer;
		padding: 0.75rem;
		background: linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%);
		border: 1px solid rgba(0, 0, 0, 0.06);
		border-radius: 10px;
		transition: all 0.15s ease-out;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	:global(.dark) .mode-option {
		background: linear-gradient(180deg, #252525 0%, #1f1f1f 100%);
		border-color: rgba(255, 255, 255, 0.06);
	}

	.mode-option:hover {
		border-color: rgba(1, 178, 255, 0.3);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.mode-option:has(input:checked) {
		border-color: rgba(1, 178, 255, 0.5);
		background: linear-gradient(180deg, #e8f7ff 0%, #d8f0ff 100%);
		box-shadow: 0 0 0 2px rgba(1, 178, 255, 0.15);
	}

	:global(.dark) .mode-option:has(input:checked) {
		background: linear-gradient(180deg, #1a3040 0%, #152530 100%);
	}

	.mode-option input {
		grid-row: span 2;
		margin: 0;
		margin-top: 0.25rem;
		accent-color: #01B2FF;
	}

	.mode-label {
		font-weight: 500;
		color: var(--text-primary);
	}

	.mode-description {
		font-size: 0.8rem;
		color: var(--text-tertiary);
	}

	.import-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.confirm-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		background: linear-gradient(180deg, #fffbf0 0%, #fff5e5 100%);
		border: 1px solid oklch(70% 0.15 70 / 0.3);
		border-radius: 12px;
		color: oklch(45% 0.15 70);
		font-size: 0.875rem;
		margin-bottom: 1rem;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .confirm-message {
		background: linear-gradient(180deg, #3a3020 0%, #2a2515 100%);
		color: oklch(75% 0.12 70);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.confirm-actions {
		display: flex;
		gap: 0.75rem;
	}
</style>
