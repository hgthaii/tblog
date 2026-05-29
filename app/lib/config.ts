const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = rawBasePath
	? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
	: '';

const withBasePath = (pathname: string) =>
	`${basePath}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

const profileName = 'thái.';
const socialImage = '/avatar_minimalist.png';

export const SITE_CONFIG = {
	site: {
		title: `${profileName} — ghi chép`,
		description: 'chuyên gia chuyển hoá cà phê thành những dòng code đầy rủi ro. nơi lưu trữ hành trình làm giàu cho các tiệm thuốc tây:)',
		url: 'https://hgthaii.dev',
		cvUrl: 'https://cv.hgthaii.dev',
		email: 'contact@hgthaii.dev',
		socialImage,
	},
	profile: {
		name: profileName,
		avatar: withBasePath('/hgthaii.jpeg'),
		github: 'https://github.com/hgthaii',
		instagram: 'https://instagram.com/hgthaii',
		linkedin: 'https://linkedin.com/in/hgthaii',
	},
} as const;
