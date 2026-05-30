import { Ban, Compass, Sprout } from "lucide-react";

export function PhilosophyPanel() {
	const pillars = [
		{
			icon: <Sprout className="h-5 w-5" />,
			stat: "100%",
			label: "Direct Sourced",
			desc: "We buy directly from local independent farmers, ensuring fair wages and ethical partnerships.",
		},
		{
			icon: <Ban className="h-5 w-5" />,
			stat: "Zero",
			label: "Chemicals",
			desc: "Absolutely no synthetic additives, artificial colorings, pesticide residues, or chemical preservatives.",
		},
		{
			icon: <Compass className="h-5 w-5" />,
			stat: "Pure",
			label: "Traceability",
			desc: "Every single ingredient is fully traceable from the package back to the specific organic farm soil origin.",
		},
	];

	return (
		<section className="bg-secondary/10 relative w-full overflow-hidden border-t border-border py-16 md:py-20">
			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
					{/* Left Side: Testimonial & Editorial Statement */}
					<div className="flex flex-col gap-5 lg:col-span-7">
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
							<Sprout className="h-4 w-4" aria-hidden="true" />
							<span>Sourcing Philosophy</span>
						</div>

						<div>
							<blockquote className="max-w-3xl text-3xl font-black leading-[1.12] tracking-tight text-foreground drop-shadow-sm sm:text-4xl md:text-5xl">
								Wellness is not a trend — it is a return to the pure, organic simplicity of the earth.
							</blockquote>
						</div>

						{/* Hidden on Mobile & Tablet to prevent text clutter above the fold */}
						<p className="mt-1 hidden max-w-2xl text-sm font-light leading-relaxed text-muted-foreground sm:text-base md:block">
							We believe that the closest distance between nature and wellness is a straight line. By
							partnering with small-scale independent farms, we ensure every grain, spice, and leaf is
							cultivated with respect for the earth and delivered with its natural potency fully preserved.
						</p>
					</div>

					{/* Right Side: Sourcing Statistics/Pillars */}
					<div className="flex flex-col gap-5 border-t border-border pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
						{pillars.map((p, index) => (
							<div
								key={index}
								className="border-border/80 bg-card/70 group relative flex items-start gap-4 rounded-lg border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-card hover:shadow-md sm:gap-5 sm:p-6"
							>
								{/* Icon Sphere */}
								<div className="border-primary/5 bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-primary transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
									{p.icon}
								</div>

								{/* Stat Info */}
								<div className="flex flex-col gap-1.5">
									<div className="flex items-baseline gap-2">
										<span className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
											{p.stat}
										</span>
										<span className="text-xs font-bold uppercase tracking-wider text-primary">{p.label}</span>
									</div>
									{/* Description hidden on Mobile for super clean graphical layout */}
									<p className="hidden text-xs font-light leading-relaxed text-muted-foreground sm:block sm:text-sm">
										{p.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
