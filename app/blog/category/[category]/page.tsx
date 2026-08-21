import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BlogClient from '../../BlogClient';
import { content, SITE_CONFIG } from '../../../lib/config';
import { getAllCategories, getPostsByCategorySlug } from '../../../lib/posts';
import { absoluteUrl, openGraphImageUrl } from '../../../lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
	return getAllCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ category: string }>;
}): Promise<Metadata> {
	const { category: categorySlug } = await params;
	const category = getAllCategories().find((item) => item.slug === categorySlug);
	if (!category) return { title: content.blog.notFound.title };

	const title = `${category.name} | ${SITE_CONFIG.site.title}`;
	const description = content.blog.category.description.replace('{category}', category.name);
	const url = absoluteUrl(`/blog/category/${category.slug}/`);
	const image = openGraphImageUrl('/blog/');

	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			type: 'website',
			locale: SITE_CONFIG.locale.openGraph,
			url,
			title,
			description,
			siteName: SITE_CONFIG.site.title,
			images: [{ url: image, width: 1200, height: 630, alt: title }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [image],
		},
	};
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category: categorySlug } = await params;
	const categories = getAllCategories();
	const category = categories.find((item) => item.slug === categorySlug);
	if (!category) return notFound();

	return (
		<BlogClient
			posts={getPostsByCategorySlug(category.slug)}
			categories={categories}
			heading={category.name}
			activeCategory={category.slug}
		/>
	);
}
