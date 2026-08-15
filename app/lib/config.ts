import en from '../../content/locales/en.json';
import vi from '../../content/locales/vi.json';

export type LocaleCode = 'en' | 'vi';
export type LocaleContent = typeof en;

const DEFAULTS = {
	locale: 'en' as LocaleCode,
	siteUrl: 'https://example.com',
	cvPdf: 'https://example.com/cv.pdf',
	contactEmail: 'hello@example.com',
	profileAvatar: '/avatar.svg',
	socialImage: '/og-image.png',
	favicon: '/icon.svg',
	githubUrl: 'https://github.com/your-username',
	instagramUrl: 'https://instagram.com/your-username',
	linkedinUrl: 'https://linkedin.com/in/your-username',
	trackingSrc: '',
	trackingWebsiteId: '',
} as const;

const LOCALES: Record<LocaleCode, LocaleContent> = { en, vi };
const requestedLocale = process.env.NEXT_PUBLIC_LOCALE;
export const locale: LocaleCode = requestedLocale === 'vi' ? 'vi' : DEFAULTS.locale;
export const content = LOCALES[locale];

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = rawBasePath
	? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
	: '';

const withBasePath = (pathname: string) =>
	`${basePath}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

const env = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || DEFAULTS.siteUrl,
	cvPdf: process.env.NEXT_PUBLIC_CV_PDF || DEFAULTS.cvPdf,
	contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULTS.contactEmail,
	profileAvatar: process.env.NEXT_PUBLIC_PROFILE_AVATAR || DEFAULTS.profileAvatar,
	socialImage: process.env.NEXT_PUBLIC_SOCIAL_IMAGE || DEFAULTS.socialImage,
	favicon: process.env.NEXT_PUBLIC_FAVICON || DEFAULTS.favicon,
	githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || DEFAULTS.githubUrl,
	instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULTS.instagramUrl,
	linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || DEFAULTS.linkedinUrl,
	trackingSrc: process.env.NEXT_PUBLIC_TRACKING_SRC || DEFAULTS.trackingSrc,
	trackingWebsiteId: process.env.NEXT_PUBLIC_TRACKING_WEBSITE_ID || DEFAULTS.trackingWebsiteId,
};

const withOptionalBasePath = (value: string) =>
	value.startsWith('http://') || value.startsWith('https://')
		? value
		: withBasePath(value);

const absoluteSiteAsset = (pathname: string) =>
	new URL(
		pathname.replace(/^\/+/, ''),
		`${env.siteUrl.replace(/\/+$/, '')}/`,
	).toString();

export const SITE_CONFIG = {
	locale: {
		code: locale,
		openGraph: locale === 'vi' ? 'vi_VN' : 'en_US',
	},
	routes: {
		home: '/',
		blog: '/blog',
		milestones: '/milestones',
		cv: '/cv',
	},
	site: {
		title: content.site.title,
		description: content.site.description,
		url: env.siteUrl,
		cvPdf: withOptionalBasePath(env.cvPdf),
		email: env.contactEmail,
		emailHref: `mailto:${env.contactEmail}`,
		socialImage: withOptionalBasePath(env.socialImage),
		ogImage: absoluteSiteAsset('/og-image.png'),
		favicon: withOptionalBasePath(env.favicon),
	},
	profile: {
		name: content.home.name,
		avatar: withOptionalBasePath(env.profileAvatar),
		github: env.githubUrl,
		instagram: env.instagramUrl,
		linkedin: env.linkedinUrl,
	},
	external: {
		schemaContext: 'https://schema.org',
	},
	analytics: {
		umami: {
			src: env.trackingSrc,
			websiteId: env.trackingWebsiteId
		},
	},
} as const;
