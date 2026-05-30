"use client";

import { useState } from "react";
import { CheckCircle2, Gift, Leaf, Mail, ShieldCheck, Sparkles } from "lucide-react";

export function NewsletterCard() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

	const benefits = [
		{ icon: <Leaf className="h-4 w-4" />, label: "Seasonal recipes" },
		{ icon: <Sparkles className="h-4 w-4" />, label: "Wellness notes" },
		{ icon: <Gift className="h-4 w-4" />, label: "First-order savings" },
	];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setStatus("submitting");
		setTimeout(() => {
			setStatus("success");
			setEmail("");
		}, 1000);
	};

	return (
		<section className="w-full bg-background py-14 md:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="shadow-primary/5 grid overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
					<div className="flex min-h-72 flex-col justify-between bg-[linear-gradient(135deg,_var(--primary),_oklch(0.58_0.14_136))] p-7 text-primary-foreground sm:p-10 lg:p-12">
						<div>
							<div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/15">
								<Mail className="h-5 w-5" aria-hidden="true" />
							</div>
							<p className="text-primary-foreground/75 text-xs font-semibold uppercase tracking-wider">
								Community Newsletter
							</p>
							<h2 className="mt-3 max-w-sm text-3xl font-black leading-tight tracking-tight sm:text-4xl">
								Join our Green Community
							</h2>
						</div>

						<div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
							{benefits.map((benefit) => (
								<div
									key={benefit.label}
									className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-3 text-sm font-medium"
								>
									<span className="text-primary-foreground/90">{benefit.icon}</span>
									<span>{benefit.label}</span>
								</div>
							))}
						</div>
					</div>

					{status !== "success" ? (
						<div className="flex flex-col justify-center gap-7 p-7 sm:p-10 lg:p-12">
							<div className="max-w-xl">
								<p className="text-sm font-semibold uppercase tracking-wider text-primary">
									10% off your first pantry order
								</p>
								<p className="mt-3 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
									Subscribe for seasonal organic recipes, thoughtful wellness tips, and a{" "}
									<strong className="font-semibold text-foreground">10% welcome discount</strong>.
								</p>
							</div>

							<form onSubmit={handleSubmit} className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
								<div className="relative min-w-0 flex-1">
									<Mail
										className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
										aria-hidden="true"
									/>
									<input
										type="email"
										required
										placeholder="Enter your email address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={status === "submitting"}
										className="placeholder:text-muted-foreground/60 h-[52px] w-full rounded-xl border border-border bg-background py-4 pl-11 pr-4 text-sm text-foreground shadow-inner transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
									/>
								</div>
								<button
									type="submit"
									disabled={status === "submitting"}
									className="shadow-primary/15 hover:bg-primary/95 inline-flex h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 sm:w-auto"
								>
									{status === "submitting" ? "Subscribing..." : "Subscribe"}
								</button>
							</form>
							<p className="flex items-center gap-2 text-xs font-light text-muted-foreground">
								<ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
								We respect your privacy. Unsubscribe at any time.
							</p>
						</div>
					) : (
						<div className="flex animate-[skeleton-fade-in_0.4s_ease-out] flex-col justify-center gap-5 p-7 sm:p-10 lg:p-12">
							<div className="bg-success/15 flex h-14 w-14 items-center justify-center rounded-xl text-success">
								<CheckCircle2 className="h-7 w-7" />
							</div>
							<div className="max-w-md">
								<h3 className="text-2xl font-bold tracking-tight text-foreground">You are on the list!</h3>
								<p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
									Thank you for joining. We sent a{" "}
									<strong className="font-semibold text-foreground">10% discount code</strong> to your inbox,
									along with your first seasonal wellness guide.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
