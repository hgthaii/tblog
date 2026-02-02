'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '../../app/lib/LocaleContext';
import { API_BASE_URL } from '../../app/lib/config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { t } = useLocale();

	const navItems = [
		{ label: t('admin.terminal'), href: '/admin' },
		{ label: t('admin.publications'), href: '/admin/posts' },
		{ label: t('admin.registry'), href: '/admin/skills' },
		{ label: t('nav.index'), href: '/' },
	];

	return (
		<div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
			{/* Sidebar */}
			<aside style={{
				width: '240px',
				borderRight: '1px solid var(--border)',
				padding: '60px 24px',
				display: 'flex',
				flexDirection: 'column',
				position: 'fixed',
				height: '100vh'
			}}>
				<div style={{ marginBottom: '60px' }}>
					<h2 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>
						{t('admin.management')}
					</h2>
					<span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 400, letterSpacing: '0.05em' }}>v1.0 stable</span>
				</div>

				<nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								style={{
									display: 'block',
									color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
									textDecoration: 'none',
									fontSize: '0.85rem',
									fontWeight: isActive ? 500 : 300,
									transition: 'color 0.2s ease'
								}}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div style={{ marginTop: 'auto' }}>
					<button
						onClick={async () => {
							await fetch(`${API_BASE_URL}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' });
							window.location.href = '/login';
						}}
						style={{
							width: '100%',
							padding: '12px 0',
							textAlign: 'left',
							background: 'transparent',
							border: 'none',
							color: 'var(--text-tertiary)',
							fontSize: '0.8rem',
							cursor: 'pointer',
							fontWeight: 300,
							textTransform: 'lowercase'
						}}
					>
						{t('admin.signOut')}
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main style={{ marginLeft: '240px', flex: 1, padding: '80px 80px' }}>
				<div style={{ maxWidth: '800px', fontWeight: 300 }}>
					{children}
				</div>
			</main>
		</div>
	);
}
