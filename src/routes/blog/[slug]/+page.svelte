<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import '$lib/styles/prose.css';
	import { formatDate } from '$lib/utils/format-date';
	import { SITE_URL } from '$lib/config/site';
	import { addCodeCopyButtons } from '$lib/utils/add-code-copy-buttons';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	$effect(() => {
		void data.content;
		addCodeCopyButtons('.blog-post');
	});
</script>

<svelte:head>
	<title>{data.metadata?.title || 'Blog'} - Utsuwa</title>
	{#if data.metadata?.description}
		<meta name="description" content={data.metadata.description} />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.metadata?.title || 'Blog'} />
	{#if data.metadata?.description}
		<meta property="og:description" content={data.metadata.description} />
	{/if}
	{#if data.metadata?.image}
		<meta property="og:image" content={data.metadata.image} />
	{/if}
	<meta property="og:url" content={`${SITE_URL}/blog/${data.slug}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.metadata?.title || 'Blog'} />
	{#if data.metadata?.description}
		<meta name="twitter:description" content={data.metadata.description} />
	{/if}
	{#if data.metadata?.image}
		<meta name="twitter:image" content={data.metadata.image} />
	{/if}
	<link rel="canonical" href={`${SITE_URL}/blog/${data.slug}`} />
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.metadata?.title,
		description: data.metadata?.description,
		image: data.metadata?.image ? `${SITE_URL}${data.metadata.image}` : undefined,
		datePublished: data.metadata?.date,
		url: `${SITE_URL}/blog/${data.slug}`,
		author: {
			'@type': 'Organization',
			name: 'Utsuwa',
			url: '${SITE_URL}'
		},
		publisher: {
			'@type': 'Organization',
			name: 'Utsuwa',
			url: '${SITE_URL}'
		}
	})}</script>`}
	{@html '<style>html { scroll-padding-top: 6rem; }</style>'}
</svelte:head>

<div class="blog-post-wrapper">
	<a href="/blog" class="back-link">
		<Icon name="chevron-left" size={14} />
		<span>Back to Blog</span>
	</a>

	{#if data.metadata?.image}
		<div class="blog-banner">
			<img src={data.metadata.image} alt="" />
		</div>
	{/if}

	<article class="blog-post prose">
		{#if data.metadata?.date}
			<time class="blog-post-date" datetime={String(data.metadata.date)}
				>{formatDate(data.metadata.date)}</time
			>
		{/if}
		<data.content />
	</article>
</div>

<style>
	.blog-post-wrapper {
		max-width: 48rem;
		margin: 0 auto;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--docs-text-muted);
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.625rem;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		margin-bottom: 1.25rem;
		background: var(--docs-surface);
		border: 1px solid var(--docs-border);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 -1px 1px var(--docs-inner-shadow) inset,
			0 2px 4px rgba(0, 0, 0, 0.06);
	}

	.back-link:hover {
		color: var(--docs-accent);
		background: var(--docs-surface-solid);
		border-color: var(--docs-accent);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 -1px 1px var(--docs-inner-shadow) inset,
			0 0 12px var(--docs-glow),
			0 2px 8px rgba(0, 0, 0, 0.08);
		transform: translateY(-1px);
	}

	.back-link:active {
		transform: translateY(0);
		box-shadow:
			0 1px 3px var(--docs-inner-shadow) inset,
			0 0 8px var(--docs-glow);
	}

	.blog-banner {
		border-radius: 1rem;
		overflow: hidden;
		margin-bottom: 2rem;
		border: 1px solid var(--docs-glass-border);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.blog-banner img {
		width: 100%;
		display: block;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.blog-post-date {
		display: block;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--docs-accent);
		margin-bottom: 0.5rem;
	}
</style>
