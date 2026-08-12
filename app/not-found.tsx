import type { Metadata } from 'next';

import ErrorState from './components/ErrorState';
import { locale } from './lib/translations';

export const metadata: Metadata = {
	title: locale === 'vi' ? 'Không tìm thấy trang' : 'Page not found',
};

export default function NotFound() {
	return (
		<ErrorState
			code="404"
			title={locale === 'vi' ? 'trang này đã lặng trôi.' : 'this page has drifted away.'}
			description={locale === 'vi' ? 'Có lẽ đường dẫn đã đổi, hoặc nơi này chưa từng tồn tại. Mình quay về nhịp quen thuộc nhé.' : 'The address may have changed, or this place may never have existed. Let us return home.'}
		/>
	);
}
