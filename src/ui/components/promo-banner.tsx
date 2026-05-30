import Link from "next/link";
import { ArrowRight, Check, Leaf, PackageCheck, Sprout } from "lucide-react";
import type { ResponsiveHeroImages } from "./plp/category-hero";

interface PromoBannerProps {
	title: string;
	description?: string | null;
	backgroundImage?: string | null;
	responsiveImages?: ResponsiveHeroImages;
}

export function PromoBanner({ title, description, backgroundImage, responsiveImages }: PromoBannerProps) {
	const hasImage = !!backgroundImage;
	const { desktop, desktopRetina, mobile, mobileRetina } = responsiveImages ?? {};
	const hasResponsiveImages = !!(desktop || desktopRetina || mobile || mobileRetina);

	const features = [
		"Harvested in small seasonal batches",
		"Sourced directly from trusted growers",
		"Prepared without additives or fillers",
		"Packed quickly to protect natural aroma",
	];

	const highlights = [
		{ icon: <Sprout className="h-4 w-4" />, label: "Farm Direct" },
		{ icon: <Leaf className="h-4 w-4" />, label: "Naturally Grown" },
		{ icon: <PackageCheck className="h-4 w-4" />, label: "Freshness Sealed" },
	];

	return (
		<section className="w-full bg-card py-14 md:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="shadow-primary/5 grid overflow-hidden rounded-2xl border border-border bg-background shadow-xl md:grid-cols-[1.05fr_0.95fr]">
					<div className="relative min-h-[320px] overflow-hidden bg-muted md:min-h-[560px]">
						{hasImage ? (
							<>
								{hasResponsiveImages ? (
									<picture>
										{mobileRetina && (
											<source media="(max-width: 767px) and (min-resolution: 2dppx)" srcSet={mobileRetina} />
										)}
										{mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
										{desktopRetina && (
											<source media="(min-width: 768px) and (min-resolution: 2dppx)" srcSet={desktopRetina} />
										)}
										{desktop && <source media="(min-width: 768px)" srcSet={desktop} />}
										<img
											src={backgroundImage}
											alt={title}
											className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
										/>
									</picture>
								) : (
									<>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={backgroundImage}
											alt={title}
											className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
										/>
									</>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
							</>
						) : (
							<div className="absolute inset-0 bg-[linear-gradient(135deg,_var(--accent),_var(--secondary)_48%,_oklch(0.94_0.07_92))]" />
						)}

						<div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2 sm:inset-x-8 sm:bottom-8 sm:gap-3">
							{highlights.map((highlight) => (
								<div
									key={highlight.label}
									className="flex min-h-20 flex-col justify-between rounded-lg border border-white/20 bg-white/90 p-3 text-foreground shadow-lg backdrop-blur"
								>
									<span className="text-primary">{highlight.icon}</span>
									<span className="text-xs font-semibold leading-tight">{highlight.label}</span>
								</div>
							))}
						</div>
					</div>

					<div className="flex flex-col justify-center border-t border-border bg-[linear-gradient(135deg,_var(--background),_var(--secondary))] p-7 sm:p-10 md:border-l md:border-t-0 md:p-14 lg:p-16">
						<div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
							<Sprout className="h-4 w-4" aria-hidden="true" />
							<span>The Exlynatural Promise</span>
						</div>

						<h2 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							{title}
						</h2>

						{description && (
							<p className="mt-5 max-w-lg text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
								{description}
							</p>
						)}

						<ul className="mt-7 grid gap-3" role="list">
							{features.map((feature) => (
								<li key={feature} className="flex items-start gap-3 text-sm text-foreground">
									<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
										<Check className="h-3 w-3" strokeWidth={3} />
									</span>
									<span className="font-medium leading-relaxed">{feature}</span>
								</li>
							))}
						</ul>

						<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
							<Link
								href="/default-channel/pages/about-us"
								className="shadow-primary/15 hover:bg-primary/95 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
							>
								Our Sourcing Story
								<ArrowRight className="h-4 w-4" aria-hidden="true" />
							</Link>
							<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Seasonal sourcing. Smaller batches. Better flavor.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
