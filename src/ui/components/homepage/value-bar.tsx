import { Sprout, PackageCheck, Truck, ShieldCheck } from "lucide-react";

export function ValueBar() {
	const values = [
		{
			icon: <Sprout className="h-6 w-6 text-primary" />,
			title: "100% Pure & Organic",
			description: "Certified natural ingredients sourced directly from small sustainable farms.",
		},
		{
			icon: <PackageCheck className="h-6 w-6 text-primary" />,
			title: "Nutrient-Lock Pack",
			description: "Environment-friendly packaging designed to preserve freshness and nutrients.",
		},
		{
			icon: <Truck className="h-6 w-6 text-primary" />,
			title: "Free Express Shipping",
			description: "Enjoy complimentary express home delivery on all orders over ₹1,000.",
		},
		{
			icon: <ShieldCheck className="h-6 w-6 text-primary" />,
			title: "Secure & Verified Checkout",
			description: "100% encrypted checkout payments powered by industry-standard systems.",
		},
	];

	return (
		<section className="bg-card/50 w-full border-y border-border py-10 md:py-12">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
					{values.map((val, index) => (
						<div
							key={index}
							className="hover:bg-secondary/40 flex flex-col items-center gap-3.5 rounded-2xl p-4 text-center transition-all duration-300 sm:items-start sm:text-left"
						>
							{/* Icon sphere container with soft oklch primary color backdrop */}
							<div className="bg-primary/10 border-primary/5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-primary shadow-sm">
								{val.icon}
							</div>

							<div className="flex flex-col gap-1">
								<h3 className="text-base font-bold tracking-tight text-foreground">{val.title}</h3>
								<p className="text-xs font-light leading-relaxed text-muted-foreground">{val.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
