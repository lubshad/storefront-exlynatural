import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

/**
 * Dynamic OG Image Generator
 * Note: Cache Components requires Node.js runtime (Edge not supported)
 *
 * Generates branded Open Graph images for social media sharing.
 * Used for product pages when no product image is available,
 * or for custom branded sharing images.
 *
 * @example
 * /api/og?title=Product%20Name&price=€29.99
 * /api/og?title=Summer%20Collection&subtitle=New%20Arrivals
 */
export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const title = searchParams.get("title") || "Exlynatural";
	const subtitle = searchParams.get("subtitle") || "";
	const price = searchParams.get("price") || "";

	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#F7FAF4", // --background
					fontFamily: "system-ui, sans-serif",
				}}
			>
				{/* Background pattern */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage: "radial-gradient(circle at 25px 25px, #DCE9D8 2px, transparent 0)",
						backgroundSize: "50px 50px",
						opacity: 0.5,
					}}
				/>

				{/* Content container */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "60px",
						maxWidth: "80%",
						textAlign: "center",
					}}
				>
					{/* Logo/Brand */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "40px",
							fontSize: "24px",
							fontWeight: "600",
							color: "#287E45",
							letterSpacing: "0",
						}}
					>
						{/* Simple leaf icon */}
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginRight: "12px" }}>
							<path
								d="M20 3C12.5 3.4 6.5 8.2 5 15.7c4.8.7 11.1-1.8 13.4-7.6C19.1 6.4 19.6 4.7 20 3Z"
								fill="#83C94F"
							/>
							<path d="M4 21C7.5 14 12.3 9.6 18 6.4" stroke="#287E45" strokeWidth="2" strokeLinecap="round" />
						</svg>
						Exlynatural
					</div>

					{/* Title */}
					<div
						style={{
							fontSize: "64px",
							fontWeight: "700",
							color: "#287E45",
							lineHeight: 1.1,
							letterSpacing: "-0.03em",
							marginBottom: subtitle || price ? "20px" : "0",
						}}
					>
						{title}
					</div>

					{/* Subtitle */}
					{subtitle && (
						<div
							style={{
								fontSize: "28px",
								color: "#5E7864", // --muted-foreground
								marginBottom: price ? "20px" : "0",
							}}
						>
							{subtitle}
						</div>
					)}

					{/* Price */}
					{price && (
						<div
							style={{
								fontSize: "36px",
								fontWeight: "600",
								color: "#287E45",
								backgroundColor: "#FFFFFF",
								padding: "12px 32px",
								borderRadius: "8px",
								border: "2px solid #DCE9D8",
							}}
						>
							{price}
						</div>
					)}
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		},
	);
}
