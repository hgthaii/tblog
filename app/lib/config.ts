import en from '../../content/locales/en.json';
import vi from '../../content/locales/vi.json';
import type { SeasonalThemeMode } from './seasonal-theme';

export type LocaleCode = 'en' | 'vi';
export type LocaleContent = typeof en;

const DEFAULTS = {
	locale: 'vi' as LocaleCode,
	siteUrl: 'https://example.com',
	cvPdf: 'https://example.com/cv.pdf',
	contactEmail: 'hello@example.com',
	profileAvatar: '/hgthaii.jpg',
	profileAvatarFit: 'cover' as const,
	profileAvatarPosition: 'center',
	profileAvatarScale: 1,
	socialImage: '/og-image.png',
	githubUrl: 'https://github.com/your-username',
	instagramUrl: 'https://instagram.com/your-username',
	linkedinUrl: 'https://linkedin.com/in/your-username',
	trackingSrc: '',
	trackingWebsiteId: '',
	seasonalTheme: 'auto' as SeasonalThemeMode,
} as const;

const LOCALES: Record<LocaleCode, LocaleContent> = { en, vi };
const requestedLocale = process.env.NEXT_PUBLIC_LOCALE;
export const locale: LocaleCode = requestedLocale === 'en' || requestedLocale === 'vi'
	? requestedLocale
	: DEFAULTS.locale;
export const content = LOCALES[locale];

const profileName = content.home.name.trim();
const escapedProfileName = profileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const legacyProfilePrefix = new RegExp(
	`^${escapedProfileName}\\s*[-–—|:]\\s*`,
	'i',
);
const normalizedSiteTitle = content.site.title.replace(legacyProfilePrefix, '').trim();
const siteTitle = normalizedSiteTitle || content.site.title;

const requestedAvatarFit = process.env.NEXT_PUBLIC_PROFILE_AVATAR_FIT;
const profileAvatarFit = requestedAvatarFit === 'contain'
	? 'contain'
	: DEFAULTS.profileAvatarFit;
const profileAvatarPosition =
	process.env.NEXT_PUBLIC_PROFILE_AVATAR_POSITION || DEFAULTS.profileAvatarPosition;
const requestedAvatarScale = Number(process.env.NEXT_PUBLIC_PROFILE_AVATAR_SCALE);
const profileAvatarScale = Number.isFinite(requestedAvatarScale) && requestedAvatarScale > 0
	? Math.min(Math.max(requestedAvatarScale, 0.5), 3)
	: DEFAULTS.profileAvatarScale;
const requestedSeasonalTheme = process.env.NEXT_PUBLIC_SEASONAL_THEME;
const seasonalThemeNames: SeasonalThemeMode[] = [
	'none',
	'national-day',
	'mid-autumn',
	'christmas',
	'new-year',
	'tet',
	'children-day',
	'reunification-day',
	'spring',
	'summer',
	'autumn',
	'winter',
];
const seasonalThemeMode: SeasonalThemeMode =
	requestedSeasonalTheme && seasonalThemeNames.includes(requestedSeasonalTheme as SeasonalThemeMode)
		? requestedSeasonalTheme as SeasonalThemeMode
		: DEFAULTS.seasonalTheme;

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
	githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || DEFAULTS.githubUrl,
	instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULTS.instagramUrl,
	linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || DEFAULTS.linkedinUrl,
	trackingSrc: process.env.NEXT_PUBLIC_TRACKING_SRC || DEFAULTS.trackingSrc,
	trackingWebsiteId:
		process.env.NEXT_PUBLIC_TRACKING_WEBSITE_ID || DEFAULTS.trackingWebsiteId,
};

const withOptionalBasePath = (value: string) =>
	value.startsWith('http://') || value.startsWith('https://')
		? value
		: withBasePath(value);

export const SITE_CONFIG = {
	basePath,
	locale: {
		code: locale,
		language: locale === 'vi' ? 'vi-VN' : 'en-US',
		openGraph: locale === 'vi' ? 'vi_VN' : 'en_US',
	},
	routes: {
		home: '/',
		blog: '/blog',
		milestones: '/milestones',
		cv: '/cv',
	},
	site: {
		title: siteTitle,
		description: content.site.description,
		url: env.siteUrl,
		cvPdf: withOptionalBasePath(env.cvPdf),
		email: env.contactEmail,
		emailHref: `mailto:${env.contactEmail}`,
		socialImage: withOptionalBasePath(env.socialImage),
		favicon: withBasePath('/favicon_io/favicon.ico'),
		favicon16: withBasePath('/favicon_io/favicon-16x16.png'),
		favicon32: withBasePath('/favicon_io/favicon-32x32.png'),
		appleTouchIcon: withBasePath('/favicon_io/apple-touch-icon.png'),
		manifest: withBasePath('/favicon_io/site.webmanifest'),
	},
	profile: {
		name: profileName,
		avatar: withOptionalBasePath(env.profileAvatar),
		avatarFit: profileAvatarFit,
		avatarPosition: profileAvatarPosition,
		avatarScale: profileAvatarScale,
		github: env.githubUrl,
		instagram: env.instagramUrl,
		linkedin: env.linkedinUrl,
	},
	external: {
		schemaContext: 'https://schema.org',
	},
	analytics: {
		umami: {
			enabled: Boolean(env.trackingSrc && env.trackingWebsiteId),
			src: env.trackingSrc,
			websiteId: env.trackingWebsiteId,
		},
	},
	seasonalTheme: {
		mode: seasonalThemeMode,
	},
} as const;
