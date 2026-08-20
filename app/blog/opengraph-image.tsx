import { createOpenGraphImage } from '../lib/opengraph';
import { SEO } from '../lib/seo';

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function Image() {
	return createOpenGraphImage({ pageTitle: SEO.blog.title });
}
