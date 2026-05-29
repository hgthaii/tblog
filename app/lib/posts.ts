import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PostMeta = {
	slug: string;
	title: string;
	excerpt: string;
	createdAt: string;
	authorName: string;
	category: string;
};

export type PostDetail = PostMeta & {
	content: string;
};

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function normalizeSlug(filename: string) {
	return filename.replace(/\.mdx?$/i, '');
}

function parseFrontmatter(slug: string, raw: string): PostDetail {
	const parsed = matter(raw);
	const data = parsed.data as Record<string, unknown>;

	const title = typeof data.title === 'string' ? data.title : slug;
	const excerpt =
		typeof data.excerpt === 'string'
			? data.excerpt
			: parsed.content.trim().split('\n').find((l) => l.trim())?.slice(0, 180) ?? '';
	const createdAt = typeof data.createdAt === 'string' ? data.createdAt : '';
	const authorName = typeof data.authorName === 'string' ? data.authorName : 'unknown';
	const category = typeof data.category === 'string' ? data.category : 'uncategorized';

	return {
		slug,
		title,
		excerpt,
		createdAt,
		authorName,
		category,
		content: parsed.content,
	};
}

export function getPostSlugs(): string[] {
	if (!fs.existsSync(POSTS_DIR)) return [];

	return fs
		.readdirSync(POSTS_DIR)
		.filter((f) => /\.mdx?$/i.test(f))
		.map(normalizeSlug)
		.sort();
}

export function getPostBySlug(slug: string): PostDetail | null {
	const mdPath = path.join(POSTS_DIR, `${slug}.md`);
	const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);

	let filePath: string | null = null;
	if (fs.existsSync(mdPath)) filePath = mdPath;
	else if (fs.existsSync(mdxPath)) filePath = mdxPath;

	if (!filePath) return null;

	const raw = fs.readFileSync(filePath, 'utf8');
	return parseFrontmatter(slug, raw);
}

export function getAllPosts(): PostMeta[] {
	const slugs = getPostSlugs();
	const posts = slugs
		.map((slug) => getPostBySlug(slug))
		.filter((p): p is PostDetail => Boolean(p))
		.map(({ slug, title, excerpt, createdAt, authorName, category }) => ({
			slug,
			title,
			excerpt,
			createdAt,
			authorName,
			category,
		}));

	posts.sort((a, b) => {
		const ad = Date.parse(a.createdAt) || 0;
		const bd = Date.parse(b.createdAt) || 0;
		return bd - ad;
	});

	return posts;
}
