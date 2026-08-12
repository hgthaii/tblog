import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { content } from './config';

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

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const DATE_PREFIX_REGEX = /^\d{4}-\d{2}-\d{2}-(.+)$/;

function stripMarkdown(source: string) {
	return source
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/^>\s?/gm, '')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^\s*[-*+]\s+/gm, '')
		.replace(/^\s*\d+\.\s+/gm, '')
		.replace(/[*_~]/g, '')
		.replace(/\n+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function extractExcerpt(content: string) {
	const blocks = content
		.split(/\n\s*\n/)
		.map((block) => block.trim())
		.filter(Boolean);

	for (const block of blocks) {
		if (
			block.startsWith('```') ||
			block.startsWith('#') ||
			block.startsWith('- ') ||
			block.startsWith('* ') ||
			/^\d+\.\s/.test(block)
		) {
			continue;
		}

		const plainText = stripMarkdown(block);
		if (plainText) {
			return plainText.slice(0, 220).trim();
		}
	}

	return stripMarkdown(content).slice(0, 220).trim();
}

function parseCategories(value: unknown) {
	if (Array.isArray(value)) {
		return value
			.filter((item): item is string => typeof item === 'string')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	if (typeof value === 'string') {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [content.blog.defaults.category];
}

function normalizeFileSlug(filename: string) {
	return filename.replace(/\.mdx?$/i, '');
}

function normalizePostDate(value: string) {
	const vietnameseDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
	if (vietnameseDate) {
		const [, day, month, year] = vietnameseDate;
		return `${year}-${month}-${day}`;
	}

	const isoDate = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
	return isoDate?.[1] ?? '';
}

function toRouteSlug(fileSlug: string) {
	return fileSlug.replace(DATE_PREFIX_REGEX, '$1');
}

function listPostFiles() {
	if (!fs.existsSync(POSTS_DIR)) return [];

	return fs
		.readdirSync(POSTS_DIR)
		.filter((filename) => /\.mdx?$/i.test(filename))
		.sort();
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

	const title = typeof data.title === 'string' ? data.title : slug;
	const excerpt = extractExcerpt(parsed.content);
	const createdAt = typeof data.createdAt === 'string' ? data.createdAt : '';
	const publishedAt = normalizePostDate(createdAt);
	const authorName = typeof data.authorName === 'string' ? data.authorName.trim() : '';
	const categories = parseCategories(data.category);
	const wordCount = parsed.content.trim().split(/\s+/).filter(Boolean).length;
	const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
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
	const routeSlugs = listPostFiles().map((filename) =>
		toRouteSlug(normalizeFileSlug(filename)),
	);

	return [...new Set(routeSlugs)];
}

export function getPostBySlug(slug: string): PostDetail | null {
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
