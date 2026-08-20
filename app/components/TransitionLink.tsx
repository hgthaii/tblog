'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type TransitionDirection = 'forward' | 'backward';

type TransitionLinkProps = {
	href: string;
	className?: string;
	title?: string;
	direction?: TransitionDirection;
	onNavigate?: () => void;
	children: ReactNode;
};

export default function TransitionLink({
	href,
	className,
	title,
	direction = 'forward',
	onNavigate,
	children,
}: TransitionLinkProps) {
	return (
		<Link
			href={href}
			className={className}
			title={title}
			onNavigate={onNavigate}
			data-transition-direction={direction}
		>
			{children}
		</Link>
	);
}
