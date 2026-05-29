import { notFound } from 'next/navigation';

import ContentShell from '../../components/ContentShell';
import { getPostBySlug, getPostSlugs } from '../../lib/posts';
import { renderMarkdownToHtml } from '../../lib/markdown';

export const dynamicParams = false;

export function generateStaticParams() {
	return getPostSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = getPostBySlug(slug);
	if (!post) return notFound();

	const html = await renderMarkdownToHtml(post.content);

	return (
		<ContentShell active="blog">
			<div className="w-full max-w-[800px] flex flex-col gap-6 sm:gap-8">
				<header className="flex flex-col gap-3 pb-5 sm:pb-6 border-b border-[rgba(255,255,255,0.06)]">
					<h1 className="text-[2rem] leading-tight md:text-4xl font-bold text-heading tracking-tight break-words lowercase">{post.title}.</h1>
					<div className="flex flex-wrap items-center gap-3 text-xs text-foreground opacity-70">
						<span>{post.authorName}</span>
						<span>•</span>
						<span>{post.createdAt}</span>
						<span>•</span>
						<span className="inline-flex w-fit text-[11px] px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] text-foreground opacity-80 lowercase">
							#{post.category}
						</span>
					</div>
					{post.excerpt && <p className="text-[13px] sm:text-sm text-foreground opacity-80 leading-relaxed">{post.excerpt}</p>}
				</header>

				<article
					className="markdown text-[14px] sm:text-[15px] leading-[1.78] text-foreground max-w-[650px]"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</ContentShell>
	);
}
