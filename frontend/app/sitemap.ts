import { MetadataRoute } from 'next';
import { API_BASE_URL, SITE_URL } from './lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = SITE_URL; // Use your actual domain here

	// Fetch posts to include in sitemap
	let posts: any[] = [];
	try {
		const res = await fetch(`${API_BASE_URL}/api/v1/posts?size=100`);
		if (res.ok) {
			const data = await res.json();
			posts = data.content;
		}
	} catch (e) {
		console.error('Sitemap fetch error:', e);
	}

	const postUrls = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: new Date(post.updatedAt || post.createdAt),
	}));

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
		},
		{
			url: `${baseUrl}/skills`,
			lastModified: new Date(),
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
		},
		...postUrls,
	];
}
