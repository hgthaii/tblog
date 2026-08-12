'use client';

import ErrorState from './components/ErrorState';
import { content } from './lib/config';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<ErrorState
			code="500"
			title={content.errors.pageError.title}
			description={content.errors.pageError.description}
			onRetry={reset}
		/>
	);
}
