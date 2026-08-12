import { content, locale, openGraphLocale } from './translations';

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = rawBasePath
	? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
	: '';

const withBasePath = (pathname: string) =>
	`${basePath}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

const env = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
	cvPdf: process.env.NEXT_PUBLIC_CV_PDF || 'https://example.com/cv.pdf',
	contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com',
	profileAvatar: process.env.NEXT_PUBLIC_PROFILE_AVATAR || '/avatar.svg',
	socialImage: process.env.NEXT_PUBLIC_SOCIAL_IMAGE || '/og-image.png',
	favicon: process.env.NEXT_PUBLIC_FAVICON || '/icon.svg',
	githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/your-username',
	instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/your-username',
	linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/your-username',
};

const withOptionalBasePath = (value: string) =>
	value.startsWith('http://') || value.startsWith('https://')
		? value
		: withBasePath(value);

const profileName = content.home.name;

export const SITE_CONFIG = {
	routes: {
		home: '/',
		blog: '/blog',
		milestones: '/milestones',
		cv: '/cv',
	},
	site: {
		title: content.site.title,
		description: content.site.description,
		locale,
		openGraphLocale,
		url: env.siteUrl,
		cvPdf: withOptionalBasePath(env.cvPdf),
		email: env.contactEmail,
		emailHref: `mailto:${env.contactEmail}`,
		socialImage: withOptionalBasePath(env.socialImage),
		ogImage: withBasePath('/og-image.png'),
		favicon: withOptionalBasePath(env.favicon),
	},
	profile: {
		name: profileName,
		avatar: withOptionalBasePath(env.profileAvatar),
		github: env.githubUrl,
		instagram: env.instagramUrl,
		linkedin: env.linkedinUrl,
	},
} as const;
