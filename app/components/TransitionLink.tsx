'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

type TransitionLinkProps = {
	href: string;
	className?: string;
	title?: string;
	children: ReactNode;
};

type ViewTransitionDocument = Document & {
	startViewTransition?: (callback: () => void) => void;
};

const isPlainLeftClick = (event: MouseEvent<HTMLAnchorElement>) =>
	event.button === 0 &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.shiftKey &&
	!event.altKey;

export default function TransitionLink({ href, className, title, children }: TransitionLinkProps) {
	const router = useRouter();

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (!isPlainLeftClick(event)) return;
		if (event.defaultPrevented) return;

		event.preventDefault();

		const doc = document as ViewTransitionDocument;
		const navigate = () => router.push(href);

		if (doc.startViewTransition) {
			doc.startViewTransition(navigate);
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
