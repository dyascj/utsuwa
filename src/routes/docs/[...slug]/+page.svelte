<script lang="ts">
	import { tick } from 'svelte';
	import DocsTableOfContents from '$lib/components/docs/DocsTableOfContents.svelte';
	import DocsMobileToc from '$lib/components/docs/DocsMobileToc.svelte';
	import DocsBreadcrumbs from '$lib/components/docs/DocsBreadcrumbs.svelte';
	import DocsPrevNext from '$lib/components/docs/DocsPrevNext.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>`;
	const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;

	$effect(() => {
		void data.content;
		tick().then(() => {
			const pres = document.querySelectorAll('.docs-content pre');
			pres.forEach((pre) => {
				if (pre.querySelector('.copy-btn')) return;

				const btn = document.createElement('button');
				btn.className = 'copy-btn';
				btn.innerHTML = copyIcon;
				btn.title = 'Copy code';
				btn.onclick = async () => {
					const code = pre.querySelector('code')?.textContent || pre.textContent || '';
					await navigator.clipboard.writeText(code);
					btn.innerHTML = checkIcon;
					setTimeout(() => (btn.innerHTML = copyIcon), 2000);
				};
				pre.appendChild(btn);
			});
		});
	});
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
		<DocsBreadcrumbs slug={data.slug} />
		<data.content />
		<DocsPrevNext slug={data.slug} />
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
		font-size: 2.25rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: var(--docs-text);
		text-shadow: 0 1px 0 var(--docs-inner-highlight);
	}

	:global(.docs .prose h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		color: var(--docs-text);
		text-shadow: 0 1px 0 var(--docs-inner-highlight);
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
		text-decoration: none;
		font-weight: 500;
		transition: all 0.15s ease;
		border-bottom: 1px solid transparent;
	}

	:global(.docs .prose a:hover) {
		color: var(--docs-accent-hover);
		border-bottom-color: var(--docs-accent);
		text-shadow: 0 0 8px var(--docs-glow);
	}

	:global(.docs .prose code) {
		background: var(--docs-glass-bg);
		padding: 0.2rem 0.45rem;
		border-radius: 0.375rem;
		font-size: 0.875em;
		border: 1px solid var(--docs-border);
		box-shadow: 0 1px 2px var(--docs-inner-shadow) inset;
	}

	:global(.docs .prose pre) {
		background: var(--docs-glass-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		padding: 1.25rem 1.5rem;
		border-radius: 0.875rem;
		overflow-x: auto;
		margin: 1.5rem 0;
		position: relative;
		border: 1px solid var(--docs-glass-border);
		box-shadow:
			0 2px 4px var(--docs-inner-shadow) inset,
			0 4px 16px rgba(0, 0, 0, 0.06);
	}

	:global(.docs .prose pre:hover) {
		box-shadow:
			0 2px 4px var(--docs-inner-shadow) inset,
			0 0 12px var(--docs-glow),
			0 4px 16px rgba(0, 0, 0, 0.08);
	}

	:global(.copy-btn) {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		padding: 0.5rem;
		background: var(--docs-surface);
		border: 1px solid var(--docs-border);
		border-radius: 0.5rem;
		cursor: pointer;
		opacity: 0;
		transition: all 0.2s ease;
		color: var(--docs-text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 1px 2px rgba(0, 0, 0, 0.05);
	}

	:global(.docs .prose pre:hover .copy-btn) {
		opacity: 1;
	}

	:global(.copy-btn:hover) {
		background: var(--docs-surface-solid);
		color: var(--docs-accent);
		border-color: var(--docs-accent);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 0 8px var(--docs-glow);
	}

	:global(.docs .prose pre code) {
		background: none;
		padding: 0;
		border: none;
		box-shadow: none;
	}

	/* Shiki dual theme support - use docs theme bg, Shiki colors for syntax */
	:global(.shiki) {
		background-color: transparent !important;
	}

	:global(.shiki span) {
		background-color: transparent !important;
	}

	/* Dark mode: override inline color with --shiki-dark variable */
	:global([data-docs-theme='dark'] .shiki span) {
		color: var(--shiki-dark) !important;
	}

	/* System dark mode when no explicit theme is set */
	@media (prefers-color-scheme: dark) {
		:global(html:not([data-docs-theme='light']) .shiki span) {
			color: var(--shiki-dark) !important;
		}
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
		text-shadow: 0 0 6px var(--docs-glow);
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
		border-radius: 0.875rem;
		border: 1px solid var(--docs-glass-border);
		margin: 1.5rem 0;
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.08),
			0 0 0 1px var(--docs-border);
		transition: all 0.2s ease;
	}

	:global(.docs .prose img:hover) {
		box-shadow:
			0 0 20px var(--docs-glow),
			0 8px 24px rgba(0, 0, 0, 0.12);
		transform: scale(1.01);
	}

	:global(.docs .prose blockquote) {
		position: relative;
		border: none;
		padding: 1.25rem 1.5rem;
		padding-left: 1.75rem;
		color: var(--docs-text);
		margin: 1.5rem 0;
		background: var(--docs-glass-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border-radius: 0.75rem;
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 4px 12px rgba(0, 0, 0, 0.05);
	}

	:global(.docs .prose blockquote::before) {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--docs-btn-gradient);
		border-radius: 4px 0 0 4px;
		box-shadow: 0 0 8px var(--docs-glow);
	}

	:global(.docs .prose hr) {
		border: none;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--docs-accent), transparent);
		margin: 2.5rem 0;
		opacity: 0.5;
	}

	:global(.docs .prose table) {
		display: block;
		width: 100%;
		overflow-x: auto;
		border-collapse: separate;
		border-spacing: 0;
		margin: 1.5rem 0;
		white-space: nowrap;
		background: var(--docs-glass-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid var(--docs-glass-border);
		border-radius: 0.75rem;
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 4px 12px rgba(0, 0, 0, 0.05);
	}

	:global(.docs .prose th),
	:global(.docs .prose td) {
		text-align: left;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--docs-border);
		font-size: 0.8125rem;
	}

	:global(.docs .prose th) {
		font-weight: 700;
		background: var(--docs-surface);
		color: var(--docs-text);
		text-shadow: 0 1px 0 var(--docs-inner-highlight);
	}

	:global(.docs .prose tr:last-child td) {
		border-bottom: none;
	}

	:global(.docs .prose tr:hover td) {
		background: var(--docs-surface);
	}

	@media (max-width: 768px) {
		.docs-content {
			padding: 1.5rem 1rem;
		}
	}
</style>
