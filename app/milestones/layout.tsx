import type { Metadata } from 'next';

import { createPageMetadata, SEO } from '../lib/seo';

export const metadata: Metadata = createPageMetadata(SEO.milestones.title, SEO.milestones.description, '/milestones/');

export default function MilestonesLayout({ children }: { children: React.ReactNode }) {
	return children;
}
