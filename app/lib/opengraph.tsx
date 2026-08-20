import { ImageResponse } from 'next/og';

import { SITE_CONFIG } from './config';

const PAGE_TITLE_MAX_LENGTH = 72;
const QUOTE_MAX_LENGTH = 140;

type OpenGraphImageOptions = {
	pageTitle: string;
	quote?: string;
};

function truncateText(value: string, maxLength: number) {
	if (value.length <= maxLength) return value;

	return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function createOpenGraphImage({
	pageTitle,
	quote,
}: OpenGraphImageOptions) {
	const normalizedQuote = quote?.trim();
	const hasQuote = Boolean(normalizedQuote);
	const eyebrow = hasQuote ? pageTitle : SITE_CONFIG.site.title;
	const mainText = hasQuote
		? `“${truncateText(normalizedQuote ?? '', QUOTE_MAX_LENGTH)}”`
		: truncateText(pageTitle, PAGE_TITLE_MAX_LENGTH);
	const displayUrl = SITE_CONFIG.site.url.replace(/^https?:\/\//, '');

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					backgroundColor: '#121212',
					color: '#f4f4f5',
					padding: '56px',
					fontFamily: 'monospace, sans-serif',
				}}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						border: '1px solid rgba(255, 255, 255, 0.08)',
						borderRadius: '16px',
						padding: '44px 48px',
						backgroundColor: '#1b1b1a',
					}}
				>
					<div
						style={{
							display: 'flex',
							fontSize: 22,
							color: '#71717a',
						}}
					>
						{eyebrow}
					</div>

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							flexGrow: 1,
							maxWidth: '1000px',
							fontSize: hasQuote ? 48 : 72,
							fontWeight: 600,
							lineHeight: hasQuote ? 1.35 : 1.15,
							letterSpacing: '-0.025em',
							fontStyle: hasQuote ? 'italic' : 'normal',
							color: '#ffffff',
						}}
					>
						{mainText}
					</div>

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							borderTop: '1px solid rgba(255, 255, 255, 0.06)',
							paddingTop: '24px',
							fontSize: 20,
							color: '#71717a',
						}}
					>
						<div style={{ display: 'flex', fontWeight: 600 }}>
							{SITE_CONFIG.profile.name}
						</div>
						<div style={{ display: 'flex' }}>{displayUrl}</div>
					</div>
				</div>
			</div>
		),
		{ width: 1200, height: 630 },
	);
}
