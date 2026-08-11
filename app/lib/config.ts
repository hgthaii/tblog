import vi from '../../content/locales/vi.json';

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = rawBasePath
	? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
	: '';

const withBasePath = (pathname: string) =>
	`${basePath}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

const requiredEnv = (name: string, value: string | undefined) => {
	if (!value) {
		throw new Error(`${name} is required. Copy .env.example to .env.local and update it.`);
	}

	return value;
};

const env = {
	siteUrl: requiredEnv('NEXT_PUBLIC_SITE_URL', process.env.NEXT_PUBLIC_SITE_URL),
	cvPdf: requiredEnv('NEXT_PUBLIC_CV_PDF', process.env.NEXT_PUBLIC_CV_PDF),
	contactEmail: requiredEnv('NEXT_PUBLIC_CONTACT_EMAIL', process.env.NEXT_PUBLIC_CONTACT_EMAIL),
	profileAvatar: requiredEnv('NEXT_PUBLIC_PROFILE_AVATAR', process.env.NEXT_PUBLIC_PROFILE_AVATAR),
	socialImage: requiredEnv('NEXT_PUBLIC_SOCIAL_IMAGE', process.env.NEXT_PUBLIC_SOCIAL_IMAGE),
	favicon: requiredEnv('NEXT_PUBLIC_FAVICON', process.env.NEXT_PUBLIC_FAVICON),
	githubUrl: requiredEnv('NEXT_PUBLIC_GITHUB_URL', process.env.NEXT_PUBLIC_GITHUB_URL),
	instagramUrl: requiredEnv('NEXT_PUBLIC_INSTAGRAM_URL', process.env.NEXT_PUBLIC_INSTAGRAM_URL),
	linkedinUrl: requiredEnv('NEXT_PUBLIC_LINKEDIN_URL', process.env.NEXT_PUBLIC_LINKEDIN_URL),
};

const withOptionalBasePath = (value: string) =>
	value.startsWith('http://') || value.startsWith('https://')
		? value
		: withBasePath(value);

const profileName = vi.home.name;

export const SITE_CONFIG = {
	routes: {
		home: '/',
		blog: '/blog',
		milestones: '/milestones',
		cv: '/cv',
	},
	site: {
		title: vi.site.title,
		description: vi.site.description,
		url: env.siteUrl,
		cvPdf: withOptionalBasePath(env.cvPdf),
		email: env.contactEmail,
		emailHref: `mailto:${env.contactEmail}`,
		socialImage: withOptionalBasePath(env.socialImage),
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
