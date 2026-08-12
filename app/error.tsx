'use client';

import ErrorState from './components/ErrorState';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<ErrorState
			code="500"
			title="nhịp này vừa bị ngắt."
			description="Có một lỗi nhỏ khi mở trang. Bạn có thể thử lại, hoặc quay về trang chủ để bắt đầu từ đầu."
			onRetry={reset}
		/>
	);
}
