"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { extractResponsiveHeroImages } from "./plp/responsive-hero-utils";
import { useAutoCarouselScroll } from "./use-auto-carousel-scroll";

interface CategoryNode {
	id: string;
	name: string;
	slug: string;
	backgroundImage?:
		| {
				url: string;
				alt?: string | null | undefined;
		  }
		| null
		| undefined;
	metadata: Array<{ key: string; value: string }>;
	products?:
		| {
				totalCount?: number | null | undefined;
		  }
		| null
		| undefined;
}

interface CategoryShowcaseProps {
	categories: CategoryNode[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
	// Filter out the 'Default Category' since it is just an internal system placeholder
	const showcaseCategories = categories.filter((c) => c.slug !== "default-category");
	const { scrollRef, setIsAutoScrollPaused } = useAutoCarouselScroll<HTMLDivElement>({
		enabled: showcaseCategories.length > 1,
	});

	// Carousel navigation scrolling triggers
	const handleScroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const { scrollLeft, clientWidth } = scrollRef.current;
			// Scroll 80% of the visible container width for a natural visual break
			const scrollAmount = clientWidth * 0.8;
			scrollRef.current.scrollTo({
				left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="to-secondary/15 relative w-full bg-gradient-to-b from-transparent py-16">
			{/* Custom embedded style to cleanly hide native scrollbars across all browsers */}
			<style>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-primary">
							🌾 Pure Curation
						</span>
						<h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Shop by Category</h2>
					</div>

					{/* Navigation controls & Description */}
					<div className="flex w-full items-center justify-between gap-6 md:w-auto md:justify-end">
						<p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground lg:block">
							Find exactly what you need — explore our complete range of certified organic grains, spices, and
							botanicals.
						</p>

						{/* Left / Right Arrow buttons */}
						<div className="flex items-center gap-3">
							<button
								onClick={() => handleScroll("left")}
								aria-label="Scroll left"
								className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow active:scale-95"
							>
								<ArrowLeft className="h-5 w-5" />
							</button>
							<button
								onClick={() => handleScroll("right")}
								aria-label="Scroll right"
								className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow active:scale-95"
							>
								<ArrowRight className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>

				{/* Snapping Scroll Container */}
				<div
					ref={scrollRef}
					className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
					style={{ WebkitOverflowScrolling: "touch" }}
					onPointerEnter={() => setIsAutoScrollPaused(true)}
					onPointerLeave={() => setIsAutoScrollPaused(false)}
					onPointerDown={() => setIsAutoScrollPaused(true)}
					onPointerUp={(event) => setIsAutoScrollPaused(event.currentTarget.matches(":hover"))}
					onPointerCancel={() => setIsAutoScrollPaused(false)}
					onFocusCapture={() => setIsAutoScrollPaused(true)}
					onBlurCapture={() => setIsAutoScrollPaused(false)}
				>
					{showcaseCategories.map((category) => {
						const hasImage = !!category.backgroundImage?.url;
						const responsiveData = extractResponsiveHeroImages(
							category.metadata,
							category.backgroundImage?.url,
						);
						const { desktop, desktopRetina, mobile, mobileRetina } = responsiveData ?? {};
						const hasResponsive = !!(desktop || desktopRetina || mobile || mobileRetina);

						return (
							<Link
								key={category.id}
								href={`/default-channel/categories/${category.slug}`}
								className="from-secondary/50 to-primary/5 group relative flex h-[240px] w-[260px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-border bg-gradient-to-tr via-background p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[290px] md:w-[320px]"
							>
								{/* Background Image */}
								<div className="absolute inset-0 z-0 overflow-hidden">
									{hasImage ? (
										<>
											{hasResponsive ? (
												<picture>
													{mobileRetina && (
														<source
															media="(max-width: 767px) and (min-resolution: 2dppx)"
															srcSet={mobileRetina}
														/>
													)}
													{mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
													{desktopRetina && (
														<source
															media="(min-width: 768px) and (min-resolution: 2dppx)"
															srcSet={desktopRetina}
														/>
													)}
													{desktop && <source media="(min-width: 768px)" srcSet={desktop} />}
													<img
														src={category.backgroundImage?.url}
														alt={category.backgroundImage?.alt || category.name}
														className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</picture>
											) : (
												<>
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={category.backgroundImage?.url}
														alt={category.backgroundImage?.alt || category.name}
														className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</>
											)}
											{/* Gradient Overlay */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity group-hover:opacity-90" />
										</>
									) : (
										// Fallback to a stunning organic brand-colored CSS gradient card if category has no seeded cover image
										<>
											<div className="from-primary/10 via-secondary/35 to-accent/10 absolute inset-0 bg-gradient-to-tr transition-transform duration-500 group-hover:scale-105" />
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
										</>
									)}
								</div>

								{/* Card Content */}
								<div className="relative z-10 flex flex-col gap-1 text-white">
									{/* Product Count Badge */}
									{category.products?.totalCount != null && (
										<span className="text-primary-foreground/90 bg-primary/80 self-start rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
											{category.products.totalCount} Products
										</span>
									)}

									{/* Title */}
									<h3 className="flex items-center gap-1 text-lg font-bold tracking-tight text-white drop-shadow-sm sm:text-xl">
										{category.name}
									</h3>

									{/* CTA Line */}
									<div className="mt-1 flex items-center gap-1 text-xs font-medium text-white/80 transition-colors group-hover:text-white">
										Explore Category
										<ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
