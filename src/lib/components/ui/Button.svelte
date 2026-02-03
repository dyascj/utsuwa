<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		disabled = false,
		children,
		...rest
	}: Props = $props();

	const variantClasses = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		ghost: 'btn-ghost',
		danger: 'btn-danger'
	};

	const sizeClasses = {
		sm: 'btn-sm',
		md: '',
		lg: 'btn-lg'
	};
</script>

<ButtonPrimitive.Root
	class="btn {variantClasses[variant]} {sizeClasses[size]} {className}"
	{disabled}
	{...rest}
>
	{@render children()}
</ButtonPrimitive.Root>

<style>
	:global(.btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease-out;
		border: 2px solid transparent;
		outline: none;
	}

	:global(.btn:focus-visible) {
		outline: 2px solid var(--color-primary-400);
		outline-offset: 2px;
	}

	:global(.btn:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.btn:active:not(:disabled)) {
		transform: scale(0.97);
	}

	:global(.btn-sm) {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
	}

	:global(.btn-lg) {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
	}

	/* Primary - Cyan glossy */
	:global(.btn-primary) {
		background: linear-gradient(180deg, #4dd0ff 0%, #01B2FF 50%, #0099dd 100%);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
		box-shadow:
			0 4px 12px rgba(1, 178, 255, 0.35),
			0 2px 4px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	:global(.btn-primary:hover:not(:disabled)) {
		background: linear-gradient(180deg, #66d9ff 0%, #1abfff 50%, #01B2FF 100%);
		box-shadow:
			0 6px 16px rgba(1, 178, 255, 0.45),
			0 3px 6px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	/* Secondary - Neutral glossy */
	:global(.btn-secondary) {
		background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
		border: 1px solid rgba(0, 0, 0, 0.08);
		color: var(--text-primary);
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.08),
			0 1px 2px rgba(0, 0, 0, 0.04),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark .btn-secondary) {
		background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
		border-color: rgba(255, 255, 255, 0.1);
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.25),
			0 1px 2px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	:global(.btn-secondary:hover:not(:disabled)) {
		background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
		box-shadow:
			0 3px 8px rgba(0, 0, 0, 0.1),
			0 1px 3px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	:global(.dark .btn-secondary:hover:not(:disabled)) {
		background: linear-gradient(180deg, #454545 0%, #353535 100%);
	}

	/* Ghost - Transparent with subtle hover */
	:global(.btn-ghost) {
		background: transparent;
		border-color: transparent;
		color: var(--text-secondary);
	}

	:global(.btn-ghost:hover:not(:disabled)) {
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.06) 100%);
	}

	:global(.dark .btn-ghost:hover:not(:disabled)) {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.08) 100%);
	}

	/* Danger - Red glossy */
	:global(.btn-danger) {
		background: linear-gradient(180deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
		box-shadow:
			0 4px 12px rgba(239, 68, 68, 0.35),
			0 2px 4px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	:global(.btn-danger:hover:not(:disabled)) {
		background: linear-gradient(180deg, #fca5a5 0%, #f87171 50%, #ef4444 100%);
		box-shadow:
			0 6px 16px rgba(239, 68, 68, 0.45),
			0 3px 6px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}
</style>
