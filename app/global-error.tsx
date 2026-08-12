'use client';

import ErrorState from './components/ErrorState';
import { content, SITE_CONFIG } from './lib/config';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang={SITE_CONFIG.locale.code}>
			<body>
				<ErrorState
					code="500"
					title={content.errors.globalError.title}
					description={content.errors.globalError.description}
					onRetry={reset}
				/>
			</body>
		</html>
	);
}
