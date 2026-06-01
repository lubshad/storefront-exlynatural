"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { type ComponentProps } from "react";

export const LinkWithChannel = ({
	href,
	...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) => {
	const { channel } = useParams<{ channel?: string }>();
	const pathname = usePathname();

	if (!href.startsWith("/")) {
		return <Link {...props} href={href} />;
	}

	const pathnameChannel = pathname?.split("/").filter(Boolean)[0];
	const currentChannel = channel ?? pathnameChannel;

	if (!currentChannel) {
		return <Link {...props} href={href} />;
	}

	const encodedChannel = encodeURIComponent(currentChannel);
	const hrefWithChannel = `/${encodedChannel}${href}`;
	return <Link {...props} href={hrefWithChannel} />;
};
