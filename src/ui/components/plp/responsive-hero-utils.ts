import type { ResponsiveHeroImages } from "./category-hero";

const HERO_METADATA_KEYS = {
	hero_desktop: "desktop",
	hero_desktop_retina: "desktopRetina",
	hero_mobile: "mobile",
	hero_mobile_retina: "mobileRetina",
} as const;

/**
 * Extract responsive hero image URLs from Saleor collection/category metadata.
 * Returns undefined if no responsive images are found, so the component
 * falls back to the default backgroundImage.
 */
export function extractResponsiveHeroImages(
	metadata: ReadonlyArray<{ key: string; value: string }> | null | undefined,
	backgroundImage?: string | null,
): ResponsiveHeroImages | undefined {
	if (!metadata?.length) return undefined;

	// Extract base media URL dynamically from the absolute backgroundImage URL if possible.
	// Otherwise, fallback to the default Saleor Core local media URL.
	let mediaBaseUrl = "http://localhost:8000/media/";
	if (backgroundImage && (backgroundImage.startsWith("http://") || backgroundImage.startsWith("https://"))) {
		const mediaIndex = backgroundImage.indexOf("/media/");
		if (mediaIndex !== -1) {
			mediaBaseUrl = backgroundImage.substring(0, mediaIndex + 7); // e.g. "http://localhost:8000/media/"
		}
	}

	const result: Record<string, string> = {};
	let found = false;

	for (const { key, value } of metadata) {
		const prop = HERO_METADATA_KEYS[key as keyof typeof HERO_METADATA_KEYS];
		if (prop && value) {
			// If the metadata value is a relative path, prepend the base media URL
			let imageUrl = value;
			if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
				// Normalize any leading slashes
				const cleanPath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
				imageUrl = mediaBaseUrl + cleanPath;
			}
			result[prop] = imageUrl;
			found = true;
		}
	}

	return found ? (result as unknown as ResponsiveHeroImages) : undefined;
}

/**
 * Extract both default background image and responsive variant URLs from a Page's metadata.
 * Resolves relative storage paths into absolute media URLs.
 */
export function extractPageBanner(
	metadata: ReadonlyArray<{ key: string; value: string }> | null | undefined,
) {
	if (!metadata?.length) return undefined;

	const mediaBaseUrl = "http://localhost:8000/media/";
	const result: Record<string, string> = {};
	let backgroundImage = "";

	for (const { key, value } of metadata) {
		if (key === "background_image" && value) {
			const cleanPath = value.startsWith("/") ? value.substring(1) : value;
			backgroundImage = mediaBaseUrl + cleanPath;
		}
		const prop = HERO_METADATA_KEYS[key as keyof typeof HERO_METADATA_KEYS];
		if (prop && value) {
			const cleanPath = value.startsWith("/") ? value.substring(1) : value;
			result[prop] = mediaBaseUrl + cleanPath;
		}
	}

	return {
		backgroundImage: backgroundImage || null,
		responsiveImages: result as ResponsiveHeroImages,
	};
}
