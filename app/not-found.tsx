import type { Metadata } from 'next';

import ErrorState from './components/ErrorState';

export const metadata: Metadata = {
	title: 'Không tìm thấy trang',
};

export default function NotFound() {
	return (
		<ErrorState
			code="404"
			title="trang này đã lặng trôi."
			description="Có lẽ đường dẫn đã đổi, hoặc nơi này chưa từng tồn tại. Mình quay về nhịp quen thuộc nhé."
		/>
	);
}
