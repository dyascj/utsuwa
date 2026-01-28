<script lang="ts">
	import DocsTableOfContents from '$lib/components/docs/DocsTableOfContents.svelte';
	import DocsMobileToc from '$lib/components/docs/DocsMobileToc.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.metadata?.title || 'Docs'} - Utsuwa</title>
	{#if data.metadata?.description}
		<meta name="description" content={data.metadata.description} />
	{/if}
	{@html '<style>html { scroll-padding-top: 6rem; }</style>'}
</svelte:head>

<div class="doc-page">
	<article class="docs-content prose">
		<data.content />
	</article>
	<DocsTableOfContents contentKey={data.content} slug={data.slug} />
</div>
<DocsMobileToc contentKey={data.content} />

<style>
	.doc-page {
		display: flex;
	}

	.docs-content {
		flex: 1;
		min-width: 0;
		padding: 2rem 3rem;
	}

	:global(.docs .prose) {
		color: var(--docs-text);
		line-height: 1.75;
	}

	:global(.docs .prose h1) {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--docs-text);

	}

	:global(.docs .prose h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		color: var(--docs-text);

	}

	:global(.docs .prose h3) {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		color: var(--docs-text);

	}

	:global(.docs .prose p) {
		margin-bottom: 1rem;
		color: var(--docs-text);
	}

	:global(.docs .prose a) {
		color: var(--docs-accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	:global(.docs .prose a:hover) {
		color: var(--docs-accent-hover);
	}

	:global(.docs .prose code) {
		background: var(--docs-code-bg);
		padding: 0.15rem 0.35rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}

	:global(.docs .prose pre) {
		background: var(--docs-code-bg);
		padding: 1rem 1.25rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	:global(.docs .prose pre code) {
		background: none;
		padding: 0;
	}

	:global(.docs .prose ul),
	:global(.docs .prose ol) {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
	}

	:global(.docs .prose ul) {
		list-style: none;
	}

	:global(.docs .prose ul > li::before) {
		content: '\2022';
		color: var(--docs-accent);
		font-weight: 700;
		display: inline-block;
		width: 1em;
		margin-left: -1em;
	}

	:global(.docs .prose ol) {
		list-style: none;
		counter-reset: ol-counter;
	}

	:global(.docs .prose ol > li) {
		counter-increment: ol-counter;
	}

	:global(.docs .prose ol > li::before) {
		content: counter(ol-counter) '.';
		color: var(--docs-accent);
		font-weight: 700;
		display: inline-block;
		width: 1.5em;
		margin-left: -1.5em;
	}

	:global(.docs .prose li) {
		margin-bottom: 0.375rem;
	}

	:global(.docs .prose img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		border: 1px solid var(--docs-border);
		margin: 1rem 0;
	}

	:global(.docs .prose blockquote) {
		border-left: 3px solid var(--docs-border);
		padding-left: 1rem;
		color: var(--docs-text-muted);
		margin: 1.5rem 0;
	}

	:global(.docs .prose hr) {
		border: none;
		border-top: 1px solid var(--docs-border);
		margin: 2rem 0;
	}

	:global(.docs .prose table) {
		display: block;
		width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
		margin: 1.5rem 0;
		white-space: nowrap;
	}

	:global(.docs .prose th),
	:global(.docs .prose td) {
		text-align: left;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--docs-border);
		font-size: 0.8125rem;
	}

	:global(.docs .prose th) {
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.docs-content {
			padding: 1.5rem 1rem;
		}
	}
</style>
