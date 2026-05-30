import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ResponsiveHeroImages } from "./plp/category-hero";

interface HeroBannerProps {
	title: string;
	description?: string | null;
	backgroundImage?: string | null;
	responsiveImages?: ResponsiveHeroImages;
}

export function HeroBanner({ title, description, backgroundImage, responsiveImages }: HeroBannerProps) {
	const hasImage = !!backgroundImage;
	const { desktop, desktopRetina, mobile, mobileRetina } = responsiveImages ?? {};
	const hasResponsiveImages = !!(desktop || desktopRetina || mobile || mobileRetina);

	return (
		<section className="relative flex min-h-[280px] w-full items-center overflow-hidden border-b border-border bg-white sm:min-h-[420px] md:h-[560px]">
			{/* Cross-browser custom slow-zoom animation for Ken Burns effect */}
			<style>{`
				@keyframes kenburns {
					0% { transform: scale(1.02) translate(0px, 0px); }
					50% { transform: scale(1.06) translate(-5px, 2px); }
					100% { transform: scale(1.02) translate(0px, 0px); }
				}
				.animate-kenburns {
					animation: kenburns 28s ease-in-out infinite;
				}
			`}</style>

			{/* Background Image Container */}
			<div className="absolute inset-0 z-0 overflow-hidden">
				{hasImage ? (
					<>
						{hasResponsiveImages ? (
							<picture>
								{/* Mobile retina */}
								{mobileRetina && (
									<source media="(max-width: 767px) and (min-resolution: 2dppx)" srcSet={mobileRetina} />
								)}
								{/* Mobile 1x */}
								{mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
								{/* Desktop retina */}
								{desktopRetina && (
									<source media="(min-width: 768px) and (min-resolution: 2dppx)" srcSet={desktopRetina} />
								)}
								{/* Desktop 1x */}
								{desktop && <source media="(min-width: 768px)" srcSet={desktop} />}
								{/* Fallback */}
								{ }
								<img
									src={backgroundImage}
									alt={title}
									className="animate-kenburns h-full w-full object-cover object-center"
								/>
							</picture>
						) : (
							<>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={backgroundImage}
									alt={title}
									className="animate-kenburns h-full w-full object-cover object-center"
								/>
							</>
						)}
						{/* Clean, light gradient overlay - hidden on mobile so background photo is clean and organic */}
						<div className="pointer-events-none absolute inset-0 z-10 hidden bg-gradient-to-r from-white/60 via-white/20 to-transparent sm:block md:from-white/40 md:via-white/5 md:to-transparent" />
					</>
				) : (
					<div className="from-primary/10 to-secondary/10 absolute inset-0 bg-gradient-to-tr via-background" />
				)}
			</div>

			{/* Content Box */}
			<div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-24 lg:px-8">
				{/* Card completely hidden on Mobile viewports to display the organic image full-bleed */}
				<div className="hidden max-w-2xl transform flex-col gap-5 rounded-3xl border border-white/60 bg-white/80 p-6 text-foreground shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.005] hover:border-white/80 hover:bg-white/85 sm:flex sm:gap-6 sm:p-10 md:p-12">
					{/* Badge / Tagline */}
					<div className="bg-primary/10 border-primary/20 inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary shadow-sm">
						🌿 Certified Organic Wellness
					</div>

					{/* Title with luxurious charcoal-to-brand-green gradient text */}
					<h1 className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-primary bg-clip-text text-3xl font-black leading-[1.15] tracking-tight text-transparent sm:text-5xl sm:leading-[1.1] md:text-6xl">
						{title}
					</h1>

					{/* Description - Hidden on Mobile to prioritize visual aesthetic and reduce clutter */}
					{description && (
						<p className="hidden max-w-xl text-sm font-light leading-relaxed text-neutral-700 sm:block sm:text-base md:text-lg">
							{description}
						</p>
					)}

					{/* Sourcing/Quality Trust Bullets - Hidden on Mobile for clean minimalist look */}
					<div className="hidden flex-wrap items-center gap-x-6 gap-y-2 border-t border-neutral-200/60 pt-5 text-xs font-semibold text-neutral-600 sm:flex">
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-bold text-primary">✓</span> 100% Organic Certified
						</div>
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-bold text-primary">✓</span> Direct Trade Sourced
						</div>
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-bold text-primary">✓</span> Eco-Friendly Packaging
						</div>
					</div>

					{/* Interactive CTAs - Secondary button hidden on Mobile to focus user action */}
					<div className="mt-1 flex flex-wrap items-center gap-4 sm:mt-2">
						<Link
							href="/default-channel/collections/featured-products"
							className="hover:bg-primary/95 hover:shadow-primary/20 group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl sm:w-auto sm:py-4 sm:text-base"
						>
							Shop Collections
							<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
						<Link
							href="/default-channel/collections/botanicals"
							className="hidden items-center justify-center gap-2 rounded-xl border border-neutral-200/80 bg-white/60 px-6 py-4 font-bold text-neutral-800 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md sm:inline-flex"
						>
							Explore Botanicals
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
