<script lang="ts">
	import DocsHero from '$lib/components/docs/DocsHero.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Documentation - Utsuwa</title>
	<meta name="description" content="Utsuwa documentation - guides, setup instructions, and contribution guidelines." />
</svelte:head>

<DocsHero />

{#if data.latestPost}
	<div class="latest-news">
		<a href="/blog/{data.latestPost.slug}" class="news-card">
			<div class="news-image">
				<img src={data.latestPost.image} alt="" loading="lazy" />
			</div>
			<div class="news-body">
				<span class="news-label">Latest from the Blog</span>
				<h3 class="news-title">{data.latestPost.title}</h3>
				<p class="news-desc">{data.latestPost.description}</p>
				<span class="news-read">Read post &rarr;</span>
			</div>
		</a>
	</div>
{/if}

<style>
	.latest-news {
		max-width: 640px;
		margin: 0 auto;
		padding: 0 2rem 4rem;
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
		width: 180px;
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

	.news-label {
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--docs-accent);
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
