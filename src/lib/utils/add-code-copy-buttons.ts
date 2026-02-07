import { tick } from 'svelte';

const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>`;
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;

export function addCodeCopyButtons(containerSelector: string) {
	tick().then(() => {
		document.querySelectorAll(`${containerSelector} pre`).forEach((pre) => {
			if (pre.querySelector('.copy-btn')) return;

			const btn = document.createElement('button');
			btn.className = 'copy-btn';
			btn.innerHTML = copyIcon;
			btn.title = 'Copy code';
			btn.setAttribute('aria-label', 'Copy code');
			btn.onclick = async () => {
				const code = pre.querySelector('code')?.textContent || pre.textContent || '';
				await navigator.clipboard.writeText(code);
				btn.innerHTML = checkIcon;
				setTimeout(() => (btn.innerHTML = copyIcon), 2000);
			};
			pre.appendChild(btn);
		});
	});
}
