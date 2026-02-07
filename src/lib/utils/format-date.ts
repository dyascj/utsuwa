export function formatDate(raw: string | Date): string {
	const d = raw instanceof Date ? raw : new Date(raw + 'T00:00:00');
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
