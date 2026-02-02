'use client';

import Link from 'next/link';
import { useLocale } from '../lib/LocaleContext';
import useSWR from 'swr';
import { useState } from 'react';
import { API_BASE_URL } from '../lib/config';

interface Post {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	createdAt: string;
	authorName: string;
	categoryName: string;
}

interface PostsResponse {
	content: Post[];
	totalPages: number;
	totalElements: number;
}

interface Category {
	id: number;
	name: string;
	slug: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogPage() {
	const { t, locale, setLocale } = useLocale();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(0);

	const { data: postsData, isLoading: postsLoading } = useSWR<PostsResponse>(
		`${API_BASE_URL}/api/v1/posts?page=${currentPage}&size=3&category=${selectedCategory || ''}&search=${searchQuery}`,
		fetcher
	);

	const { data: categories } = useSWR<Category[]>(`${API_BASE_URL}/api/v1/categories`, fetcher);

	return (
		<>
			{/* Top Header: Switcher */}
			<div className="header-switcher" style={{
				position: 'absolute',
				top: '60px',
				left: '12%',
				right: '12%',
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'center',
				zIndex: 100
			}}>
				<div style={{ display: 'flex', gap: '24px' }}>
					<button
						onClick={() => setLocale('en')}
						style={{
							background: 'none',
							border: 'none',
							color: locale === 'en' ? 'var(--text-primary)' : 'var(--text-tertiary)',
							fontSize: '0.65rem',
							fontWeight: locale === 'en' ? 600 : 300,
							cursor: 'pointer',
							letterSpacing: '0.15em'
						}}
					>
						EN.
					</button>
					<button
						onClick={() => setLocale('vi')}
						style={{
							background: 'none',
							border: 'none',
							color: locale === 'vi' ? 'var(--text-primary)' : 'var(--text-tertiary)',
							fontSize: '0.65rem',
							fontWeight: locale === 'vi' ? 600 : 300,
							cursor: 'pointer',
							letterSpacing: '0.15em'
						}}
					>
						VI.
					</button>
				</div>
			</div>

			<div className="container" style={{ maxWidth: '1200px', padding: '120px 12%' }}>
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)',
					gap: '120px',
					alignItems: 'start'
				}} className="main-grid">

					{/* Left Column: Navigator */}
					<header style={{ position: 'sticky', top: '100px' }}>
						<Link href="/" style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 500 }}>
							← {t('nav.index')}
						</Link>
						<h1 style={{ marginTop: '60px', fontSize: '4rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.06em' }}>
							{t('blog.title')}
						</h1>

						<nav style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
							<button
								onClick={() => { setSelectedCategory(null); setCurrentPage(0); }}
								style={{
									background: 'none',
									border: 'none',
									fontSize: '0.65rem',
									textTransform: 'uppercase',
									letterSpacing: '0.2em',
									textAlign: 'left',
									color: !selectedCategory ? 'var(--text-primary)' : 'var(--text-tertiary)',
									fontWeight: !selectedCategory ? 600 : 400,
									cursor: 'pointer',
									transition: 'color 0.3s ease'
								}}
							>
								{t('blog.all')}
							</button>
							{categories?.map((cat: Category) => (
								<button
									key={cat.id}
									onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(0); }}
									style={{
										background: 'none',
										border: 'none',
										fontSize: '0.65rem',
										textTransform: 'uppercase',
										letterSpacing: '0.2em',
										textAlign: 'left',
										color: selectedCategory === cat.slug ? 'var(--text-primary)' : 'var(--text-tertiary)',
										fontWeight: selectedCategory === cat.slug ? 600 : 400,
										cursor: 'pointer',
										transition: 'color 0.3s ease'
									}}
								>
									{cat.name.toLowerCase()}
								</button>
							))}
						</nav>

						<div style={{ marginTop: '120px' }}>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
								placeholder={t('blog.search')}
								className="search-input"
								style={{
									width: '100%',
									background: 'none',
									border: 'none',
									borderBottom: '1px solid var(--border)',
									padding: '12px 0',
									fontSize: '0.85rem',
									color: 'var(--text-primary)',
									outline: 'none',
									fontWeight: 300,
									transition: 'all 0.3s ease'
								}}
							/>
						</div>
					</header>

					{/* Right Column: Entries */}
					<section>
						{postsLoading ? (
							<p style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>sys.loading...</p>
						) : postsData?.content.length === 0 ? (
							<p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{t('blog.noEntries')}</p>
						) : (
							<>
								{postsData?.content.map((post: Post) => (
									<Link key={post.id} href={`/blog/${post.slug}`} className="blog-item">
										<h2>{post.title.toLowerCase()}</h2>

										<div className="post-meta">
											<span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{post.authorName.toLowerCase()}</span>
											<span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>/</span>
											<span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{post.categoryName.toLowerCase()}</span>
											<span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>/</span>
											<span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
												{new Date(post.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()}
											</span>
										</div>

										<div className="post-excerpt">
											{post.excerpt}
										</div>
									</Link>
								))}

								{/* Pagination Controls */}
								{postsData && postsData.totalPages > 1 && (
									<div style={{ marginTop: '80px', display: 'flex', gap: '40px', alignItems: 'center' }}>
										<button
											disabled={currentPage === 0}
											onClick={() => { setCurrentPage(prev => Math.max(0, prev - 1)); window.scrollTo(0, 0); }}
											style={{
												background: 'none',
												border: 'none',
												fontSize: '0.7rem',
												textTransform: 'uppercase',
												letterSpacing: '0.15em',
												color: currentPage === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)',
												cursor: currentPage === 0 ? 'default' : 'pointer',
												opacity: currentPage === 0 ? 0.3 : 1
											}}
										>
											← prev
										</button>
										<span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
											{currentPage + 1} / {postsData.totalPages}
										</span>
										<button
											disabled={currentPage >= postsData.totalPages - 1}
											onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0, 0); }}
											style={{
												background: 'none',
												border: 'none',
												fontSize: '0.7rem',
												textTransform: 'uppercase',
												letterSpacing: '0.15em',
												color: currentPage >= postsData.totalPages - 1 ? 'var(--text-tertiary)' : 'var(--text-primary)',
												cursor: currentPage >= postsData.totalPages - 1 ? 'default' : 'pointer',
												opacity: currentPage >= postsData.totalPages - 1 ? 0.3 : 1
											}}
										>
											next →
										</button>
									</div>
								)}
							</>
						)}
					</section>
				</div>
			</div>

			{/* Quick Escape */}
			<div style={{ position: 'fixed', bottom: '60px', right: '60px', zIndex: 100 }}>
				<Link href="/" className="nav-link" style={{ fontSize: '0.7rem' }}>
					{t('nav.esc')}
				</Link>
			</div>
		</>
	);
}
