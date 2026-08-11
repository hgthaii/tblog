import type { NextConfig } from "next";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = rawBasePath
	? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
	: '';
const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
	output: 'export',
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	...(isDevelopment
		? {
			async headers() {
				return [
					{
						source: '/:path*',
						headers: [
							{
								key: 'Cache-Control',
								value: 'no-store, max-age=0',
							},
						],
					},
				];
			},
		}
		: {}),
	...(basePath
		? {
			basePath,
			assetPrefix: basePath,
		}
		: {}),
};

export default nextConfig;
