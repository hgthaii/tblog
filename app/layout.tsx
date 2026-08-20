import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import SeasonalTheme from './components/SeasonalTheme';
import ThemeToggle from './components/ThemeToggle';
import { COLOR_THEME_INIT_SCRIPT } from './lib/color-theme';
import { SITE_CONFIG } from './lib/config';
import { LocaleProvider } from './lib/LocaleContext';
import {
	absoluteUrl,
	openGraphImageUrl,
	SEO,
} from './lib/seo';
import 'pullcord/pullcord.css';
import './globals.css';

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	colorScheme: 'light dark',
};

export const metadata: Metadata = {
	metadataBase: new URL(SITE_CONFIG.site.url),
	title: SEO.home.title,
	description: SITE_CONFIG.site.description,
	applicationName: SITE_CONFIG.site.title,
	authors: [{ name: SITE_CONFIG.profile.name, url: absoluteUrl('/') }],
	creator: SITE_CONFIG.profile.name,
	publisher: SITE_CONFIG.profile.name,
	alternates: {
		canonical: absoluteUrl('/'),
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	openGraph: {
		type: 'website',
		locale: SITE_CONFIG.locale.openGraph,
		url: SITE_CONFIG.site.url,
		title: SEO.home.title,
		description: SITE_CONFIG.site.description,
		siteName: SITE_CONFIG.site.title,
		images: [
			{
				url: openGraphImageUrl('/'),
				width: 1200,
				height: 630,
				alt: SEO.home.title,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: SEO.home.title,
		description: SITE_CONFIG.site.description,
		images: [openGraphImageUrl('/')],
	},
	icons: {
		icon: [{ url: SITE_CONFIG.site.favicon, type: 'image/svg+xml' }],
		shortcut: [SITE_CONFIG.site.favicon],
		apple: [{ url: SITE_CONFIG.site.socialImage }],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang={SITE_CONFIG.locale.code}
			data-theme="system"
			data-theme-preference="system"
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: COLOR_THEME_INIT_SCRIPT }} />
			</head>
			<body className="antialiased">
				<LocaleProvider>
					{children}
					<ThemeToggle />
				</LocaleProvider>
				<SeasonalTheme />
				{SITE_CONFIG.analytics.umami.enabled && (
					<Script
						id="umami-analytics"
						src={SITE_CONFIG.analytics.umami.src}
						data-website-id={SITE_CONFIG.analytics.umami.websiteId}
						strategy="afterInteractive"
					/>
				)}
			</body>
		</html>
	);
}
