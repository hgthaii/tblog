'use client';

import Link from 'next/link';
import { useLocale } from '../../lib/LocaleContext';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../lib/config';

interface PostDetail {
	id: number;
	title: string;
	slug: string;
	content: string;
	html: string;
	createdAt: string;
	authorName: string;
	categoryName: string;
}

function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const wordCount = content.split(/\s+/).length;
	return Math.ceil(wordCount / wordsPerMinute);
}

export default function PostPage({ params }: { params: { slug: string } }) {
	const { t, locale, setLocale } = useLocale();
	const [post, setPost] = useState<PostDetail | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch(`${API_BASE_URL}/api/v1/posts/${params.slug}`)
			.then(res => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then(data => setPost(data))
			.catch(() => setError(true));
	}, [params.slug]);

	if (error) return <div className="container">Post not found.</div>;
	if (!post) return <div className="container">sys.loading...</div>;

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

					{/* Left Column: Technical Metadata */}
					<aside style={{
						position: 'sticky',
						top: '120px'
					}}>
						<Link href="/blog" style={{
							color: 'var(--text-tertiary)',
							fontSize: '0.7rem',
							textDecoration: 'none',
							textTransform: 'uppercase',
							letterSpacing: '0.2em',
							fontWeight: 500,
							display: 'block',
							marginBottom: '80px'
						}}>
							← {t('nav.writing')}
						</Link>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
							<div>
								<span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px', fontWeight: 600 }}>
									index / 01
								</span>
								<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
									{new Date(post.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toLowerCase()}
								</span>
							</div>

							<div>
								<span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px', fontWeight: 600 }}>
									category / 02
								</span>
								<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'lowercase' }}>
									{post.categoryName || 'general'}
								</span>
							</div>

							<div>
								<span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px', fontWeight: 600 }}>
									reading / 03
								</span>
								<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
									{calculateReadingTime(post.content)} {locale === 'vi' ? 'phút đọc' : 'min read'}
								</span>
							</div>
						</div>
					</aside>

					{/* Right Column: Reading Experience */}
					<article style={{ maxWidth: '680px' }}>
						<header style={{ marginBottom: '100px' }}>
							<h1 style={{
								fontSize: '4.5rem',
								fontWeight: 400,
								lineHeight: 1,
								color: 'var(--text-primary)',
								letterSpacing: '-0.07em'
							}}>
								{post.title.toLowerCase()}
							</h1>
						</header>

						<div
							className="markdown-body"
							style={{ fontWeight: 300, fontSize: '1.1rem', lineHeight: '1.9' }}
							dangerouslySetInnerHTML={{ __html: post.html }}
						/>

						<footer style={{ marginTop: '140px', borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 300, letterSpacing: '0.05em' }}>
									{locale === 'vi' ? 'hết nội dung.' : 'end of entry.'}
								</p>
								<Link
									href="/blog"
									className="nav-link"
									style={{ fontSize: '0.75rem' }}
								>
									{t('nav.back')}
								</Link>
							</div>
						</footer>
					</article>
				</div>
			</div>

			<div style={{ position: 'fixed', bottom: '60px', right: '60px' }}>
				<Link href="/blog" className="nav-link" style={{ fontSize: '0.7rem' }}>
					{t('nav.esc')}
				</Link>
			</div>
		</>
	);
}
