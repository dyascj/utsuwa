<script lang="ts">
	import { browser } from '$app/environment';
	import { Icon } from '$lib/components/ui';
	import { themeStore, THEMES } from '$lib/stores/theme.svelte';
	import { displayStore } from '$lib/stores/display.svelte';

	type ColorMode = 'system' | 'light' | 'dark';
	let colorMode = $state<ColorMode>('system');

	// Load saved mode on init
	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('colorMode') as ColorMode | null;
			if (saved && ['system', 'light', 'dark'].includes(saved)) {
				colorMode = saved;
			}
			applyColorMode(colorMode);
		}
	});

	function setColorMode(mode: ColorMode) {
		colorMode = mode;
		if (browser) {
			localStorage.setItem('colorMode', mode);
			applyColorMode(mode);
		}
	}

	function applyColorMode(mode: ColorMode) {
		if (!browser) return;

		let shouldBeDark: boolean;
		if (mode === 'system') {
			shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		} else {
			shouldBeDark = mode === 'dark';
		}

		document.documentElement.classList.toggle('dark', shouldBeDark);
	}

	// Listen for system theme changes when in system mode
	$effect(() => {
		if (!browser) return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => {
			if (colorMode === 'system') {
				applyColorMode('system');
			}
		};

		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});

	function selectTheme(themeId: string) {
		themeStore.setTheme(themeId);
	}

	// Get preview colors for a theme based on current mode
	function getPreviewColors(theme: typeof THEMES[0]) {
		return [
			theme.colors.accent,
			theme.colors.green,
			theme.colors.blue,
			theme.colors.yellow,
			theme.colors.mauve
		];
	}
</script>

<div class="page">
	<header class="page-header">
		<h2>Display</h2>
		<p>Appearance and display settings.</p>
	</header>

	<div class="sections">
		<!-- Color Mode Selector -->
		<section class="section">
			<h3>Mode</h3>
			<div class="setting-row">
				<div class="setting-info">
					<span class="setting-label">Appearance</span>
					<span class="setting-desc">Choose light, dark, or match your system</span>
				</div>
				<div class="mode-selector">
					<button
						class="mode-option"
						class:active={colorMode === 'system'}
						onclick={() => setColorMode('system')}
					>
						<Icon name="monitor" size={16} />
						<span>System</span>
					</button>
					<button
						class="mode-option"
						class:active={colorMode === 'light'}
						onclick={() => setColorMode('light')}
					>
						<Icon name="sun" size={16} />
						<span>Light</span>
					</button>
					<button
						class="mode-option"
						class:active={colorMode === 'dark'}
						onclick={() => setColorMode('dark')}
					>
						<Icon name="moon" size={16} />
						<span>Dark</span>
					</button>
				</div>
			</div>
		</section>

		<!-- Color Theme Selector -->
		<section class="section">
			<h3>Color Theme</h3>
			<div class="theme-grid">
				{#each THEMES as theme (theme.id)}
					<button
						class="theme-card"
						class:selected={themeStore.currentThemeId === theme.id}
						onclick={() => selectTheme(theme.id)}
					>
						<div class="theme-content">
							<div class="theme-info">
								<span class="theme-name">{theme.name}</span>
								<span class="theme-desc">{theme.description}</span>
							</div>
							<div class="theme-colors">
								{#each getPreviewColors(theme) as color}
									<span class="color-dot" style="background: {color}"></span>
								{/each}
							</div>
						</div>
						{#if themeStore.currentThemeId === theme.id}
							<div class="selected-badge">
								<Icon name="check" size={14} strokeWidth={3} />
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<!-- Camera Settings -->
		<section class="section">
			<h3>Camera</h3>
			<div class="setting-row">
				<div class="setting-info">
					<span class="setting-label">Starting Zoom</span>
					<span class="setting-desc">Adjust the default camera distance from the model</span>
				</div>
				<div class="slider-container">
					<span class="slider-label">Close</span>
					<input
						type="range"
						min="1"
						max="4"
						step="0.1"
						value={displayStore.cameraDistance}
						oninput={(e) => displayStore.setCameraDistance(parseFloat(e.currentTarget.value))}
						class="zoom-slider"
					/>
					<span class="slider-label">Far</span>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	.page {
		height: 100%;
		max-width: 640px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.page-header {
		margin-bottom: 1.5rem;
		flex-shrink: 0;
	}

	.page-header h2 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.page-header p {
		margin: 0;
		color: var(--text-tertiary);
		font-size: 0.875rem;
	}

	.sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		flex: 1;
		overflow-y: auto;
		min-height: 0;
		padding-bottom: 1rem;
	}

	.section h3 {
		margin: 0 0 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 14px;
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.06),
			0 1px 3px rgba(0, 0, 0, 0.04),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .setting-row {
		background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.25),
			0 1px 3px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.setting-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.setting-label {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text-primary);
	}

	.setting-desc {
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	/* Mode Selector - Skeuomorphic */
	.mode-selector {
		display: flex;
		background: linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 100%);
		border-radius: 12px;
		padding: 4px;
		gap: 3px;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.08),
			0 1px 0 rgba(255, 255, 255, 0.8);
	}

	:global(.dark) .mode-selector {
		background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.3),
			0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.mode-option {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		background: transparent;
		border: none;
		border-radius: 9px;
		color: var(--text-tertiary);
		font-size: 0.8125rem;
		font-weight: 500;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.15s ease-out;
	}

	.mode-option:hover:not(.active) {
		color: var(--text-secondary);
		background: rgba(255, 255, 255, 0.5);
	}

	:global(.dark) .mode-option:hover:not(.active) {
		background: rgba(255, 255, 255, 0.05);
	}

	.mode-option.active {
		background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
		color: var(--text-primary);
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.12),
			0 1px 2px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .mode-option.active {
		background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.3),
			0 1px 2px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	/* Theme Grid */
	.theme-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.theme-card {
		position: relative;
		display: flex;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
		border: 2px solid rgba(0, 0, 0, 0.06);
		border-radius: 14px;
		cursor: pointer;
		transition: all 0.15s ease-out;
		text-align: left;
		font-family: inherit;
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.06),
			0 1px 3px rgba(0, 0, 0, 0.04),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .theme-card {
		background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.25),
			0 1px 3px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.theme-card:hover {
		transform: translateY(-2px);
		border-color: rgba(0, 0, 0, 0.1);
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.1),
			0 2px 6px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .theme-card:hover {
		border-color: rgba(255, 255, 255, 0.12);
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.35),
			0 2px 6px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.theme-card.selected {
		border-color: rgba(1, 178, 255, 0.5);
		background: linear-gradient(180deg, #e8f7ff 0%, #d8f0ff 100%);
		box-shadow:
			0 3px 12px rgba(1, 178, 255, 0.2),
			0 1px 3px rgba(1, 178, 255, 0.1),
			0 0 0 2px rgba(1, 178, 255, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark) .theme-card.selected {
		background: linear-gradient(180deg, #1a3040 0%, #152530 100%);
		box-shadow:
			0 3px 12px rgba(1, 178, 255, 0.25),
			0 1px 3px rgba(1, 178, 255, 0.15),
			0 0 0 2px rgba(1, 178, 255, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.theme-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		gap: 1rem;
	}

	.theme-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.theme-name {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-primary);
	}

	.theme-desc {
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	.theme-colors {
		display: flex;
		gap: 0.375rem;
		flex-shrink: 0;
	}

	.color-dot {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.selected-badge {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 100%);
		color: white;
		border-radius: 50%;
		box-shadow:
			0 2px 6px rgba(1, 178, 255, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	/* Slider - Skeuomorphic */
	.slider-container {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.slider-label {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		white-space: nowrap;
	}

	.zoom-slider {
		width: 120px;
		height: 8px;
		appearance: none;
		background: linear-gradient(180deg, #d0d0d0 0%, #e0e0e0 100%);
		border-radius: 4px;
		cursor: pointer;
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.15),
			0 1px 0 rgba(255, 255, 255, 0.8);
	}

	:global(.dark) .zoom-slider {
		background: linear-gradient(180deg, #1a1a1a 0%, #252525 100%);
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.4),
			0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.zoom-slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 100%);
		border-radius: 50%;
		cursor: pointer;
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.2),
			0 1px 2px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
		transition: transform 0.1s ease-out;
	}

	.zoom-slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	.zoom-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 100%);
		border: none;
		border-radius: 50%;
		cursor: pointer;
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.2),
			0 1px 2px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	/* Tablet and below */
	@media (max-width: 640px) {
		.page-header {
			margin-bottom: 1rem;
		}

		.page-header h2 {
			font-size: 1.25rem;
		}

		.sections {
			gap: 1.25rem;
		}

		.section h3 {
			margin-bottom: 0.75rem;
		}
	}

	/* Mobile */
	@media (max-width: 520px) {
		.setting-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.mode-selector {
			align-self: stretch;
		}

		.mode-option {
			flex: 1;
			justify-content: center;
		}

		.slider-container {
			width: 100%;
		}

		.zoom-slider {
			flex: 1;
		}
	}

	@media (max-width: 480px) {
		.theme-card {
			padding: 0.875rem;
		}

		.theme-content {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.625rem;
		}

		.theme-colors {
			align-self: flex-start;
		}

		.color-dot {
			width: 18px;
			height: 18px;
		}

		.theme-name {
			font-size: 0.875rem;
		}

		.selected-badge {
			top: 0.625rem;
			right: 0.625rem;
			width: 22px;
			height: 22px;
		}
	}
</style>
