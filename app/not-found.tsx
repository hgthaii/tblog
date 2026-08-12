import type { Metadata } from 'next';

import ErrorState from './components/ErrorState';
import { content } from './lib/config';

export const metadata: Metadata = {
	title: content.errors.pageNotFound.metadataTitle,
};

export default function NotFound() {
	return (
		<ErrorState
			code="404"
			title={content.errors.pageNotFound.title}
			description={content.errors.pageNotFound.description}
		/>
	);
}
