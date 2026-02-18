import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const host = event.request.headers.get('host') || '';

	if (host.startsWith('app.')) {
		const path = event.url.pathname === '/' ? '/app' : `/app${event.url.pathname}`;
		redirect(301, `https://utsuwa.ai${path}`);
	}

	if (host.startsWith('docs.')) {
		const path =
			event.url.pathname === '/' ? '/docs/overview/introduction' : `/docs${event.url.pathname}`;
		redirect(301, `https://utsuwa.ai${path}`);
	}

	return resolve(event);
};
