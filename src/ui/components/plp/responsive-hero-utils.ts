import type { ResponsiveHeroImages } from "./category-hero";

const HERO_METADATA_KEYS = {
	hero_desktop: "desktop",
	hero_desktop_retina: "desktopRetina",
	hero_mobile: "mobile",
	hero_mobile_retina: "mobileRetina",
} as const;

function normalizeMediaBaseUrl(url: string): string {
	return url.endsWith("/") ? url : `${url}/`;
}

function extractMediaBaseUrlFromImageUrl(imageUrl?: string | null): string | undefined {
	if (!imageUrl?.startsWith("http://") && !imageUrl?.startsWith("https://")) {
		return undefined;
	}

	const mediaIndex = imageUrl.indexOf("/media/");
	return mediaIndex === -1 ? undefined : imageUrl.substring(0, mediaIndex + 7);
}

function getConfiguredMediaBaseUrl(): string | undefined {
	if (process.env.NEXT_PUBLIC_SALEOR_MEDIA_URL) {
		return normalizeMediaBaseUrl(process.env.NEXT_PUBLIC_SALEOR_MEDIA_URL);
	}

	if (process.env.NEXT_PUBLIC_SALEOR_API_URL) {
		try {
			const apiUrl = new URL(process.env.NEXT_PUBLIC_SALEOR_API_URL);
			return `${apiUrl.origin}/media/`;
		} catch {
			// Ignore invalid configuration and use the development fallback below.
		}
	}

	return undefined;
}

function resolveMediaUrl(value: string, mediaBaseUrl?: string): string | undefined {
	if (value.startsWith("http://") || value.startsWith("https://")) {
		return value;
	}

	if (!mediaBaseUrl) {
		return undefined;
	}

	const cleanPath = value.startsWith("/") ? value.substring(1) : value;
	return `${mediaBaseUrl}${cleanPath}`;
}

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

	const mediaBaseUrl = extractMediaBaseUrlFromImageUrl(backgroundImage) ?? getConfiguredMediaBaseUrl();

	const result: Record<string, string> = {};
	let found = false;

	for (const { key, value } of metadata) {
		const prop = HERO_METADATA_KEYS[key as keyof typeof HERO_METADATA_KEYS];
		if (prop && value) {
			const imageUrl = resolveMediaUrl(value, mediaBaseUrl);
			if (imageUrl) {
				result[prop] = imageUrl;
				found = true;
			}
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

	const mediaBaseUrl = getConfiguredMediaBaseUrl();
	const result: Record<string, string> = {};
	let backgroundImage = "";

	for (const { key, value } of metadata) {
		if (key === "background_image" && value) {
			backgroundImage = resolveMediaUrl(value, mediaBaseUrl) ?? "";
		}
		const prop = HERO_METADATA_KEYS[key as keyof typeof HERO_METADATA_KEYS];
		if (prop && value) {
			const imageUrl = resolveMediaUrl(value, mediaBaseUrl);
			if (imageUrl) {
				result[prop] = imageUrl;
			}
		}
	}

	return {
		backgroundImage: backgroundImage || null,
		responsiveImages: result as ResponsiveHeroImages,
	};
}
