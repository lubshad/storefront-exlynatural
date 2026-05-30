"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { extractResponsiveHeroImages } from "./plp/responsive-hero-utils";
import { useAutoCarouselScroll } from "./use-auto-carousel-scroll";

interface CollectionNode {
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

interface CollectionShowcaseProps {
	collections: CollectionNode[];
}

export function CollectionShowcase({ collections }: CollectionShowcaseProps) {
	const { scrollRef, setIsAutoScrollPaused } = useAutoCarouselScroll<HTMLDivElement>({
		enabled: collections.length > 1,
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
		<section className="to-secondary/30 relative w-full bg-gradient-to-b from-transparent py-16">
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
							🌿 Curated Wellness
						</span>
						<h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Shop by Collection</h2>
					</div>

					{/* Navigation controls & Description */}
					<div className="flex w-full items-center justify-between gap-6 md:w-auto md:justify-end">
						<p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground lg:block">
							Explore our dynamically-seeded ranges of natural food ingredients, dried botanicals, and pantry
							grains.
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
					{collections.map((collection) => {
						const hasImage = !!collection.backgroundImage?.url;
						const responsiveData = extractResponsiveHeroImages(
							collection.metadata,
							collection.backgroundImage?.url,
						);
						const { desktop, desktopRetina, mobile, mobileRetina } = responsiveData ?? {};
						const hasResponsive = !!(desktop || desktopRetina || mobile || mobileRetina);

						return (
							<Link
								key={collection.id}
								href={`/default-channel/collections/${collection.slug}`}
								className="group relative flex h-[280px] w-[290px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-border bg-muted p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[320px] md:w-[350px]"
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
														src={collection.backgroundImage?.url}
														alt={collection.backgroundImage?.alt || collection.name}
														className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</picture>
											) : (
												<>
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={collection.backgroundImage?.url}
														alt={collection.backgroundImage?.alt || collection.name}
														className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</>
											)}
											{/* Gradient Overlay */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />
										</>
									) : (
										<div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-background to-secondary" />
									)}
								</div>

								{/* Card Content */}
								<div className="relative z-10 flex flex-col gap-1.5 text-white">
									{/* Product Count Badge */}
									{collection.products?.totalCount != null && (
										<span className="text-primary-foreground/90 bg-primary/80 self-start rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
											{collection.products.totalCount} Products
										</span>
									)}

									{/* Title */}
									<h3 className="flex items-center gap-1 text-xl font-bold tracking-tight text-white drop-shadow-sm">
										{collection.name}
									</h3>

									{/* CTA Line */}
									<div className="mt-1 flex items-center gap-1 text-xs font-medium text-white/80 transition-colors group-hover:text-white">
										Explore Collection
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
