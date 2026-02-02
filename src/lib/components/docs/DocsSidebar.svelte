<script lang="ts">
	import DocsSidebarSection from './DocsSidebarSection.svelte';
	import DocsSearch from './DocsSearch.svelte';
	import { docsNav } from '$lib/config/docs-nav';

	interface Props {
		mobileOpen?: boolean;
	}

	let { mobileOpen = false }: Props = $props();

	let searchComponent = $state<DocsSearch | null>(null);

	export function focusSearch() {
		searchComponent?.focus();
	}
</script>

<aside class="sidebar" class:mobile-open={mobileOpen}>
	<div class="sidebar-search">
		<DocsSearch bind:this={searchComponent} id="sidebar-search" />
	</div>
	<nav class="sidebar-nav">
		{#each docsNav as section}
			<DocsSidebarSection {section} />
		{/each}
	</nav>
</aside>

<style>
	.sidebar {
		width: 240px;
		min-width: 240px;
		max-height: calc(100vh - 3.5rem - 2rem);
		position: sticky;
		top: calc(3.5rem + 1rem);
		align-self: flex-start;
		overflow-y: auto;
		padding: 1rem 0.75rem;
		margin: 1rem;
		margin-right: 0;
		background: var(--docs-glass-bg);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid var(--docs-glass-border);
		border-radius: 1rem;
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 4px 16px rgba(0, 0, 0, 0.06);
	}

	.sidebar-search {
		display: none;
		padding: 0 0.25rem;
		margin-bottom: 1rem;
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	@media (max-width: 768px) {
		.sidebar {
			display: none;
			position: fixed;
			top: 3.5rem;
			left: 0;
			bottom: 0;
			z-index: 20;
			max-height: calc(100vh - 3.5rem);
			margin: 0;
			border-radius: 0;
			border-left: none;
			border-top: none;
			border-bottom: none;
			box-shadow:
				0 1px 0 var(--docs-inner-highlight) inset,
				8px 0 32px rgba(0, 0, 0, 0.2);
		}

		.sidebar.mobile-open {
			display: block;
		}

		.sidebar-search {
			display: block;
		}
	}
</style>
