'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DockNav() {
	const pathname = usePathname();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/skills', label: 'Skills' },
		{ href: 'mailto:hgthaii@gmail.com', label: 'Contact', external: true }
	];

	return (
		<nav className="dock-nav">
			{links.map(link => {
				const isActive = link.href === '/'
					? pathname === '/'
					: pathname.startsWith(link.href);

				return link.external ? (
					<a key={link.href} href={link.href} className="dock-link">
						{link.label}
					</a>
				) : (
					<Link
						key={link.href}
						href={link.href}
						className={`dock-link ${isActive ? 'active' : ''}`}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
