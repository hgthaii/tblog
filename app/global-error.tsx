'use client';

import ErrorState from './components/ErrorState';
import { SITE_CONFIG } from './lib/config';
import { locale } from './lib/translations';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang={SITE_CONFIG.site.locale}>
			<body>
				<ErrorState
					code="500"
					title={locale === 'vi' ? 'mọi thứ vừa chậm lại một nhịp.' : 'everything slowed down for a moment.'}
					description={locale === 'vi' ? 'Trang chưa thể tiếp tục lúc này. Thử tải lại một lần nữa, mình sẽ nối lại đoạn đường còn dang dở.' : 'The page cannot continue right now. Try loading it again and we will pick up where we left off.'}
					onRetry={reset}
				/>
			</body>
		</html>
	);
}
