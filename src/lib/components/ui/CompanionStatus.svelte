<script lang="ts">
	import { characterStore } from '$lib/stores/character.svelte';
	import { Icon } from '$lib/components/ui';

	let isExpanded = $state(false);

	const charState = $derived(characterStore.state);
	const moodInfo = $derived(characterStore.moodInfo);
	const stageInfo = $derived(characterStore.stageInfo);
	const affectionPercent = $derived(characterStore.affectionPercent);
	const isCompanionMode = $derived(characterStore.appMode === 'companion');
</script>

<div
	class="status-container"
	class:expanded={isExpanded}
	class:high-affection={!isCompanionMode && charState.affection > 500}
>
	<!-- Expanded content (appears above trigger) -->
	{#if isExpanded}
		<div class="status-details">
			{#if isCompanionMode}
				<!-- Companion Mode: 2x1 Grid -->
				<div class="stats-grid companion-grid">
					<div class="stat-tile" style="--delay: 0">
						<span class="tile-icon"><Icon name="zap" size={20} /></span>
						<div class="tile-bar-container">
							<div class="tile-bar" style="width: {charState.energy}%"></div>
						</div>
						<span class="tile-value">{charState.energy}</span>
						<span class="tile-label">Energy</span>
					</div>
					<div class="stat-tile" style="--delay: 1">
						<span class="tile-icon"><Icon name="message-circle" size={20} /></span>
						<span class="tile-value">{charState.totalInteractions}</span>
						<span class="tile-label">Chats</span>
						{#if charState.currentStreak > 1}
							<span class="streak-badge">
								<Icon name="flame" size={10} />
								{charState.currentStreak}
							</span>
						{/if}
					</div>
				</div>
			{:else}
				<!-- Dating Sim Mode: 3x2 Grid -->
				<div class="stats-grid">
					<!-- Row 1 -->
					<div class="stat-tile" style="--delay: 0">
						<span class="tile-icon"><Icon name="heart" size={20} /></span>
						<span class="tile-value">{affectionPercent}%</span>
						<span class="tile-label">{stageInfo.name}</span>
					</div>
					<div class="stat-tile" style="--delay: 1">
						<span class="tile-icon"><Icon name="shield" size={20} /></span>
						<span class="tile-value">{charState.trust}</span>
						<span class="tile-label">Trust</span>
					</div>
					<div class="stat-tile" style="--delay: 2">
						<span class="tile-icon"><Icon name="sparkles" size={20} /></span>
						<span class="tile-value">{charState.intimacy}</span>
						<span class="tile-label">Intimacy</span>
					</div>
					<!-- Row 2 -->
					<div class="stat-tile" style="--delay: 3">
						<span class="tile-icon"><Icon name="home" size={20} /></span>
						<span class="tile-value">{charState.comfort}</span>
						<span class="tile-label">Comfort</span>
					</div>
					<div class="stat-tile" style="--delay: 4">
						<span class="tile-icon"><Icon name="zap" size={20} /></span>
						<span class="tile-value">{charState.energy}</span>
						<span class="tile-label">Energy</span>
					</div>
					<div class="stat-tile" style="--delay: 5">
						<span class="tile-icon"><Icon name="award" size={20} /></span>
						<span class="tile-value">{charState.respect}</span>
						<span class="tile-label">Respect</span>
					</div>
				</div>

				<!-- Quick Stats -->
				<div class="quick-stats">
					<div class="quick-stat">
						<Icon name="calendar" size={12} />
						<span>{charState.daysKnown} days</span>
					</div>
					<div class="quick-stat">
						<Icon name="message-circle" size={12} />
						<span>{charState.totalInteractions} chats</span>
					</div>
					{#if charState.currentStreak > 1}
						<div class="quick-stat streak">
							<Icon name="flame" size={12} />
							<span>{charState.currentStreak} day streak</span>
						</div>
					{/if}
				</div>

				<!-- View Profile Link -->
				<a href="/settings/persona" class="profile-link">
					View Full Profile
					<Icon name="arrow-right" size={14} />
				</a>
			{/if}
		</div>
	{/if}

	<!-- Toggle bar (always visible at bottom) -->
	<button class="status-toggle" onclick={() => isExpanded = !isExpanded}>
		<span class="mood-icon" style="color: {moodInfo.color}">
			<Icon name={moodInfo.icon} size={18} />
		</span>
		<span class="mood-label">{moodInfo.description}</span>
		<span class="chevron" class:rotated={isExpanded}>
			<Icon name="chevron-up" size={14} />
		</span>
	</button>
</div>

<style>
	.status-container {
		position: fixed;
		bottom: 5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 35;
		background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all 0.2s ease-out;
		display: flex;
		flex-direction: column;
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.12),
			0 2px 6px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .status-container {
		background: linear-gradient(180deg, #252525 0%, #1a1a1a 100%);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.4),
			0 2px 6px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	@media (min-width: 641px) {
		.status-container {
			bottom: 6.5rem;
		}
	}

	.status-container.high-affection {
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.12),
			0 0 24px rgba(1, 178, 255, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .status-container.high-affection {
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.4),
			0 0 30px rgba(1, 178, 255, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	/* Toggle Button */
	.status-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.625rem 0.875rem;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, transparent 100%);
		border: none;
		border-top: 1px solid transparent;
		cursor: pointer;
		color: var(--text-primary);
		font-family: inherit;
		transition: background 0.15s;
	}

	:global(.dark) .status-toggle {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
	}

	.expanded .status-toggle {
		border-top: 1px solid rgba(0, 0, 0, 0.06);
		background: transparent;
	}

	:global(.dark) .expanded .status-toggle {
		border-top-color: rgba(255, 255, 255, 0.06);
	}

	.mood-icon {
		display: flex;
		flex-shrink: 0;
	}

	.mood-label {
		flex: 1;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-align: left;
	}

	.chevron {
		display: flex;
		flex-shrink: 0;
		transition: transform 0.2s ease-out;
		opacity: 0.4;
		color: var(--text-tertiary);
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.status-toggle:hover {
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.02) 100%);
	}

	:global(.dark) .status-toggle:hover {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
	}

	/* Expanded Content */
	.status-details {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Stats Grid - Wii Channel Style */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.stats-grid.companion-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	/* Stat Tile - Wii Channel Style */
	.stat-tile {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px 8px;
		border-radius: 16px;
		background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.08),
			0 2px 4px rgba(0, 0, 0, 0.04),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		transition: all 0.2s ease-out;
		animation: bounceIn 0.35s ease-out backwards;
		animation-delay: calc(var(--delay, 0) * 50ms);
		position: relative;
		min-height: 72px;
	}

	:global(.dark) .stat-tile {
		background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.25),
			0 2px 4px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.stat-tile:hover {
		transform: scale(1.03) translateY(-2px);
		box-shadow:
			0 8px 20px rgba(0, 0, 0, 0.12),
			0 4px 8px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .stat-tile:hover {
		box-shadow:
			0 8px 20px rgba(0, 0, 0, 0.35),
			0 4px 8px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	@keyframes bounceIn {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(10px);
		}
		60% {
			transform: scale(1.05) translateY(-2px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.tile-icon {
		display: flex;
		color: #01B2FF;
		margin-bottom: 4px;
		filter: drop-shadow(0 0 4px rgba(1, 178, 255, 0.3));
	}

	.tile-value {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
	}

	.tile-label {
		font-size: 0.55rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-tertiary);
		margin-top: 2px;
	}

	/* Mini bar for energy tile in companion mode */
	.tile-bar-container {
		width: 100%;
		height: 6px;
		background: linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%);
		border-radius: 3px;
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		margin: 4px 0;
	}

	:global(.dark) .tile-bar-container {
		background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.tile-bar {
		height: 100%;
		border-radius: 3px;
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
		transition: width 0.3s ease;
	}

	/* Streak badge for companion mode */
	.streak-badge {
		position: absolute;
		top: 4px;
		right: 4px;
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 2px 5px;
		font-size: 0.55rem;
		font-weight: 600;
		color: white;
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 100%);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(1, 178, 255, 0.4);
	}

	/* Quick Stats */
	.quick-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.quick-stat {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.65rem;
		color: white;
		padding: 0.3rem 0.5rem;
		background: linear-gradient(180deg, #555555 0%, #333333 100%);
		border-radius: var(--radius-full);
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
	}

	:global(.dark) .quick-stat {
		background: linear-gradient(180deg, #4a4a4a 0%, #333333 100%);
	}

	.quick-stat.streak {
		color: white;
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 100%);
		box-shadow:
			0 2px 6px rgba(1, 178, 255, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	/* Profile Link */
	.profile-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		font-size: 0.7rem;
		font-weight: 600;
		color: white;
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-full);
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 50%, #0099dd 100%);
		transition: all 0.15s ease;
		box-shadow:
			0 2px 8px rgba(1, 178, 255, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	}

	.profile-link:hover {
		background: linear-gradient(180deg, #66d9ff 0%, #1ebfff 50%, #00a6e6 100%);
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(1, 178, 255, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}
</style>
