<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils/format-date';

	let { data }: { data: PageData } = $props();

	const featuredPost = $derived(data.posts[0]);
	const restPosts = $derived(data.posts.slice(1));
</script>

<svelte:head>
	<title>Blog - Utsuwa</title>
	<meta
		name="description"
		content="Development updates and behind-the-scenes notes from building Utsuwa."
	/>
</svelte:head>

<div class="blog-index">
	{#if featuredPost}
		<a href="/blog/{featuredPost.slug}" class="featured-card">
			<img src={featuredPost.image} alt="" class="featured-image" />
			<div class="featured-overlay"></div>
			<div class="featured-content">
				<time datetime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
				<h2>{featuredPost.title}</h2>
				<p>{featuredPost.description}</p>
			</div>
		</a>
	{/if}

	{#if restPosts.length > 0}
		<div class="blog-grid">
			{#each restPosts as post}
				<a href="/blog/{post.slug}" class="blog-card">
					<div class="card-image">
						<img src={post.image} alt="" loading="lazy" />
					</div>
					<div class="card-body">
						<time datetime={post.date}>{formatDate(post.date)}</time>
						<h2>{post.title}</h2>
						<p>{post.description}</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Featured hero card */
	.featured-card {
		position: relative;
		display: block;
		height: 480px;
		border-radius: 1.25rem;
		overflow: hidden;
		text-decoration: none;
		margin-bottom: 2rem;
		border: 1px solid var(--docs-glass-border);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
	}

	.featured-card:hover {
		border-color: var(--docs-accent);
		transform: translateY(-4px);
		box-shadow:
			0 0 24px var(--docs-glow),
			0 16px 48px rgba(0, 0, 0, 0.18);
	}

	.featured-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.featured-card:hover .featured-image {
		transform: scale(1.03);
	}

	.featured-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
	}

	.featured-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.featured-content time {
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
	}

	.featured-content h2 {
		font-size: 1.75rem;
		font-weight: 700;
		color: white;
		margin: 0;
		line-height: 1.3;
	}

	.featured-content p {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.6;
		margin: 0;
		max-width: 640px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Grid for remaining posts */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.blog-card {
		display: flex;
		flex-direction: column;
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

	.blog-card:hover {
		border-color: var(--docs-accent);
		transform: translateY(-4px);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 0 24px var(--docs-glow),
			0 12px 40px rgba(0, 0, 0, 0.15);
	}

	.card-image {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--docs-surface);
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.blog-card:hover .card-image img {
		transform: scale(1.03);
	}

	.card-body {
		padding: 1.25rem 1.5rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		flex: 1;
	}

	.card-body time {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--docs-text-muted);
	}

	.card-body h2 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--docs-text);
		margin: 0;
		transition: color 0.15s ease;
		line-height: 1.4;
	}

	.blog-card:hover .card-body h2 {
		color: var(--docs-accent);
	}

	.card-body p {
		font-size: 0.8125rem;
		color: var(--docs-text-muted);
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 640px) {
		.featured-card {
			height: 360px;
		}

		.featured-content {
			padding: 1.5rem;
		}

		.featured-content h2 {
			font-size: 1.375rem;
		}

		.blog-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
