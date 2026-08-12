'use client';

import ErrorState from './components/ErrorState';
import { locale } from './lib/translations';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<ErrorState
			code="500"
			title={locale === 'vi' ? 'nhịp này vừa bị ngắt.' : 'the rhythm was interrupted.'}
			description={locale === 'vi' ? 'Có một lỗi nhỏ khi mở trang. Bạn có thể thử lại, hoặc quay về trang chủ để bắt đầu từ đầu.' : 'Something went wrong while opening this page. Try again, or return home for a fresh start.'}
			onRetry={reset}
		/>
	);
}
