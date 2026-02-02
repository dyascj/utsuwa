<script lang="ts">
	const version = `v${import.meta.env.VITE_APP_VERSION}`;
	const releaseUrl = 'https://github.com/dyascj/utsuwa/releases';
</script>

<a href={releaseUrl} target="_blank" rel="noopener noreferrer" class="version-chip">
	{version}
</a>

<style>
	.version-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.375rem 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 9999px;
		border: 1px solid var(--docs-glass-border);
		background: var(--docs-glass-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		color: var(--docs-accent);
		text-decoration: none;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.version-chip:hover {
		border-color: var(--docs-accent);
		transform: translateY(-1px);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 0 12px var(--docs-glow),
			0 4px 8px rgba(0, 0, 0, 0.1);
	}
</style>
