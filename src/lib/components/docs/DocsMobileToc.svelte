<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { tick } from 'svelte';
	import type { Component } from 'svelte';

	interface Props {
		contentKey?: Component | unknown;
	}

	let { contentKey }: Props = $props();

	let headings = $state<{ id: string; text: string; level: number }[]>([]);
	let open = $state(false);

	$effect(() => {
		void contentKey;

		tick().then(() => {
			const article = document.querySelector('.docs-content');
			if (!article) return;

			const elements = article.querySelectorAll('h2, h3');
			headings = Array.from(elements).map((el) => ({
				id: el.id,
				text: el.textContent || '',
				level: parseInt(el.tagName[1])
			}));
			open = false;
		});
	});

	function handleClick() {
		open = false;
	}
</script>

{#if headings.length > 0}
	<button class="mobile-toc-trigger" onclick={() => (open = true)} aria-label="On this page">
		<Icon name="list" size={16} />
		<span>On This Page</span>
	</button>

	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="mobile-toc-overlay" onclick={() => (open = false)} onkeydown={(e) => e.key === 'Escape' && (open = false)}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="mobile-toc-panel" onclick={(e) => e.stopPropagation()}>
				<div class="mobile-toc-header">
					<span>On This Page</span>
					<button class="mobile-toc-close" onclick={() => (open = false)} aria-label="Close">
						&times;
					</button>
				</div>
				<ul class="mobile-toc-list">
					{#each headings as heading}
						<li>
							<a
								href={`#${heading.id}`}
								class="mobile-toc-link"
								class:indent={heading.level === 3}
								onclick={handleClick}
							>
								{heading.text}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
{/if}

<style>
	.mobile-toc-trigger {
		display: none;
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 20;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		font-size: 0.8125rem;
		font-weight: 600;
		background: var(--docs-btn-gradient);
		color: white;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 999px;
		cursor: pointer;
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.3) inset,
			0 4px 16px var(--docs-glow),
			0 4px 12px rgba(0, 0, 0, 0.15);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	}

	.mobile-toc-trigger:hover {
		transform: translateY(-2px);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.4) inset,
			0 6px 24px var(--docs-glow-strong),
			0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.mobile-toc-trigger:active {
		transform: translateY(0);
	}

	@media (max-width: 1024px) {
		.mobile-toc-trigger {
			display: inline-flex;
		}
	}

	.mobile-toc-overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.mobile-toc-panel {
		width: 100%;
		max-width: 480px;
		max-height: 60vh;
		background: var(--docs-glass-bg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid var(--docs-glass-border);
		border-bottom: none;
		border-radius: 1.25rem 1.25rem 0 0;
		overflow-y: auto;
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 -8px 32px rgba(0, 0, 0, 0.2);
	}

	.mobile-toc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--docs-text);
		border-bottom: 1px solid var(--docs-border);
		position: sticky;
		top: 0;
		background: var(--docs-glass-bg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	.mobile-toc-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: var(--docs-surface);
		border: 1px solid var(--docs-border);
		border-radius: 0.5rem;
		font-size: 1.25rem;
		color: var(--docs-text-muted);
		cursor: pointer;
		line-height: 1;
		transition: all 0.15s ease;
	}

	.mobile-toc-close:hover {
		background: var(--docs-surface-solid);
		color: var(--docs-text);
	}

	.mobile-toc-list {
		list-style: none;
		margin: 0;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.mobile-toc-link {
		display: block;
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		color: var(--docs-text-muted);
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.15s ease;
	}

	.mobile-toc-link:hover {
		color: var(--docs-text);
		background: var(--docs-surface);
	}

	.mobile-toc-link:active {
		background: var(--docs-btn-gradient);
		color: white;
	}

	.mobile-toc-link.indent {
		padding-left: 1.75rem;
		font-size: 0.8125rem;
	}
</style>
