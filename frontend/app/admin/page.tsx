'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_BASE_URL } from '../lib/config';

export default function AdminDashboard() {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
					credentials: 'include'
				});
				if (res.ok) {
					const data = await res.json();
					setUser(data);
				} else {
					router.push('/login');
				}
			} catch (err) {
				router.push('/login');
			} finally {
				setIsLoading(false);
			}
		};
		checkAuth();
	}, [router]);

	if (isLoading) {
		return (
			<div style={{
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'transparent',
				color: 'var(--text-secondary)',
				fontSize: '0.9rem',
				letterSpacing: '0.05em'
			}}>
				Establishing secure workspace...
			</div>
		);
	}

	if (!user) return null;

	return (
		<AdminLayout>
			<header style={{ marginBottom: '60px' }}>
				<h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
					System Overview.
				</h1>
				<p style={{ color: 'var(--text-tertiary)', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
					TERMINAL ACTIVE // USER: {user.username}
				</p>
			</header>

			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1px',
				background: 'var(--border)',
				marginBottom: '60px',
				border: '1px solid var(--border)',
				borderRadius: 'var(--radius)',
				overflow: 'hidden'
			}}>
				{[
					{ label: 'Total Posts', value: '8' },
					{ label: 'Site Views', value: '1.2k' },
					{ label: 'Active Skills', value: '15' },
				].map((stat, i) => (
					<div
						key={i}
						style={{
							padding: '24px',
							background: 'var(--bg)',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
							{stat.label}
						</div>
						<div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
					</div>
				))}
			</div>

			<section>
				<h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
					Security & Management
				</h2>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
					<Link href="/admin/posts/new" style={{ textDecoration: 'none', display: 'block', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'border-color 0.2s ease' }}>
						<div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>New Publication</div>
						<div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Draft and publish a new system entry</div>
					</Link>
					<Link href="/admin/skills" style={{ textDecoration: 'none', display: 'block', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'border-color 0.2s ease' }}>
						<div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>Skill Registry</div>
						<div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modify the technical competence database</div>
					</Link>
				</div>
			</section>
		</AdminLayout>
	);
}
