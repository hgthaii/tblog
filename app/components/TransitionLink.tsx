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
	animateProfile?: boolean;
	onNavigate?: () => void;
	children: ReactNode;
};

type AvatarTarget = {
	left: number;
	top: number;
	width: number;
	height: number;
	radius: number;
	viewportWidth: number;
	viewportHeight: number;
};

let rememberedHomeAvatar: AvatarTarget | null = null;

const isPlainLeftClick = (event: MouseEvent<HTMLAnchorElement>) =>
	event.button === 0 &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.shiftKey &&
	!event.altKey;

const waitForNavigationFrame = () =>
	new Promise<void>((resolve) => {
		requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
	});

const normalizePathname = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

const waitForPathname = (pathname: string) =>
	new Promise<void>((resolve) => {
		const expectedPathname = normalizePathname(pathname);
		const startedAt = performance.now();

		const checkPathname = () => {
			if (
				normalizePathname(window.location.pathname) === expectedPathname ||
				performance.now() - startedAt > 1200
			) {
				resolve();
				return;
			}

			requestAnimationFrame(checkPathname);
		};

		checkPathname();
	});

const wait = (duration: number) =>
	new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const createAvatarOverlay = () => {
	const source = document.querySelector<HTMLElement>('[data-profile-avatar]');
	if (!source) return null;

	const sourceRect = source.getBoundingClientRect();
	const overlay = source.cloneNode(true) as HTMLElement;
	overlay.removeAttribute('data-profile-avatar');
	overlay.setAttribute('aria-hidden', 'true');
	overlay.classList.add('avatar-transition-overlay');
	Object.assign(overlay.style, {
		left: `${sourceRect.left}px`,
		top: `${sourceRect.top}px`,
		width: `${sourceRect.width}px`,
		height: `${sourceRect.height}px`,
	});

	document.body.appendChild(overlay);
	source.style.visibility = 'hidden';

	return {
		overlay,
		source,
		sourceRect,
		sourceRadius: Number.parseFloat(getComputedStyle(source).borderRadius),
	};
};

const moveAvatarOverlay = (
	overlay: HTMLElement,
	sourceRect: DOMRect,
	target: AvatarTarget,
) => {
	const scale = target.width / sourceRect.width;
	overlay.style.transform = `translate3d(${target.left - sourceRect.left}px, ${target.top - sourceRect.top}px, 0) scale(${scale})`;
	if (Number.isFinite(target.radius)) {
		overlay.style.borderRadius = `${target.radius / scale}px`;
	}
};

const getAvatarTarget = (element: HTMLElement): AvatarTarget => {
	const rect = element.getBoundingClientRect();

	return {
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height,
		radius: Number.parseFloat(getComputedStyle(element).borderRadius),
		viewportWidth: window.innerWidth,
		viewportHeight: window.innerHeight,
	};
};

const getMenuAvatarTarget = (): AvatarTarget => {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	let profileInset: number;

	if (viewportWidth >= 1024) {
		profileInset = Math.max(40, (viewportWidth - 1360) / 2 + 40);
	} else if (viewportWidth >= 768) {
		profileInset = 40;
	} else if (viewportWidth >= 640) {
		profileInset = 24;
	} else {
		profileInset = 16;
	}

	return {
		left: profileInset + 6,
		top: profileInset + 6,
		width: 36,
		height: 36,
		radius: 12,
		viewportWidth,
		viewportHeight,
	};
};

const isSameTarget = (first: AvatarTarget, second: AvatarTarget) =>
	Math.abs(first.left - second.left) < 1 &&
	Math.abs(first.top - second.top) < 1 &&
	Math.abs(first.width - second.width) < 1 &&
	Math.abs(first.height - second.height) < 1;

export default function TransitionLink({
	href,
	className,
	title,
	direction = 'forward',
	animateProfile = true,
	onNavigate,
	children,
}: TransitionLinkProps) {
	const router = useRouter();

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (!isPlainLeftClick(event)) return;
		if (event.defaultPrevented) return;

		event.preventDefault();
		const destinationPath = new URL(event.currentTarget.href).pathname;
		if (normalizePathname(destinationPath) === normalizePathname(window.location.pathname)) {
			onNavigate?.();
			return;
		}

		const root = document.documentElement;
		const navigate = () => {
			onNavigate?.();
			router.push(href);
		};
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!prefersReducedMotion) {
			const leaveClass = `page-transition-leave-${direction}`;
			const enterClass = `page-transition-enter-${direction}`;
			const avatarOverlay = animateProfile ? createAvatarOverlay() : null;
			let anticipatedTarget: AvatarTarget | null = null;

			if (avatarOverlay) {
				if (direction === 'forward' && avatarOverlay.sourceRect.width > 50) {
					rememberedHomeAvatar = {
						...getAvatarTarget(avatarOverlay.source),
						radius: avatarOverlay.sourceRadius,
					};
					anticipatedTarget = getMenuAvatarTarget();
				} else if (
					direction === 'backward' &&
					rememberedHomeAvatar?.viewportWidth === window.innerWidth &&
					rememberedHomeAvatar.viewportHeight === window.innerHeight
				) {
					anticipatedTarget = rememberedHomeAvatar;
				}

				const initialTarget = anticipatedTarget;
				if (initialTarget) {
					requestAnimationFrame(() => {
						moveAvatarOverlay(avatarOverlay.overlay, avatarOverlay.sourceRect, initialTarget);
					});
				}
			}

			root.classList.add(leaveClass);

			void (async () => {
				await wait(80);
				navigate();
				await waitForPathname(destinationPath);

				let destinationAvatar = document.querySelector<HTMLElement>('[data-profile-avatar]');
				if (!destinationAvatar) {
					await waitForNavigationFrame();
					destinationAvatar = document.querySelector<HTMLElement>('[data-profile-avatar]');
				}

				if (avatarOverlay && destinationAvatar) {
					destinationAvatar.style.visibility = 'hidden';
				}

				root.classList.remove(leaveClass);

				if (avatarOverlay && destinationAvatar) {
					const actualTarget = getAvatarTarget(destinationAvatar);
					if (!anticipatedTarget || !isSameTarget(anticipatedTarget, actualTarget)) {
						moveAvatarOverlay(avatarOverlay.overlay, avatarOverlay.sourceRect, actualTarget);
					}
				}

				root.classList.add(enterClass);
				await waitForNavigationFrame();

				if (avatarOverlay && destinationAvatar) {
					await wait(320);
					destinationAvatar.style.opacity = '0';
					destinationAvatar.style.visibility = '';
					destinationAvatar.classList.add('avatar-transition-target');
					await waitForNavigationFrame();
					destinationAvatar.style.opacity = '1';
					avatarOverlay.overlay.style.opacity = '0';
					await wait(100);
					destinationAvatar.classList.remove('avatar-transition-target');
					destinationAvatar.style.opacity = '';
					avatarOverlay.overlay.remove();
				} else {
					avatarOverlay?.overlay.remove();
					if (avatarOverlay?.source.isConnected) {
						avatarOverlay.source.style.visibility = '';
					}
					await wait(300);
				}

				root.classList.remove(enterClass);
			})();
			return;
		}

		navigate();
	};

	return (
		<Link href={href} className={className} title={title} onClick={handleClick}>
			{children}
		</Link>
	);
}
