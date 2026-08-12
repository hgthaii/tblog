import type { Metadata } from 'next';

import { SITE_CONFIG } from './config';
import { locale } from './translations';

const isVietnamese = locale === 'vi';

export const SEO = {
	home: {
		title: SITE_CONFIG.site.title,
		description: SITE_CONFIG.site.description,
	},
	blog: {
		title: isVietnamese ? 'Bài viết' : 'Writing',
		description: isVietnamese ? 'Những bài viết, ghi chú và suy nghĩ về lập trình, công việc và cuộc sống.' : 'Articles, notes, and reflections on software, work, and everyday life.',
	},
	milestones: {
		title: isVietnamese ? 'Cột mốc' : 'Milestones',
		description: isVietnamese ? 'Những cột mốc trong hành trình học tập, làm việc và trưởng thành.' : 'Milestones from a journey through learning, work, and personal growth.',
	},
	cv: {
		title: isVietnamese ? 'Bản ghi' : 'Résumé',
		description: isVietnamese ? 'Kinh nghiệm, kỹ năng và hành trình phát triển nghề nghiệp.' : 'Experience, skills, and a continuing professional journey.',
	},
} as const;

export const absoluteUrl = (pathname = '/') => {
	const base = `${SITE_CONFIG.site.url.replace(/\/+$/, '')}/`;
	return new URL(pathname.replace(/^\/+/, ''), base).toString();
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
		locale: SITE_CONFIG.site.openGraphLocale,
		url: absoluteUrl(pathname),
		title,
		description,
		siteName: SITE_CONFIG.site.title,
		images: [
			{
				url: SITE_CONFIG.site.ogImage,
				width: 1200,
				height: 630,
				alt: SITE_CONFIG.site.title,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title,
		description,
		images: [SITE_CONFIG.site.ogImage],
	},
});
