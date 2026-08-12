'use client';

import { usePathname } from 'next/navigation';

export default function RouteTransitionMarker() {
	const pathname = usePathname();

	return <span hidden data-route-transition-path={pathname} aria-hidden="true" />;
}
