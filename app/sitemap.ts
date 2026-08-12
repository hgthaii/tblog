import type { MetadataRoute } from 'next';

import { getAllPosts } from './lib/posts';
import { absoluteUrl } from './lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
	const pages: MetadataRoute.Sitemap = [
		{ url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
		{ url: absoluteUrl('/blog/'), changeFrequency: 'weekly', priority: 0.9 },
		{ url: absoluteUrl('/milestones/'), changeFrequency: 'monthly', priority: 0.7 },
		{ url: absoluteUrl('/cv/'), changeFrequency: 'monthly', priority: 0.7 },
	];

	const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
		url: absoluteUrl(`/blog/${post.slug}/`),
		lastModified: post.publishedAt || undefined,
		changeFrequency: 'monthly',
		priority: 0.8,
	}));

	return [...pages, ...posts];
}
