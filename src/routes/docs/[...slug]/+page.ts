import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const modules = import.meta.glob('/src/content/docs/**/*.md');

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;
	const path = `/src/content/docs/${slug}.md`;

	if (!modules[path]) {
		throw error(404, `Page not found: ${slug}`);
	}

	const module = (await modules[path]()) as { default: ConstructorOfATypedSvelteComponent; metadata: Record<string, string> };

	return {
		content: module.default,
		metadata: module.metadata,
		slug
	};
};
