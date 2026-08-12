'use client';

import ErrorState from './components/ErrorState';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang="vi">
			<body>
				<ErrorState
					code="500"
					title="mọi thứ vừa chậm lại một nhịp."
					description="Trang chưa thể tiếp tục lúc này. Thử tải lại một lần nữa, mình sẽ nối lại đoạn đường còn dang dở."
					onRetry={reset}
				/>
			</body>
		</html>
	);
}
