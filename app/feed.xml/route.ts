import { content, SITE_CONFIG } from '../lib/config';
import { getAllPosts } from '../lib/posts';
import { absoluteUrl } from '../lib/seo';

export const dynamic = 'force-static';

const escapeXml = (value: string) => value
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&apos;');

export function GET() {
	const feedUrl = absoluteUrl('/feed.xml');
	const items = getAllPosts().map((post) => {
		const url = absoluteUrl(`/blog/${post.slug}/`);
		const publishedAt = new Date(`${post.publishedAt}T00:00:00+07:00`).toUTCString();
		return [
			'<item>',
			`<title>${escapeXml(post.title)}</title>`,
			`<link>${escapeXml(url)}</link>`,
			`<guid isPermaLink="true">${escapeXml(url)}</guid>`,
			`<pubDate>${publishedAt}</pubDate>`,
			`<description>${escapeXml(post.excerpt)}</description>`,
			...post.categories.map((category) => `<category>${escapeXml(category)}</category>`),
			'</item>',
		].join('');
	}).join('');

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
		'<channel>',
		`<title>${escapeXml(SITE_CONFIG.site.title)}</title>`,
		`<link>${escapeXml(absoluteUrl('/'))}</link>`,
		`<description>${escapeXml(content.site.description)}</description>`,
		`<language>${SITE_CONFIG.locale.language}</language>`,
		`<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
		items,
		'</channel>',
		'</rss>',
	].join('');

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
		},
	});
}
