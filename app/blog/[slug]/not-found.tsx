import ErrorState from '../../components/ErrorState';
import { locale } from '../../lib/translations';

export default function NotFound() {
	return (
		<ErrorState
			code="404"
			title={locale === 'vi' ? 'bài viết này đã lặng trôi.' : 'this post has drifted away.'}
			description={locale === 'vi' ? 'Không tìm thấy bài viết bạn đang tìm. Có thể chiếc tên đã đổi, hoặc câu chuyện vẫn chưa được viết ra.' : 'The post you are looking for could not be found. Its name may have changed, or the story may not have been written yet.'}
		/>
	);
}
