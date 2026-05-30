import { Suspense } from "react";
import {
	ProductListByCollectionDocument,
	ProductOrderField,
	OrderDirection,
	PageGetBySlugDocument,
	CollectionsGetListDocument,
	CategoriesGetListDocument,
} from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { ProductList } from "@/ui/components/product-list";
import { HeroBanner } from "@/ui/components/hero-banner";
import { PromoBanner } from "@/ui/components/promo-banner";
import { CollectionShowcase } from "@/ui/components/collection-showcase";
import { CategoryShowcase } from "@/ui/components/category-showcase";
import { ValueBar } from "@/ui/components/homepage/value-bar";
import { PhilosophyPanel } from "@/ui/components/homepage/philosophy-panel";
import { NewsletterCard } from "@/ui/components/homepage/newsletter-card";
import { extractPageBanner } from "@/ui/components/plp";
import { parseEditorJSToText } from "@/lib/editorjs";

export const metadata = {
	title: {
		absolute: "Exlynatural",
	},
	description: "Shop natural wellness essentials crafted for everyday care.",
};

/**
 * Cached function to fetch featured products.
 */
async function getFeaturedProducts(channel: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, "featured-products");

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel,
			first: 12,
			sortBy: { field: ProductOrderField.Collection, direction: OrderDirection.Asc },
		},
		revalidate: 300,
	});

	if (!result.ok) {
		console.warn(`[Homepage] Failed to fetch featured products for ${channel}:`, result.error.message);
		return [];
	}

	return result.data.collection?.products?.edges.map(({ node }) => node) ?? [];
}

/**
 * Cached function to fetch dynamic homepage hero banner page.
 */
async function getHomeBanner() {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, "home-banner");

	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug: "home-banner" },
		revalidate: 300,
	});

	if (!result.ok) {
		console.warn(`[Homepage] Failed to fetch home-banner page:`, result.error.message);
		return null;
	}

	if (!result.data.page) {
		console.warn(`[Homepage] Home-banner page not found in database.`);
		return null;
	}

	return result.data.page;
}

/**
 * Cached function to fetch dynamic homepage middle campaign promo banner page.
 */
async function getPromoBanner() {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, "middle-promo-banner");

	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug: "middle-promo-banner" },
		revalidate: 300,
	});

	if (!result.ok) {
		console.warn(`[Homepage] Failed to fetch middle-promo page:`, result.error.message);
		return null;
	}

	if (!result.data.page) {
		console.warn(`[Homepage] Middle-promo page not found in database.`);
		return null;
	}

	return result.data.page;
}

/**
 * Cached function to fetch all collections for the showcase grid.
 */
async function getCollectionsList() {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, "list");

	const result = await executePublicGraphQL(CollectionsGetListDocument, {
		variables: { first: 10 },
		revalidate: 300,
	});

	if (!result.ok) {
		console.warn("[Homepage] Failed to fetch collections list:", result.error.message);
		return [];
	}

	if (!result.data.collections) {
		console.warn("[Homepage] Collections list not found in database.");
		return [];
	}

	return result.data.collections.edges.map(({ node }) => node) ?? [];
}

/**
 * Cached function to fetch all categories for the category showcase carousel.
 */
async function getCategoriesList() {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, "categories-list");

	const result = await executePublicGraphQL(CategoriesGetListDocument, {
		variables: { first: 15 },
		revalidate: 300,
	});

	if (!result.ok) {
		console.warn("[Homepage] Failed to fetch categories list:", result.error.message);
		return [];
	}

	if (!result.data.categories) {
		console.warn("[Homepage] Categories list not found in database.");
		return [];
	}

	return result.data.categories.edges.map(({ node }) => node) ?? [];
}

/**
 * Page shell — renders immediately with dynamic banners, trust value badges, and featured products grid.
 */
export default function Page(props: { params: Promise<{ channel: string }> }) {
	return (
		<div className="flex w-full flex-col">
			{/* Top-level full-bleed Hero Banner */}
			<Suspense fallback={<HeroBannerSkeleton />}>
				<HomeHero />
			</Suspense>

			{/* Widget 1: Trust Value Bar (Sprout, Package, Shipping, Checkout) */}
			<ValueBar />

			{/* Boxed featured products list */}
			<section className="mx-auto w-full max-w-7xl p-8 pb-16">
				<div className="mb-8">
					<span className="text-xs font-semibold uppercase tracking-wider text-primary">
						🌿 Featured Selection
					</span>
					<h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Our Best Sellers</h2>
				</div>
				<Suspense
					fallback={
						<ul
							role="list"
							data-testid="ProductList"
							className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3"
						>
							{Array.from({ length: 12 }).map((_, i) => (
								<li key={i} className="animate-pulse">
									<div className="animate-delayed aspect-square overflow-hidden bg-secondary" />
									<div className="mt-2 flex justify-between">
										<div>
											<div className="mt-1 h-4 w-32 rounded bg-secondary" />
											<div className="mt-1 h-4 w-20 rounded bg-secondary" />
										</div>
										<div className="mt-1 h-4 w-16 rounded bg-secondary" />
									</div>
								</li>
							))}
						</ul>
					}
				>
					<FeaturedProducts params={props.params} />
				</Suspense>
			</section>

			{/* Upgraded Shop by Category Carousel Slider */}
			<Suspense fallback={<div className="bg-secondary/10 h-64 w-full animate-pulse" />}>
				<CategoriesShowcaseSection />
			</Suspense>

			{/* Editorial Brand Philosophy Panel */}
			<PhilosophyPanel />

			{/* Upgraded Shop by Collection Carousel Slider */}
			<Suspense fallback={<div className="bg-secondary/10 h-64 w-full animate-pulse" />}>
				<CollectionsShowcaseSection />
			</Suspense>

			{/* Option 3: Split-Screen Editorial Sourcing Campaign Banner */}
			<Suspense fallback={<div className="bg-secondary/10 h-96 w-full animate-pulse" />}>
				<PromoBannerSection />
			</Suspense>

			{/* Widget 3: Join the Green Community Newsletter Subscription Card */}
			<NewsletterCard />
		</div>
	);
}

/**
 * Async component to fetch and render the home hero banner.
 */
async function HomeHero() {
	const bannerPage = await getHomeBanner();

	if (!bannerPage) return null;

	const plainDescription = parseEditorJSToText(bannerPage.content);
	const bannerData = extractPageBanner(bannerPage.metadata);

	return (
		<HeroBanner
			title={bannerPage.title}
			description={plainDescription}
			backgroundImage={bannerData?.backgroundImage}
			responsiveImages={bannerData?.responsiveImages}
		/>
	);
}

/**
 * Async component to fetch and render the featured products list.
 */
async function FeaturedProducts({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;
	const products = await getFeaturedProducts(channel);

	return <ProductList products={products} />;
}

/**
 * Async component to fetch and render the categories showcase grid.
 */
async function CategoriesShowcaseSection() {
	const categories = await getCategoriesList();

	if (!categories.length) return null;

	return <CategoryShowcase categories={categories} />;
}

/**
 * Async component to fetch and render the collections showcase grid.
 */
async function CollectionsShowcaseSection() {
	const collections = await getCollectionsList();

	if (!collections.length) return null;

	return <CollectionShowcase collections={collections} />;
}

/**
 * Async component to fetch and render the middle campaign promo banner.
 */
async function PromoBannerSection() {
	const promoPage = await getPromoBanner();

	if (!promoPage) return null;

	const plainDescription = parseEditorJSToText(promoPage.content);
	const bannerData = extractPageBanner(promoPage.metadata);

	return (
		<PromoBanner
			title={promoPage.title}
			description={plainDescription}
			backgroundImage={bannerData?.backgroundImage}
			responsiveImages={bannerData?.responsiveImages}
		/>
	);
}

/**
 * Premium skeleton for Hero Banner to match dimensions exactly and prevent CLS.
 */
function HeroBannerSkeleton() {
	return (
		<div className="flex min-h-[440px] w-full animate-pulse items-center justify-center bg-muted md:h-[520px]">
			<div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
				<div className="flex max-w-xl flex-col gap-6 rounded-2xl border border-white/5 bg-black/10 p-8 md:p-10">
					<div className="h-6 w-36 rounded-full bg-black/10" />
					<div className="h-10 w-full rounded-lg bg-black/10" />
					<div className="h-16 w-full rounded-lg bg-black/10" />
					<div className="flex gap-4">
						<div className="h-12 w-36 rounded-xl bg-black/10" />
						<div className="h-12 w-36 rounded-xl bg-black/10" />
					</div>
				</div>
			</div>
		</div>
	);
}
