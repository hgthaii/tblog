import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "./lib/config";
import LanguageSwitcher from "./components/LanguageSwitcher";

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
	openGraph: {
		type: 'website',
		url: SITE_CONFIG.site.url,
		title: SITE_CONFIG.site.title,
		description: SITE_CONFIG.site.description,
		siteName: SITE_CONFIG.site.title,
		images: [
			{
				url: SITE_CONFIG.site.socialImage,
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
		images: [SITE_CONFIG.site.socialImage],
	},
	icons: {
		icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
		shortcut: ['/icon.svg'],
		apple: [{ url: SITE_CONFIG.site.socialImage }],
	},
};

import { LocaleProvider } from "./lib/LocaleContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`antialiased`}
				style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace" }}
			>
				<LocaleProvider>
					<LanguageSwitcher />
					{children}
				</LocaleProvider>
			</body>
		</html>
	);
}
