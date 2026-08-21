import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { content, SITE_CONFIG } from './config';
import {
	calculateReadingMinutes,
	categoryToSlug,
	extractExcerpt,
	normalizeFileSlug,
	normalizePostDateValue,
	parseCategories,
	toRouteSlug,
	validatePostSources,
} from './post-content';

export type PostMeta = {
	slug: string;
	title: string;
	excerpt: string;
	createdAt: string;
	publishedAt: string;
	authorName: string;
	categories: string[];
	readingMinutes: number;
	order: number;
	quote: string;
};

export type PostDetail = PostMeta & {
	content: string;
};

export type PostCategory = {
	name: string;
	slug: string;
	count: number;
};

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
let postsValidated = false;

function listPostFiles() {
	if (!fs.existsSync(POSTS_DIR)) return [];

	return fs
		.readdirSync(POSTS_DIR)
		.filter((filename) => /\.mdx?$/i.test(filename))
		.sort();
}

function validatePostFiles() {
	if (postsValidated) return;

	const files = listPostFiles();
	validatePostSources(files.map((filename) => ({
		filename,
		raw: fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8'),
	})));

	postsValidated = true;
}

function findPostFileBySlug(slug: string) {
	const files = listPostFiles();

	const exactSourceMatch = files.find((filename) => normalizeFileSlug(filename) === slug);
	if (exactSourceMatch) return exactSourceMatch;

	return files.find((filename) => toRouteSlug(normalizeFileSlug(filename)) === slug) ?? null;
}

function parseFrontmatter(slug: string, raw: string): PostDetail {
	const parsed = matter(raw);
	const data = parsed.data as Record<string, unknown>;

	const title = typeof data.title === 'string' ? data.title.trim() : slug;
	const excerpt = extractExcerpt(parsed.content);
	const publishedAt = normalizePostDateValue(data.createdAt);
	const createdAt = typeof data.createdAt === 'string' ? data.createdAt : publishedAt;
	const authorName = typeof data.authorName === 'string' ? data.authorName.trim() : '';
	const categories = parseCategories(data.category, content.blog.defaults.category);
	const readingMinutes = calculateReadingMinutes(parsed.content);
	const order = Number.parseInt(String(data.order ?? ''), 10) || 0;
	const quote = typeof data.quote === 'string' ? data.quote.trim() : '';

	return {
		slug,
		title,
		excerpt,
		createdAt,
		publishedAt,
		authorName,
		categories,
		readingMinutes,
		content: parsed.content,
		order,
		quote,
	};
}

export function getPostSlugs(): string[] {
	validatePostFiles();
	const routeSlugs = listPostFiles().map((filename) =>
		toRouteSlug(normalizeFileSlug(filename)),
	);

	return [...new Set(routeSlugs)];
}

export function getPostBySlug(slug: string): PostDetail | null {
	validatePostFiles();
	const filename = findPostFileBySlug(slug);
	if (!filename) return null;

	const filePath = path.join(POSTS_DIR, filename);
	const raw = fs.readFileSync(filePath, 'utf8');
	const routeSlug = toRouteSlug(normalizeFileSlug(filename));

	return parseFrontmatter(routeSlug, raw);
}

export function getAllPosts(): PostMeta[] {
	const slugs = getPostSlugs();
	const posts = slugs
		.map((slug) => getPostBySlug(slug))
		.filter((p): p is PostDetail => Boolean(p))
		.map(({ slug, title, excerpt, createdAt, publishedAt, authorName, categories, readingMinutes, order, quote }) => ({
			slug,
			title,
			excerpt,
			createdAt,
			publishedAt,
			authorName,
			categories,
			readingMinutes,
			order,
			quote,
		}));

	posts.sort((a, b) => {
		const ad = Date.parse(a.publishedAt) || 0;
		const bd = Date.parse(b.publishedAt) || 0;
		return (bd - ad) || ((b.order ?? 0) - (a.order ?? 0));
	});

	return posts;
}

export function getAllCategories(): PostCategory[] {
	const categories = new Map<string, PostCategory>();

	for (const post of getAllPosts()) {
		for (const name of post.categories) {
			const slug = categoryToSlug(name);
			if (!slug) continue;
			const existing = categories.get(slug);
			categories.set(slug, {
				name: existing?.name ?? name,
				slug,
				count: (existing?.count ?? 0) + 1,
			});
		}
	}

	return [...categories.values()].sort((first, second) =>
		first.name.localeCompare(second.name, SITE_CONFIG.locale.code),
	);
}

export function getPostsByCategorySlug(categorySlug: string): PostMeta[] {
	return getAllPosts().filter((post) =>
		post.categories.some((category) => categoryToSlug(category) === categorySlug),
	);
}
