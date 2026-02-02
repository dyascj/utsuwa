<script lang="ts">
	import { getBreadcrumbs } from '$lib/utils/docs-nav';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		slug: string;
	}

	let { slug }: Props = $props();

	const breadcrumbs = $derived(getBreadcrumbs(slug));
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
	{#each breadcrumbs as crumb, i}
		{#if i > 0}
			<Icon name="chevron-right" size={12} />
		{/if}
		{#if i === breadcrumbs.length - 1}
			<span class="current">{crumb.title}</span>
		{:else if crumb.href}
			<a href={crumb.href}>{crumb.title}</a>
		{:else}
			<span class="section">{crumb.title}</span>
		{/if}
	{/each}
</nav>

<style>
	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--docs-text-muted);
		margin-bottom: 1.5rem;
		padding: 0.625rem 1rem;
		background: var(--docs-glass-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid var(--docs-glass-border);
		border-radius: 999px;
		width: fit-content;
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 2px 4px rgba(0, 0, 0, 0.04);
	}

	.breadcrumbs a {
		color: var(--docs-text-muted);
		text-decoration: none;
		transition: all 0.15s ease;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
	}

	.breadcrumbs a:hover {
		color: var(--docs-accent);
		background: var(--docs-glow);
	}

	.section {
		color: var(--docs-text-muted);
	}

	.current {
		color: var(--docs-accent);
		font-weight: 600;
	}
</style>
