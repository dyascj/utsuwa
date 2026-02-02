<script lang="ts">
	import DocsVersionChip from './DocsVersionChip.svelte';
</script>

<div class="hero">
	<!-- Animated gradient orbs -->
	<div class="orb-container">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="orb orb-3"></div>
	</div>

	<div class="hero-content">
		<DocsVersionChip />
		<img src="/brand-assets/logo.svg" alt="Utsuwa" class="hero-logo" />
		<p class="hero-tagline">
			A vessel for the soul of your virtual companion — bringing AI characters to life.
		</p>
		<div class="hero-actions">
			<a href="/" class="btn-secondary">Try Live</a>
			<a href="/docs/overview/introduction" class="btn-primary">Get Started</a>
		</div>
	</div>
</div>

<style>
	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 70vh;
		padding: 4rem 2rem;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.orb-container {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.35;
		animation: float 8s ease-in-out infinite;
	}

	.orb-1 {
		width: 350px;
		height: 350px;
		background: radial-gradient(circle at 30% 30%, #4dd0ff 0%, #01B2FF 50%, #0088cc 100%);
		top: 10%;
		left: 50%;
		transform: translateX(-50%);
		animation-delay: 0s;
	}

	.orb-2 {
		width: 280px;
		height: 280px;
		background: radial-gradient(circle at 30% 30%, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
		top: 30%;
		left: 20%;
		animation-delay: -2.5s;
	}

	.orb-3 {
		width: 220px;
		height: 220px;
		background: radial-gradient(circle at 30% 30%, #22d3ee 0%, #06b6d4 50%, #0891b2 100%);
		top: 25%;
		right: 15%;
		animation-delay: -5s;
	}

	@keyframes float {
		0%, 100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(20px, -20px) scale(1.05);
		}
		66% {
			transform: translate(-15px, 10px) scale(0.95);
		}
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		max-width: 640px;
		position: relative;
		z-index: 1;
	}

	.hero-logo {
		height: 3.5rem;
		width: auto;
		filter: var(--docs-logo-filter, none);
		drop-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.hero-tagline {
		font-size: 1.25rem;
		line-height: 1.7;
		color: var(--docs-text-muted);
		margin: 0;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		padding: 0.875rem 2rem;
		font-size: 0.9375rem;
		font-weight: 600;
		border-radius: 999px;
		text-decoration: none;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.btn-primary {
		background: var(--docs-btn-gradient);
		color: white;
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow:
			var(--docs-btn-shadow),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	}

	.btn-primary:hover {
		background: var(--docs-btn-gradient-hover);
		transform: translateY(-2px);
		box-shadow:
			var(--docs-btn-shadow-hover),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
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
			0 2px 8px rgba(0, 0, 0, 0.08);
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

	@media (max-width: 640px) {
		.hero-actions {
			flex-direction: column;
			width: 100%;
		}

		.btn-primary,
		.btn-secondary {
			justify-content: center;
		}

		.orb {
			opacity: 0.3;
		}
	}
</style>
