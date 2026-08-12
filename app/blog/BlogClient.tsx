'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useLocale } from '../lib/LocaleContext';
import ContentShell from '../components/ContentShell';
import TransitionLink from '../components/TransitionLink';
import { SITE_CONFIG } from '../lib/config';
import { content } from '../lib/config';

const POSTS_PER_PAGE = 5;

type Post = {
	slug: string;
	title: string;
	excerpt: string;
	createdAt: string;
	authorName: string;
	categories: string[];
	readingMinutes: number;
};

export default function BlogClient({ posts }: { posts: Post[] }) {
	const { t } = useLocale();

	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);

	const filteredPosts = useMemo(() => {
		if (!query.trim()) return posts;

		const q = query.toLowerCase();

		return posts.filter(
			(p) =>
				p.title.toLowerCase().includes(q) ||
				p.excerpt.toLowerCase().includes(q),
		);
	}, [posts, query]);
	const pageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
	const currentPage = Math.min(page, pageCount);
	const visiblePosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
	const hasPagination = filteredPosts.length > POSTS_PER_PAGE;

	const updateQuery = (value: string) => {
		setQuery(value);
		setPage(1);
	};

	const getMetaItems = (post: Post) =>
		[
			post.createdAt,
			post.authorName,
			`${post.readingMinutes} ${content.blog.detail.readingTimeSuffix}`,
		].filter(Boolean);

	return (
		<ContentShell active="blog">
			<div className="w-full max-w-[720px] mx-auto flex flex-col gap-7 sm:gap-9">
				<h1 className="sr-only">{t('nav.writing')}</h1>
				<label className="blog-search w-full md:w-auto md:ml-auto flex items-center gap-2.5">
						<Search size={15} className="text-muted shrink-0" />
						<input
							value={query}
							onChange={(e) => updateQuery(e.target.value)}
							placeholder={t('blog.search')}
							title={t('blog.search')}
							className="w-full md:w-64 px-0 py-1.5 bg-transparent border-0 text-[13px] text-heading placeholder:text-muted focus:outline-none"
						/>
				</label>

				{filteredPosts.length === 0 && (
					<div className="text-center py-10 text-sm text-foreground opacity-60">
						{t('blog.noEntries')}
					</div>
				)}

				{filteredPosts.length > 0 && (
					<>
						<div>
							{visiblePosts.map((post, index) => (
								<article key={post.slug}>
									<TransitionLink
										href={`${SITE_CONFIG.routes.blog}/${post.slug}`}
										direction="forward"
										title={post.title}
										className="blog-list-link group relative block py-4 sm:py-5 pr-8"
									>
										<h2 title={post.title} className="card-title break-words">{post.title}</h2>
										<p className="post-meta mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] tracking-[0.1em] text-muted">
											{getMetaItems(post).map((item, index) => (
												<span key={`${post.slug}-meta-${item}`}>
													{index > 0 && <span className="mr-2 opacity-45">·</span>}
													{item}
												</span>
											))}
											{post.categories.length > 0 && getMetaItems(post).length > 0 && <span className="opacity-45">·</span>}
											{post.categories.length > 0 && (
												<>
												{post.categories.map((category) => (
													<span key={category} className="tag px-2 py-[0.28rem] text-[10px] tracking-[0.08em]">
														{category}
													</span>
												))}
												</>
											)}
										</p>
										<p title={post.excerpt} className="blog-list-excerpt mt-2.5 text-[13px] sm:text-sm text-foreground leading-[1.7] max-w-[680px]">
											{post.excerpt}
										</p>
										<ArrowUpRight
											size={17}
											className="absolute top-5 right-0 text-foreground opacity-45 sm:opacity-0 group-hover:opacity-60 transition-all"
										/>
									</TransitionLink>
									{index < visiblePosts.length - 1 && <hr className="blog-list-rule" />}
								</article>
							))}
						</div>

						{hasPagination && (
							<nav className="blog-pagination" aria-label={content.accessibility.pagination}>
								<button
									type="button"
									onClick={() => setPage((current) => Math.max(1, current - 1))}
									disabled={currentPage === 1}
									className="blog-pagination-button"
								>
									{t('blog.pagination.previous')}
								</button>
								<span className="text-[11px] text-muted">
									{t('blog.pagination.page')} {currentPage} / {pageCount}
								</span>
								<button
									type="button"
									onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
									disabled={currentPage === pageCount}
									className="blog-pagination-button"
								>
									{t('blog.pagination.next')}
								</button>
							</nav>
						)}
					</>
				)}
			</div>
		</ContentShell>
	);
}
