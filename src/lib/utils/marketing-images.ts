import imageManifest from '$lib/data/marketing-images.json';

type ImageAsset = {
	src: string;
	srcset: string;
	width: number;
	height: number;
	poster?: { src: string; srcset: string };
};

const images: Record<string, ImageAsset> = imageManifest;

// Keep original URLs in post metadata for social previews. Page images use
// compressed variants, with a still frame for animated thumbnails.
export function marketingImage(src: string, sizes: string, thumbnail = false) {
	const image = images[src];
	if (!image) return { src, decoding: 'async' as const };
	const variant = thumbnail && image.poster ? image.poster : image;
	return {
		src: variant.src,
		srcset: variant.srcset || undefined,
		sizes,
		width: image.width,
		height: image.height,
		decoding: 'async' as const
	};
}
