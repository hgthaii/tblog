'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_BASE_URL } from '../../lib/config';

export default function AnalyticsPage() {
	const [popularPosts, setPopularPosts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPopularPosts = async () => {
			try {
				// We'll use the existing API but sort by views descending
				// I need to ensure the backend supports sort=views,desc
				const res = await fetch(`${API_BASE_URL}/api/v1/posts?size=5&sort=views,desc`, {
					credentials: 'include'
				});
				if (res.ok) {
					const data = await res.json();
					setPopularPosts(data.content);
				}
			} catch (err) {
				console.error('Failed to fetch analytics:', err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchPopularPosts();
	}, []);

	return (
		<AdminLayout>
			<header style={{ marginBottom: '40px' }}>
				<h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Analytics</h1>
				<p style={{ color: 'var(--text-secondary)' }}>Track your blog's performance and reader engagement.</p>
			</header>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
				{/* Popular Posts */}
				<div style={{
					background: 'var(--bg-card)',
					borderRadius: 'var(--radius-md)',
					border: '1px solid var(--border)',
					padding: '32px'
				}}>
					<h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Most Popular Articles</h2>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						{isLoading ? (
							<p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
						) : popularPosts.length === 0 ? (
							<p style={{ color: 'var(--text-secondary)' }}>No data available yet.</p>
						) : popularPosts.map((post, index) => (
							<div key={post.id} style={{
								display: 'flex',
								alignItems: 'center',
								gap: '20px',
								paddingBottom: '20px',
								borderBottom: index === popularPosts.length - 1 ? 'none' : '1px solid var(--border)'
							}}>
								<div style={{
									width: '32px',
									height: '32px',
									background: 'rgba(255, 255, 255, 0.05)',
									borderRadius: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '0.85rem',
									fontWeight: 600,
									color: 'var(--accent-blue)'
								}}>
									{index + 1}
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontWeight: 600, marginBottom: '4px' }}>{post.title}</div>
									<div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{post.categoryName}</div>
								</div>
								<div style={{ textAlign: 'right' }}>
									<div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{post.views || 0}</div>
									<div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Views</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Traffic Mockup */}
				<div style={{
					background: 'var(--bg-card)',
					borderRadius: 'var(--radius-md)',
					border: '1px solid var(--border)',
					padding: '32px',
					opacity: 0.8
				}}>
					<h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Traffic Overview (Last 30 Days)</h2>
					<div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
						{Array.from({ length: 15 }).map((_, i) => (
							<div key={i} style={{
								flex: 1,
								height: `${Math.random() * 80 + 20}%`,
								background: 'var(--accent-blue)',
								opacity: 0.3 + (i / 15) * 0.7,
								borderRadius: '4px 4px 0 0'
							}} />
						))}
					</div>
					<div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
						Integration with real traffic metrics coming soon.
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
