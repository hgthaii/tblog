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
let postsValidated = false;

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
	const trimmedValue = value.trim();
	const vietnameseDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);
	if (vietnameseDate) {
		const [, day, month, year] = vietnameseDate;
		const isoDate = `${year}-${month}-${day}`;
		return isValidCalendarDate(isoDate) ? isoDate : '';
	}

	const isoDate = /^(\d{4}-\d{2}-\d{2})(?:$|T)/.exec(trimmedValue)?.[1] ?? '';
	if (!isValidCalendarDate(isoDate)) return '';
	if (trimmedValue === isoDate) return isoDate;

	return Number.isNaN(Date.parse(trimmedValue)) ? '' : isoDate;
}

function isValidCalendarDate(value: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return false;

	const [, rawYear, rawMonth, rawDay] = match;
	const year = Number(rawYear);
	const month = Number(rawMonth);
	const day = Number(rawDay);
	const date = new Date(Date.UTC(year, month - 1, day));

	return date.getUTCFullYear() === year
		&& date.getUTCMonth() === month - 1
		&& date.getUTCDate() === day;
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

function validatePostFiles() {
	if (postsValidated) return;

	const files = listPostFiles();
	const errors: string[] = [];
	const filesByRouteSlug = new Map<string, string[]>();

	for (const filename of files) {
		const sourceSlug = normalizeFileSlug(filename);
		const routeSlug = toRouteSlug(sourceSlug);
		const matchingFiles = filesByRouteSlug.get(routeSlug) ?? [];
		matchingFiles.push(filename);
		filesByRouteSlug.set(routeSlug, matchingFiles);

		const filePath = path.join(POSTS_DIR, filename);
		let data: Record<string, unknown>;

		try {
			data = matter(fs.readFileSync(filePath, 'utf8')).data as Record<string, unknown>;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			errors.push(`${filename}: frontmatter could not be parsed (${message})`);
			continue;
		}

		if (typeof data.title !== 'string' || !data.title.trim()) {
			errors.push(`${filename}: "title" must be a non-empty string`);
		}

		if (typeof data.createdAt !== 'string' || !normalizePostDate(data.createdAt)) {
			errors.push(`${filename}: "createdAt" must be a real date in DD/MM/YYYY or ISO format`);
		}

		if (
			data.authorName !== undefined
			&& typeof data.authorName !== 'string'
		) {
			errors.push(`${filename}: "authorName" must be a string when provided`);
		}

		if (data.category !== undefined && !(
			typeof data.category === 'string'
			|| (
				Array.isArray(data.category)
				&& data.category.every((item) => typeof item === 'string')
			)
		)) {
			errors.push(`${filename}: "category" must be a string or an array of strings`);
		}

		if (data.quote !== undefined && typeof data.quote !== 'string') {
			errors.push(`${filename}: "quote" must be a string when provided`);
		}

		if (data.order !== undefined) {
			const numericOrder = typeof data.order === 'string' && /^-?\d+$/.test(data.order.trim())
				? Number(data.order)
				: data.order;

			if (typeof numericOrder !== 'number' || !Number.isSafeInteger(numericOrder)) {
				errors.push(`${filename}: "order" must be an integer when provided`);
			}
		}
	}

	for (const [routeSlug, matchingFiles] of filesByRouteSlug) {
		if (matchingFiles.length > 1) {
			errors.push(`route slug "${routeSlug}" is produced by multiple files: ${matchingFiles.join(', ')}`);
		}
	}

	if (errors.length > 0) {
		throw new Error(`Invalid blog content:\n${errors.map((error) => `- ${error}`).join('\n')}`);
	}

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
