import { content } from '../../lib/config';
import { createOpenGraphImage } from '../../lib/opengraph';
import { getPostBySlug, getPostSlugs } from '../../lib/posts';

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = 'image/png';
export const dynamic = 'force-static';

export function generateStaticParams() {
	return getPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	return createOpenGraphImage({
		pageTitle: post?.title ?? content.blog.notFound.title,
		quote: post?.quote,
	});
}
