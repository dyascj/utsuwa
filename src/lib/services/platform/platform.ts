import { browser } from '$app/environment';

/**
 * Check if running in a Tauri desktop environment
 */
export function isTauri(): boolean {
	// Tauri 2.x uses __TAURI_INTERNALS__, Tauri 1.x uses __TAURI__
	return browser && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
}

/**
 * Check if running in a web browser (not Tauri)
 */
export function isWeb(): boolean {
	return browser && !isTauri();
}

/**
 * Get the current platform name
 */
export function getPlatform(): 'tauri' | 'web' | 'server' {
	if (!browser) return 'server';
	return isTauri() ? 'tauri' : 'web';
}
