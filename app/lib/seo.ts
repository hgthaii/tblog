import type { Metadata } from 'next';

import { content, SITE_CONFIG } from './config';

export const SEO = {
	home: {
		title: `${SITE_CONFIG.profile.name} - ${SITE_CONFIG.site.title}`,
		description: SITE_CONFIG.site.description,
	},
	blog: {
		title: content.labels.writing,
		description: content.seo.blog.description,
	},
	milestones: {
		title: content.labels.milestones,
		description: content.seo.milestones.description,
	},
	cv: {
		title: content.labels.cv,
		description: content.seo.cv.description,
	},
} as const;

export const absoluteUrl = (pathname = '/') => {
	const base = `${SITE_CONFIG.site.url.replace(/\/+$/, '')}/`;
	return new URL(pathname.replace(/^\/+/, ''), base).toString();
};

export const openGraphImageUrl = (pathname = '/') => {
	const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');
	return absoluteUrl(`${normalizedPath}/opengraph-image`);
};

export const absoluteAssetUrl = (assetPath: string) => {
	if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;
	return new URL(assetPath, SITE_CONFIG.site.url).toString();
};

export const createPageMetadata = (
	title: string,
	description: string,
	pathname: string,
): Metadata => ({
	title,
	description,
	alternates: {
		canonical: absoluteUrl(pathname),
	},
	openGraph: {
		type: 'website',
		locale: SITE_CONFIG.locale.openGraph,
		url: absoluteUrl(pathname),
		title,
		description,
		siteName: SITE_CONFIG.site.title,
		images: [
			{
				url: openGraphImageUrl(pathname),
				width: 1200,
				height: 630,
				alt: title,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title,
		description,
		images: [openGraphImageUrl(pathname)],
	},
});
