<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Component } from 'svelte';

	interface Props {
		contentKey?: Component | unknown;
		slug?: string;
	}

	let { contentKey, slug }: Props = $props();

	let headings = $state<{ id: string; text: string; level: number }[]>([]);
	let activeId = $state('');

	const editUrl = $derived(
		slug
			? `https://github.com/dyascj/utsuwa/edit/main/src/content/docs/${slug}.md`
			: undefined
	);

	function getActiveHeading(elements: Element[]) {
		const offset = 100;
		for (let i = elements.length - 1; i >= 0; i--) {
			const rect = elements[i].getBoundingClientRect();
			if (rect.top <= offset) {
				return elements[i].id;
			}
		}
		return elements.length > 0 ? elements[0].id : '';
	}

	$effect(() => {
		void contentKey;

		let elements: Element[] = [];

		function onScroll() {
			activeId = getActiveHeading(elements);
		}

		tick().then(() => {
			const article = document.querySelector('.docs-content');
			if (!article) return;

			elements = Array.from(article.querySelectorAll('h2, h3'));
			headings = elements.map((el) => ({
				id: el.id,
				text: el.textContent || '',
				level: parseInt(el.tagName[1])
			}));

			activeId = getActiveHeading(elements);
			window.addEventListener('scroll', onScroll, { passive: true });
		});

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<aside class="toc">
	{#if headings.length > 0}
		<nav>
			<p class="toc-title">On this page</p>
			<ul class="toc-list">
				{#each headings as heading}
					<li>
						<a
							href={`#${heading.id}`}
							class="toc-link"
							class:active={activeId === heading.id}
							class:indent={heading.level === 3}
						>
							{heading.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}

	<div class="community">
		<p class="toc-title">Community</p>
		<ul class="community-list">
			{#if editUrl}
				<li>
					<a href={editUrl} target="_blank" rel="noopener noreferrer" class="community-link">
						<Icon name="pencil" size={14} />
						<span>Edit this page</span>
					</a>
				</li>
			{/if}
			<li>
				<a href="https://github.com/dyascj/utsuwa" target="_blank" rel="noopener noreferrer" class="community-link">
					<Icon name="star" size={14} />
					<span>Star on GitHub</span>
				</a>
			</li>
		</ul>
	</div>
</aside>

<style>
	.toc {
		width: 16rem;
		min-width: 16rem;
		max-height: calc(100vh - 3.5rem - 2rem);
		position: sticky;
		top: calc(3.5rem + 1rem);
		align-self: flex-start;
		overflow-y: auto;
		padding: 1.5rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 1rem;
		margin-left: 0;
		background: var(--docs-glass-bg);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--docs-glass-border);
		border-radius: 1rem;
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 4px 16px rgba(0, 0, 0, 0.06);
	}

	.toc-title {
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--docs-text);
		margin: 0 0 0.5rem;
		padding: 0 0.5rem;
		text-shadow: 0 1px 0 var(--docs-inner-highlight);
	}

	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.toc-link {
		display: block;
		padding: 0.375rem 0.5rem;
		font-size: 0.75rem;
		color: var(--docs-text-muted);
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.15s ease;
		border: 1px solid transparent;
	}

	.toc-link:hover {
		color: var(--docs-text);
		background: var(--docs-surface);
		border-color: var(--docs-border);
	}

	.toc-link.active {
		color: white;
		font-weight: 500;
		background: var(--docs-btn-gradient);
		border-color: rgba(0, 0, 0, 0.1);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.25) inset,
			0 0 8px var(--docs-glow);
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	}

	.toc-link.indent {
		padding-left: 1rem;
		font-size: 0.6875rem;
	}

	.community {
		border-top: 1px solid var(--docs-border);
		padding-top: 1rem;
		margin-top: 0.5rem;
	}

	.community-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.community-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.5rem;
		font-size: 0.75rem;
		color: var(--docs-text-muted);
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.15s ease;
	}

	.community-link:hover {
		color: var(--docs-accent);
		background: var(--docs-surface);
	}

	@media (max-width: 1024px) {
		.toc {
			display: none;
		}
	}
</style>
