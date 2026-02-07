<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import DocsPrevNext from '$lib/components/docs/DocsPrevNext.svelte';
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

	const codeCopyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>`;
	const codeCheckIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;

	$effect(() => {
		void data.content;
		tick().then(() => {
			const pres = document.querySelectorAll('.docs-content pre');
			pres.forEach((pre) => {
				if (pre.querySelector('.copy-btn')) return;

				const btn = document.createElement('button');
				btn.className = 'copy-btn';
				btn.innerHTML = codeCopyIcon;
				btn.title = 'Copy code';
				btn.onclick = async () => {
					const code = pre.querySelector('code')?.textContent || pre.textContent || '';
					await navigator.clipboard.writeText(code);
					btn.innerHTML = codeCheckIcon;
					setTimeout(() => (btn.innerHTML = codeCopyIcon), 2000);
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
