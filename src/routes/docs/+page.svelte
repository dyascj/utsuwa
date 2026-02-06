<script lang="ts">
	import DocsHero from '$lib/components/docs/DocsHero.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Documentation - Utsuwa</title>
	<meta name="description" content="Utsuwa documentation - guides, setup instructions, and contribution guidelines." />
</svelte:head>

<DocsHero />

{#if data.latestPost}
	<section class="news-section">
		<div class="news-section-inner">
			<h2 class="news-heading">Latest News</h2>
			<a href="/blog/{data.latestPost.slug}" class="news-card">
				<div class="news-image">
					<img src={data.latestPost.image} alt="" loading="lazy" />
				</div>
				<div class="news-body">
					<time class="news-date" datetime={data.latestPost.date}>{formatDate(data.latestPost.date)}</time>
					<h3 class="news-title">{data.latestPost.title}</h3>
					<p class="news-desc">{data.latestPost.description}</p>
					<span class="news-read">Read post &rarr;</span>
				</div>
			</a>
		</div>
	</section>
{/if}

<style>
	.news-section {
		padding: 3rem 2rem 4rem;
		background: var(--docs-surface);
		border-bottom: 1px solid var(--docs-border);
	}

	.news-section-inner {
		max-width: 640px;
		margin: 0 auto;
	}

	.news-heading {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--docs-text);
		margin: 0 0 1.25rem;
	}

	.news-card {
		display: flex;
		text-decoration: none;
		border-radius: 1rem;
		overflow: hidden;
		border: 1px solid var(--docs-glass-border);
		background: var(--docs-glass-bg);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.news-card:hover {
		border-color: var(--docs-accent);
		transform: translateY(-3px);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 0 20px var(--docs-glow),
			0 8px 32px rgba(0, 0, 0, 0.12);
	}

	.news-image {
		flex-shrink: 0;
		width: 200px;
		overflow: hidden;
		background: var(--docs-surface);
	}

	.news-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.news-card:hover .news-image img {
		transform: scale(1.05);
	}

	.news-body {
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.news-date {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--docs-text-muted);
	}

	.news-title {
		font-size: 1.0625rem;
		font-weight: 600;
		color: var(--docs-text);
		margin: 0;
		line-height: 1.4;
		transition: color 0.15s ease;
	}

	.news-card:hover .news-title {
		color: var(--docs-accent);
	}

	.news-desc {
		font-size: 0.8125rem;
		color: var(--docs-text-muted);
		line-height: 1.5;
		margin: 0.125rem 0 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.news-read {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--docs-accent);
		margin-top: 0.5rem;
	}

	@media (max-width: 640px) {
		.news-card {
			flex-direction: column;
		}

		.news-image {
			width: 100%;
			aspect-ratio: 16 / 9;
		}
	}
</style>
