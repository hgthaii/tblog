import ErrorState from '../../components/ErrorState';
import { content } from '../../lib/config';

export default function NotFound() {
	return (
		<ErrorState
			code="404"
			title={content.errors.postNotFound.title}
			description={content.errors.postNotFound.description}
		/>
	);
}
