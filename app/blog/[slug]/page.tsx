import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import MarkdownArticle from '../../components/MarkdownArticle';
import ContentShell from '../../components/ContentShell';
import { SITE_CONFIG } from '../../lib/config';
import { content } from '../../lib/translations';
import { absoluteAssetUrl, absoluteUrl } from '../../lib/seo';
import { getPostBySlug, getPostSlugs } from '../../lib/posts';

export const dynamicParams = false;

export function generateStaticParams() {
	return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return { title: content.blog.notFound.title };
	}

	const url = absoluteUrl(`/blog/${post.slug}/`);

	return {
		title: { absolute: `${post.title} | ${SITE_CONFIG.site.title}` },
		description: post.excerpt,
		alternates: {
			canonical: url,
		},
		openGraph: {
			type: 'article',
			locale: 'vi_VN',
			url,
			title: post.title,
			description: post.excerpt,
			siteName: SITE_CONFIG.site.title,
			publishedTime: post.publishedAt || undefined,
			authors: [post.authorName || SITE_CONFIG.profile.name],
			tags: post.categories,
			images: [
				{
					url: SITE_CONFIG.site.ogImage,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description: post.excerpt,
			images: [SITE_CONFIG.site.ogImage],
		},
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = getPostBySlug(slug);
	if (!post) return notFound();
	const canonicalUrl = absoluteUrl(`/blog/${post.slug}/`);
	const authorName = post.authorName || SITE_CONFIG.profile.name;
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		url: canonicalUrl,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': canonicalUrl,
		},
		image: [absoluteAssetUrl(SITE_CONFIG.site.ogImage)],
		datePublished: post.publishedAt || undefined,
		dateModified: post.publishedAt || undefined,
		inLanguage: 'vi-VN',
		keywords: post.categories,
		author: {
			'@type': 'Person',
			name: authorName,
			url: absoluteUrl('/'),
		},
		publisher: {
			'@type': 'Person',
			name: SITE_CONFIG.profile.name,
			url: absoluteUrl('/'),
		},
	};
	const metaItems = [
		post.createdAt,
		post.authorName,
		`${post.readingMinutes} ${content.blog.detail.readingTimeSuffix}`,
	].filter(Boolean);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
			/>
			<ContentShell active="blog" width="wide">
			<div className="w-full max-w-[720px] mx-auto flex flex-col gap-7 sm:gap-9">
				<header>
					<h1 className="text-[26px] sm:text-[30px] leading-[1.2] font-semibold text-heading tracking-[-0.035em] break-words">
						{post.title}
					</h1>
					<div className="post-meta mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] tracking-[0.1em] text-muted">
						{metaItems.map((item, index) => (
							<span key={`${post.slug}-meta-${item}`}>
								{index > 0 && <span className="mr-2 opacity-45">·</span>}
								{item}
							</span>
						))}
						{post.categories.length > 0 && metaItems.length > 0 && <span className="opacity-45">·</span>}
						{post.categories.map((category) => (
							<span key={category} className="tag px-2.5 py-1 text-[10px] tracking-[0.08em]">
								{category}
							</span>
						))}
					</div>
				</header>

				<article className="article-body markdown text-[14px] sm:text-[15px] leading-[1.82] text-foreground w-full">
					<MarkdownArticle content={post.content} />
				</article>
			</div>
			</ContentShell>
		</>
	);
}
