"use client";

import { useEffect, useRef, useState } from "react";

interface AutoCarouselScrollOptions {
	enabled?: boolean;
	intervalMs?: number;
	scrollRatio?: number;
}

export function useAutoCarouselScroll<T extends HTMLElement>({
	enabled = true,
	intervalMs = 3500,
	scrollRatio = 0.8,
}: AutoCarouselScrollOptions = {}) {
	const scrollRef = useRef<T>(null);
	const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

	useEffect(() => {
		if (!enabled || isAutoScrollPaused) return;

		const scrollElement = scrollRef.current;
		if (!scrollElement || scrollElement.scrollWidth <= scrollElement.clientWidth) return;

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) return;

		const intervalId = window.setInterval(() => {
			const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;
			const scrollAmount = scrollElement.clientWidth * scrollRatio;
			const nextScrollLeft = scrollElement.scrollLeft + scrollAmount;

			scrollElement.scrollTo({
				left: nextScrollLeft >= maxScrollLeft - 8 ? 0 : nextScrollLeft,
				behavior: "smooth",
			});
		}, intervalMs);

		return () => window.clearInterval(intervalId);
	}, [enabled, intervalMs, isAutoScrollPaused, scrollRatio]);

	return {
		scrollRef,
		isAutoScrollPaused,
		setIsAutoScrollPaused,
	};
}
