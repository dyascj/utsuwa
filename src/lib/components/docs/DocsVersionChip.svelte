<script lang="ts">
	import { onMount } from 'svelte';

	let version = $state('');
	let releaseUrl = $state('https://github.com/dyascj/utsuwa/releases');

	onMount(async () => {
		const cached = sessionStorage.getItem('utsuwa-release');
		if (cached) {
			const data = JSON.parse(cached);
			version = data.tag;
			releaseUrl = data.url;
			return;
		}

		try {
			const res = await fetch('https://api.github.com/repos/dyascj/utsuwa/releases/latest');
			if (res.ok) {
				const data = await res.json();
				version = data.tag_name;
				releaseUrl = data.html_url;
				sessionStorage.setItem('utsuwa-release', JSON.stringify({ tag: version, url: releaseUrl }));
			} else {
				version = `v${import.meta.env.VITE_APP_VERSION}`;
			}
		} catch {
			version = `v${import.meta.env.VITE_APP_VERSION}`;
		}
	});
</script>

{#if version}
	<a href={releaseUrl} target="_blank" rel="noopener noreferrer" class="version-chip">
		{version}
	</a>
{/if}

<style>
	.version-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		border-radius: 9999px;
		border: 1px solid var(--docs-border);
		color: var(--docs-text-muted);
		text-decoration: none;
		transition: border-color 0.15s, color 0.15s;
	}

	.version-chip:hover {
		border-color: var(--docs-accent);
		color: var(--docs-accent);
	}
</style>
