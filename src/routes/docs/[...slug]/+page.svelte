<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import DocsPrevNext from '$lib/components/docs/DocsPrevNext.svelte';
	import { SITE_URL } from '$lib/config/site';
	import { addCodeCopyButtons } from '$lib/utils/add-code-copy-buttons';
	import '$lib/styles/prose.css';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let copied = $state(false);

	async function copyPage() {
		const article = document.querySelector('.docs-content') as HTMLElement | null;
		if (!article) return;
		const text = article.innerText;
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	$effect(() => {
		void data.content;
		addCodeCopyButtons('.docs-content');
	});
</script>

<svelte:head>
	<title>{data.metadata?.title || 'Docs'} - Utsuwa</title>
	{#if data.metadata?.description}
		<meta name="description" content={data.metadata.description} />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.metadata?.title || 'Docs'} />
	{#if data.metadata?.description}
		<meta property="og:description" content={data.metadata.description} />
	{/if}
	<meta property="og:url" content={`${SITE_URL}/docs/${data.slug}`} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={data.metadata?.title || 'Docs'} />
	{#if data.metadata?.description}
		<meta name="twitter:description" content={data.metadata.description} />
	{/if}
	<link rel="canonical" href={`${SITE_URL}/docs/${data.slug}`} />
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: data.metadata?.title,
		description: data.metadata?.description,
		url: `${SITE_URL}/docs/${data.slug}`,
		publisher: {
			'@type': 'Organization',
			name: 'Utsuwa',
			url: '${SITE_URL}'
		}
	})}</script>`}
	{@html '<style>html { scroll-padding-top: 6rem; }</style>'}
</svelte:head>

<article class="docs-content prose">
	<div class="page-toolbar">
		<button type="button" class="copy-page-btn" onclick={copyPage} title="Copy page content">
			<Icon name={copied ? 'check' : 'copy'} size={14} />
			<span>{copied ? 'Copied' : 'Copy page'}</span>
		</button>
	</div>
	<data.content />
	<DocsPrevNext slug={data.slug} />
</article>

<style>
	.docs-content {
		max-width: 48rem;
		margin: 0 auto;
		padding: 2rem 3rem;
	}

	.page-toolbar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0.5rem;
	}

	.copy-page-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.4rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--docs-text-muted);
		background: var(--docs-surface);
		border: 1px solid var(--docs-border);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 2px 4px rgba(0, 0, 0, 0.06);
	}

	.copy-page-btn:hover {
		color: var(--docs-accent);
		background: var(--docs-surface-solid);
		border-color: var(--docs-accent);
		transform: translateY(-1px);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 0 12px var(--docs-glow),
			0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.copy-page-btn:active {
		transform: translateY(0);
		box-shadow:
			0 1px 2px var(--docs-inner-shadow) inset,
			0 0 6px var(--docs-glow);
	}

	@media (max-width: 768px) {
		.docs-content {
			padding: 1.5rem 1rem;
		}
	}
</style>
