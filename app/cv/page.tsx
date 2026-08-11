'use client';

import ContentShell from '../components/ContentShell';
import { SITE_CONFIG } from '../lib/config';
import { useLocale } from '../lib/LocaleContext';

export default function CvPage() {
	const { content } = useLocale();

	return (
		<ContentShell active="cv">
			<div className="w-full max-w-[720px] mx-auto flex flex-col gap-5 sm:gap-6">
				<header className="flex flex-col gap-1">
					<div className="flex flex-col gap-1">
						<h1 className="page-title">{content.cv.title}</h1>
						<p className="page-subtitle max-w-[580px]">{content.cv.description}</p>
					</div>
				</header>

				<div className="cv-document w-full h-[calc(100svh-200px)] min-h-[520px] md:min-h-[640px]">
					<iframe
						src={`${SITE_CONFIG.site.cvPdf}#view=FitH`}
						title={content.cv.viewerTitle}
						className="w-full h-full border-0 bg-white"
					/>
				</div>

				<noscript>
					<p className="page-subtitle">
						{content.cv.fallback}{' '}
						<a href={SITE_CONFIG.site.cvPdf} className="text-heading underline underline-offset-4">
							{content.cv.openPdf}
						</a>
					</p>
				</noscript>
			</div>
		</ContentShell>
	);
}
