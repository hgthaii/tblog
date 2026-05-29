'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useLocale } from '../lib/LocaleContext';
import ContentShell from '../components/ContentShell';

type Post = {
	slug: string;
	title: string;
	excerpt: string;
	createdAt: string;
	authorName: string;
	category: string;
};

export default function BlogClient({ posts }: { posts: Post[] }) {
	const { t } = useLocale();

	const [query, setQuery] = useState('');

	const filteredPosts = useMemo(() => {
		if (!query.trim()) return posts;

		const q = query.toLowerCase();

		return posts.filter(
			(p) =>
				p.title.toLowerCase().includes(q) ||
				p.excerpt.toLowerCase().includes(q),
		);
	}, [posts, query]);

	return (
		<ContentShell active="blog">
			<div className="w-full flex flex-col gap-6 sm:gap-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6 sm:pb-7">
					<div className="flex flex-col gap-1 md:flex-1">
						<h1 className="text-[2rem] leading-none md:text-4xl font-bold text-heading tracking-tight">{t('blog.listTitle')}</h1>
						<p className="text-[13px] sm:text-sm text-foreground opacity-80">{t('blog.subtitle')}</p>
					</div>

					{/* Search */}
					<div className="w-full md:w-auto md:ml-auto flex items-center gap-2">
						<Search size={16} className="text-foreground/70 shrink-0" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={t('blog.search')}
							title={t('blog.search')}
							className="w-full md:w-80 px-0 py-2 bg-transparent border-0 text-sm text-heading placeholder:text-foreground/60 focus:outline-none border-b border-[rgba(255,255,255,0.06)]"
						/>
					</div>
				</div>

				{/* Posts */}
				{filteredPosts.length === 0 && (
					<div className="text-center py-10 text-sm text-foreground opacity-60">
						{t('blog.noEntries')}
					</div>
				)}

				{filteredPosts.length > 0 && (
					<div className="flex flex-col gap-3 sm:gap-4">
						{filteredPosts.map((post) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}`}
								title={post.title}
								className="glass-card group px-4 sm:px-5 py-4 sm:py-5 rounded-2xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200"
							>
									<div className="min-w-0 pr-4">
										<h2 title={post.title} className="text-[24px] leading-tight sm:text-2xl font-semibold text-heading tracking-tight break-words lowercase">{post.title}</h2>
										<p className="text-xs text-foreground opacity-60 mt-2">{post.createdAt}</p>
										<p title={post.excerpt} className="text-[13px] sm:text-sm text-foreground opacity-80 mt-2 leading-relaxed break-words">
											{post.excerpt}
									</p>
								</div>

								<ArrowUpRight
									size={16}
									className="mt-1 text-foreground opacity-0 group-hover:opacity-60 group-hover:translate-x-1 transition-all flex-shrink-0"
								/>
							</Link>
						))}
						</div>
					)}
			</div>
		</ContentShell>
	);
}
