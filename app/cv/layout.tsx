import type { Metadata } from 'next';

import { createPageMetadata, SEO } from '../lib/seo';

export const metadata: Metadata = createPageMetadata(SEO.cv.title, SEO.cv.description, '/cv/');

export default function CvLayout({ children }: { children: React.ReactNode }) {
	return children;
}
