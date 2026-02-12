<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import DocsVersionChip from '$lib/components/docs/DocsVersionChip.svelte';
	import { docsNav } from '$lib/config/docs-nav';
	import { GITHUB_REPO, GITHUB_RELEASES } from '$lib/config/site';

	const sectionDescriptions: Record<string, string> = {
		'Overview': 'What Utsuwa is and how it works',
		'Guides': 'Setup instructions for web and desktop',
		'Technology': 'Architecture, companion system, memory',
		'Community': 'Contributing and resources'
	};
</script>

<svelte:head>
	<title>Documentation - Utsuwa</title>
	<meta name="description" content="Utsuwa documentation - guides, setup instructions, and contribution guidelines." />
</svelte:head>

<div class="landing">
	<div class="hero">
		<div class="hero-fade"></div>
		<div class="hero-content">
			<DocsVersionChip />
			<img src="/brand-assets/logo.svg" alt="Utsuwa" class="hero-logo" />
			<p class="hero-tagline">A vessel for the soul of your virtual companion.</p>
			<div class="hero-actions">
				<a href="/" class="btn-primary">Try Live</a>
				<a href={GITHUB_RELEASES} target="_blank" rel="noopener noreferrer" class="btn-secondary">
					<Icon name="download" size={14} />
					Download
				</a>
			</div>
		</div>
	</div>

	<div class="content">
		<h2 class="section-title">Explore the Docs</h2>
		<div class="nav-cards">
			{#each docsNav as section}
				<div class="nav-card">
					<div class="nav-card-header">
						<div class="nav-card-icon">
							<Icon name={section.icon} size={16} />
						</div>
						<h3>{section.title}</h3>
					</div>
					<p class="nav-card-desc">{sectionDescriptions[section.title] ?? ''}</p>
					<div class="nav-card-links">
						{#each section.items as item}
							<a href="/docs/{item.slug}" class="nav-card-link">
								<Icon name="chevron-right" size={10} />
								{item.title}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<div class="oss-cta">
			<p>
				Utsuwa is open source.
				<a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">View on GitHub</a>
				or <a href="/docs/community/contributing">start contributing</a>.
			</p>
		</div>
	</div>
</div>

<style>
	.landing {
		min-height: 100%;
	}

	/* Hero — fills full container width */
	.hero {
		position: relative;
		padding: 6rem 2rem 5rem;
		text-align: center;
		overflow: hidden;
	}

	.hero::before {
		content: '';
		position: absolute;
		inset: 0;
		background: url('/docs/hero-background.png') center 30% / cover no-repeat;
		filter: blur(12px);
		opacity: 0.5;
		scale: 1.1;
	}

	.hero-fade {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			transparent 40%,
			var(--docs-surface-solid) 100%
		);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		max-width: 480px;
		margin: 0 auto;
	}

	.hero-logo {
		height: 2.5rem;
		width: auto;
		filter: var(--docs-logo-filter, none) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
	}

	.hero-tagline {
		font-size: 1rem;
		color: var(--docs-text);
		margin: 0;
		line-height: 1.6;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.hero-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.625rem 1.5rem;
		font-size: 0.8125rem;
		font-weight: 600;
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.btn-primary {
		background: var(--docs-btn-gradient);
		color: white;
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			0 2px 6px rgba(1, 178, 255, 0.25);
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	}

	.btn-primary:hover {
		background: var(--docs-btn-gradient-hover);
		transform: translateY(-2px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			0 0 16px var(--docs-glow),
			0 4px 12px rgba(1, 178, 255, 0.3);
	}

	.btn-primary:active {
		transform: translateY(0);
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.2),
			0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.btn-secondary {
		border: 1px solid var(--docs-border);
		color: var(--docs-text);
		background: var(--docs-glass-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.btn-secondary:hover {
		border-color: var(--docs-accent);
		background: var(--docs-surface-solid);
		transform: translateY(-2px);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 0 16px var(--docs-glow),
			0 4px 12px rgba(0, 0, 0, 0.12);
	}

	.btn-secondary:active {
		transform: translateY(0);
		box-shadow:
			0 1px 2px var(--docs-inner-shadow) inset,
			0 0 8px var(--docs-glow);
	}

	/* Content area below hero */
	.content {
		max-width: 44rem;
		margin: 0 auto;
		padding: 1.5rem 2rem 3rem;
	}

	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--docs-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 1.25rem;
	}

	/* Navigation cards — 2x2 grid */
	.nav-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.nav-card {
		padding: 1.25rem;
		border-radius: 0.75rem;
		border: 1px solid var(--docs-border);
		background: var(--docs-surface);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 2px 6px rgba(0, 0, 0, 0.06);
	}

	.nav-card:hover {
		border-color: color-mix(in srgb, var(--docs-accent) 40%, transparent);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 0 12px var(--docs-glow),
			0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.nav-card-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 0.5rem;
	}

	.nav-card-header h3 {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--docs-text);
		margin: 0;
	}

	.nav-card-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
		border-radius: 0.5rem;
		background: var(--docs-surface-solid);
		border: 1px solid var(--docs-border);
		color: var(--docs-accent);
		box-shadow:
			0 1px 0 var(--docs-inner-highlight) inset,
			0 1px 3px rgba(0, 0, 0, 0.06);
	}

	.nav-card-desc {
		font-size: 0.6875rem;
		color: var(--docs-text-muted);
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	.nav-card-links {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.nav-card-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--docs-text-muted);
		text-decoration: none;
		padding: 0.25rem 0.375rem;
		margin: 0 -0.375rem;
		border-radius: 0.375rem;
		transition: all 0.15s ease;
	}

	.nav-card-link:hover {
		color: var(--docs-accent);
		background: var(--docs-surface-solid);
	}

	/* Open source CTA */
	.oss-cta {
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--docs-border);
		text-align: center;
	}

	.oss-cta p {
		font-size: 0.8125rem;
		color: var(--docs-text-muted);
		margin: 0;
		line-height: 1.6;
	}

	.oss-cta a {
		color: var(--docs-accent);
		text-decoration: none;
		font-weight: 500;
	}

	.oss-cta a:hover {
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.hero {
			padding: 3.5rem 1.5rem 3rem;
		}

		.hero-actions {
			flex-direction: column;
			width: 100%;
		}

		.btn-primary,
		.btn-secondary {
			justify-content: center;
		}

		.content {
			padding: 1.5rem 1rem 2rem;
		}

		.nav-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
