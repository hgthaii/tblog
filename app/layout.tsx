import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "./lib/config";
import { absoluteUrl } from "./lib/seo";

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
};

export const metadata: Metadata = {
	metadataBase: new URL(SITE_CONFIG.site.url),
	title: {
		default: SITE_CONFIG.site.title,
		template: `%s | ${SITE_CONFIG.site.title}`,
	},
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
		title: SITE_CONFIG.site.title,
		description: SITE_CONFIG.site.description,
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
		title: SITE_CONFIG.site.title,
		description: SITE_CONFIG.site.description,
		images: [SITE_CONFIG.site.ogImage],
	},
	icons: {
		icon: [{ url: SITE_CONFIG.site.favicon, type: 'image/svg+xml' }],
		shortcut: [SITE_CONFIG.site.favicon],
		apple: [{ url: SITE_CONFIG.site.socialImage }],
	},
};

import { LocaleProvider } from "./lib/LocaleContext";
import RouteTransitionMarker from "./components/RouteTransitionMarker";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang={SITE_CONFIG.locale.code}>
			<body className="antialiased">
				<LocaleProvider>
					<RouteTransitionMarker />
					{children}
				</LocaleProvider>
				<script 
					defer 
					src={SITE_CONFIG.analytics.umami.src} 
					data-website-id={SITE_CONFIG.analytics.umami.websiteId}
				>
				</script>
			</body>

			<script 
				defer 
				src={SITE_CONFIG.analytics.umami.src} 
				data-website-id={SITE_CONFIG.analytics.umami.websiteId}
			>
			</script>
		</html>
	);
}
