import ErrorState from '../../components/ErrorState';

export default function NotFound() {
	return (
		<ErrorState
			code="404"
			title="bài viết này đã lặng trôi."
			description="Không tìm thấy bài viết bạn đang tìm. Có thể chiếc tên đã đổi, hoặc câu chuyện vẫn chưa được viết ra."
		/>
	);
}
