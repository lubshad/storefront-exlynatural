import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { WavePattern } from "./wave-pattern";

interface BreadcrumbItem {
	label: string;
	href: string;
}

export interface ResponsiveHeroImages {
	desktop?: string | null;
	desktopRetina?: string | null;
	mobile?: string | null;
	mobileRetina?: string | null;
}

interface CategoryHeroProps {
	title: string;
	description?: string | null;
	backgroundImage?: string | null;
	responsiveImages?: ResponsiveHeroImages;
	breadcrumbs: BreadcrumbItem[];
	showContent?: boolean;
}

export function CategoryHero({
	title,
	description,
	backgroundImage,
	responsiveImages,
	breadcrumbs,
	showContent = true,
}: CategoryHeroProps) {
	const hasImage = !!backgroundImage;
	const { desktop, desktopRetina, mobile, mobileRetina } = responsiveImages ?? {};
	const hasResponsiveImages = !!(desktop || desktopRetina || mobile || mobileRetina);

	return (
		<section className="relative h-[340px] overflow-hidden border-b border-border">
			{/* Background */}
			<div className="absolute inset-0">
				{hasImage ? (
					<>
						{hasResponsiveImages ? (
							<picture>
								{/* Mobile retina: phones at 2x DPI */}
								{mobileRetina && (
									<source media="(max-width: 767px) and (min-resolution: 2dppx)" srcSet={mobileRetina} />
								)}
								{/* Mobile 1x */}
								{mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
								{/* Desktop retina: 768px+ at 2x DPI */}
								{desktopRetina && (
									<source media="(min-width: 768px) and (min-resolution: 2dppx)" srcSet={desktopRetina} />
								)}
								{/* Desktop 1x */}
								{desktop && <source media="(min-width: 768px)" srcSet={desktop} />}
								{/* Fallback */}
								<img src={backgroundImage} alt={title} className="h-full w-full object-cover" />
							</picture>
						) : (
							<>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={backgroundImage} alt={title} className="h-full w-full object-cover" />
							</>
						)}
						<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,24,14,0.88)_0%,rgba(10,24,14,0.76)_34%,rgba(10,24,14,0.34)_62%,rgba(10,24,14,0.08)_100%)]" />
					</>
				) : (
					<WavePattern className="h-full w-full" />
				)}
			</div>

			{showContent && (
				<div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
					<nav
						className={`mb-4 flex items-center gap-1.5 text-sm ${
							hasImage ? "text-white/75" : "text-muted-foreground"
						} ${hasImage ? "[text-shadow:_0_1px_3px_rgb(0_0_0_/_0.45)]" : ""}`}
					>
						{breadcrumbs.map((crumb, index) => (
							<span key={crumb.href} className="flex items-center gap-1.5">
								{index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
								{index === breadcrumbs.length - 1 ? (
									<span className={`font-medium ${hasImage ? "text-white" : "text-foreground"}`}>
										{crumb.label}
									</span>
								) : (
									<Link
										href={crumb.href}
										className={`transition-colors ${hasImage ? "hover:text-white" : "hover:text-foreground"}`}
									>
										{crumb.label}
									</Link>
								)}
							</span>
						))}
					</nav>

					<h1
						className={`text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl ${
							hasImage ? "text-white" : "text-foreground"
						} ${hasImage ? "[text-shadow:_0_2px_8px_rgb(0_0_0_/_0.55)]" : ""}`}
					>
						{title}
					</h1>
					{description && (
						<p
							className={`mt-3 max-w-lg text-base md:text-lg ${
								hasImage ? "text-white/90" : "text-muted-foreground"
							} ${hasImage ? "[text-shadow:_0_1px_5px_rgb(0_0_0_/_0.50)]" : ""}`}
						>
							{description}
						</p>
					)}
				</div>
			)}
		</section>
	);
}
