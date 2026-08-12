import type { Metadata } from 'next';

import { createPageMetadata, SEO } from '../lib/seo';

export const metadata: Metadata = createPageMetadata(SEO.blog.title, SEO.blog.description, '/blog/');

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	return children;
}
