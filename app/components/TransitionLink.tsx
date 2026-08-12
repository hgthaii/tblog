'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

type TransitionDirection = 'forward' | 'backward';

type TransitionLinkProps = {
	href: string;
	className?: string;
	title?: string;
	direction?: TransitionDirection;
	onNavigate?: () => void;
	children: ReactNode;
};

let transitionInProgress = false;

const isPlainLeftClick = (event: MouseEvent<HTMLAnchorElement>) =>
	event.button === 0 &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.shiftKey &&
	!event.altKey;

const normalizePathname = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

const wait = (duration: number) =>
	new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const waitForFrame = () =>
	new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const getRouteMarkerPath = () =>
	document.querySelector<HTMLElement>('[data-route-transition-path]')?.dataset.routeTransitionPath;

const waitForRouteCommit = (previousMarkerPath: string | undefined, destinationPath: string) =>
	new Promise<void>((resolve) => {
		const expectedPath = normalizePathname(destinationPath);
		const startedAt = performance.now();

		const checkCommit = () => {
			const markerPath = getRouteMarkerPath();
			const routeCommitted = markerPath !== undefined && markerPath !== previousMarkerPath;
			const browserAtDestination = normalizePathname(window.location.pathname) === expectedPath;

			if ((routeCommitted && browserAtDestination) || performance.now() - startedAt > 5000) {
				resolve();
				return;
			}

			requestAnimationFrame(checkCommit);
		};

		checkCommit();
	});

const parseCssDuration = (value: string, fallback: number) => {
	const duration = Number.parseFloat(value);
	if (!Number.isFinite(duration)) return fallback;
	return value.trim().endsWith('s') && !value.trim().endsWith('ms') ? duration * 1000 : duration;
};

const waitForPageAnimation = async (variableName: string, fallback: number) => {
	await waitForFrame();
	const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
	await wait(parseCssDuration(value, fallback) + 16);
};

const clearTransitionClasses = (root: HTMLElement) => {
	for (const className of [...root.classList]) {
		if (className.startsWith('page-transition-')) root.classList.remove(className);
	}
};

const showRouteLoading = (root: HTMLElement) => {
	root.classList.add('route-transition-loading');
	root.setAttribute('aria-busy', 'true');
};

const hideRouteLoading = (root: HTMLElement) => {
	root.classList.remove('route-transition-loading');
	root.removeAttribute('aria-busy');
};

export default function TransitionLink({
	href,
	className,
	title,
	direction = 'forward',
	onNavigate,
	children,
}: TransitionLinkProps) {
	const router = useRouter();

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (!isPlainLeftClick(event) || event.defaultPrevented) return;

		event.preventDefault();
		const destinationPath = new URL(event.currentTarget.href).pathname;

		if (normalizePathname(destinationPath) === normalizePathname(window.location.pathname)) {
			onNavigate?.();
			return;
		}

		if (transitionInProgress) return;
		transitionInProgress = true;

		const root = document.documentElement;
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const previousMarkerPath = getRouteMarkerPath();
		const navigate = () => {
			onNavigate?.();
			router.push(href);
		};

		void (async () => {
			const leaveClass = `page-transition-leave-${direction}`;
			const enterClass = `page-transition-enter-${direction}`;
			let loadingTimer: number | undefined;

			try {
				clearTransitionClasses(root);
				root.classList.add('route-transition-active');

				if (!prefersReducedMotion) {
					root.classList.add(leaveClass);
					await waitForPageAnimation('--page-leave-duration', 110);
				}

				navigate();
				loadingTimer = window.setTimeout(() => showRouteLoading(root), 180);
				await waitForRouteCommit(previousMarkerPath, destinationPath);
				window.clearTimeout(loadingTimer);
				loadingTimer = undefined;
				hideRouteLoading(root);
				await waitForFrame();

				if (!prefersReducedMotion) {
					root.classList.remove(leaveClass);
					root.classList.add(enterClass);
					await waitForPageAnimation('--page-enter-duration', 240);
				}
			} finally {
				if (loadingTimer !== undefined) window.clearTimeout(loadingTimer);
				hideRouteLoading(root);
				clearTransitionClasses(root);
				root.classList.remove('route-transition-active');
				transitionInProgress = false;
			}
		})();
	};

	return (
		<Link href={href} className={className} title={title} onClick={handleClick}>
			{children}
		</Link>
	);
}
