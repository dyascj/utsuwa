<script lang="ts">
	import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
	import { setupThemeWatcher } from '$lib/config/docs-theme';
	import { browser } from '$app/environment';

	let { children } = $props();
	let blogEl = $state<HTMLDivElement | null>(null);

	$effect(() => setupThemeWatcher(() => blogEl, browser));
</script>

<div class="docs" bind:this={blogEl}>
	<DocsHeader hideSearch />
	<main class="blog-main" data-pagefind-body>
		{@render children()}
	</main>
</div>

<style>
	.docs {
		min-height: 100vh;
		background: var(--docs-bg);
		color: var(--docs-text);
		font-family: 'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.blog-main {
		max-width: 64rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	@media (max-width: 768px) {
		.blog-main {
			padding: 1.5rem 1rem;
		}
	}
</style>
