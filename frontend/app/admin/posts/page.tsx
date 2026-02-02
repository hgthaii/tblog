'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_BASE_URL } from '../../lib/config';

export default function AdminPostList() {
	const [posts, setPosts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const fetchPosts = async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/api/v1/posts?size=50`, {
				credentials: 'include'
			});
			if (res.ok) {
				const data = await res.json();
				setPosts(data.content);
			} else if (res.status === 401) {
				router.push('/login');
			}
		} catch (err) {
			console.error('Failed to fetch posts:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this post?')) return;

		try {
			const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (res.ok) {
				fetchPosts();
			} else {
				alert('Failed to delete post');
			}
		} catch (err) {
			alert('Error deleting post');
		}
	};

	return (
		<AdminLayout>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
				<div>
					<h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>Articles</h1>
					<p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Comprehensive database of all system publications.</p>
				</div>
				<Link
					href="/admin/posts/new"
					className="bento-card"
					style={{
						padding: '12px 24px',
						fontWeight: 600,
						fontSize: '0.85rem'
					}}
				>
					New Article
				</Link>
			</div>

			<div style={{
				borderTop: '1px solid var(--border)',
				marginTop: '40px'
			}}>
				<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
					<thead>
						<tr>
							<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Publication</th>
							<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Registry</th>
							<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Timestamp</th>
							<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Management</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr><td colSpan={4} style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Initializing database...</td></tr>
						) : posts.length === 0 ? (
							<tr><td colSpan={4} style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No records found.</td></tr>
						) : posts.map((post) => (
							<tr key={post.id} style={{ borderTop: '1px solid var(--border)' }}>
								<td style={{ padding: '20px 0' }}>
									<div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{post.title}</div>
									<div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{post.slug}</div>
								</td>
								<td style={{ padding: '20px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
									{post.categoryName || 'General'}
								</td>
								<td style={{ padding: '20px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
									{new Date(post.createdAt).toLocaleDateString()}
								</td>
								<td style={{ padding: '20px 0', textAlign: 'right' }}>
									<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
										<Link
											href={`/admin/posts/${post.id}/edit`}
											style={{ color: 'var(--text-primary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}
										>
											Edit
										</Link>
										<button
											onClick={() => handleDelete(post.id)}
											style={{
												background: 'none',
												border: 'none',
												color: 'rgba(239, 68, 68, 0.6)',
												fontSize: '0.8rem',
												cursor: 'pointer',
												padding: 0,
												fontWeight: 600
											}}
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</AdminLayout>
	);
}
