'use client';

import ContentShell from '../../components/ContentShell';
import { useLocale } from '../../lib/LocaleContext';

export default function NotFound() {
	const { content } = useLocale();

	return (
		<ContentShell active="blog">
			<div className="interactive-card p-5 sm:p-7 max-w-md w-full">
				<h1 className="card-title mb-2">{content.blog.notFound.title}</h1>
				<p className="page-subtitle">{content.blog.notFound.description}</p>
			</div>
		</ContentShell>
	);
}
