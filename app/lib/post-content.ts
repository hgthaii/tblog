import matter from 'gray-matter';

export type PostSource = {
	filename: string;
	raw: string;
};

const DATE_PREFIX_REGEX = /^\d{4}-\d{2}-\d{2}-(.+)$/;

export function stripMarkdown(source: string) {
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

export function extractExcerpt(content: string) {
	const blocks = content
		.split(/\n\s*\n/)
		.map((block) => block.trim())
		.filter(Boolean);

	for (const block of blocks) {
		if (
			block.startsWith('```')
			|| block.startsWith('#')
			|| block.startsWith('- ')
			|| block.startsWith('* ')
			|| /^\d+\.\s/.test(block)
		) {
			continue;
		}

		const plainText = stripMarkdown(block);
		if (plainText) return plainText.slice(0, 220).trim();
	}

	return stripMarkdown(content).slice(0, 220).trim();
}

export function parseCategories(value: unknown, defaultCategory: string) {
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

	return [defaultCategory];
}

export function normalizeFileSlug(filename: string) {
	return filename.replace(/\.mdx?$/i, '');
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

export function normalizePostDate(value: string) {
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

export function normalizePostDateValue(value: unknown) {
	if (typeof value === 'string') return normalizePostDate(value);
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}

	return '';
}

export function toRouteSlug(fileSlug: string) {
	return fileSlug.replace(DATE_PREFIX_REGEX, '$1');
}

export function categoryToSlug(category: string) {
	return category
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/gi, (letter) => letter === 'Đ' ? 'D' : 'd')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function calculateReadingMinutes(content: string, wordsPerMinute = 200) {
	const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function validatePostSources(sources: PostSource[]) {
	const errors: string[] = [];
	const filesByRouteSlug = new Map<string, string[]>();

	for (const { filename, raw } of sources) {
		const sourceSlug = normalizeFileSlug(filename);
		const routeSlug = toRouteSlug(sourceSlug);
		const matchingFiles = filesByRouteSlug.get(routeSlug) ?? [];
		matchingFiles.push(filename);
		filesByRouteSlug.set(routeSlug, matchingFiles);

		let data: Record<string, unknown>;

		try {
			data = matter(raw).data as Record<string, unknown>;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			errors.push(`${filename}: frontmatter could not be parsed (${message})`);
			continue;
		}

		if (typeof data.title !== 'string' || !data.title.trim()) {
			errors.push(`${filename}: "title" must be a non-empty string`);
		}

		if (!normalizePostDateValue(data.createdAt)) {
			errors.push(`${filename}: "createdAt" must be a real date in DD/MM/YYYY or ISO format`);
		}

		if (data.authorName !== undefined && typeof data.authorName !== 'string') {
			errors.push(`${filename}: "authorName" must be a string when provided`);
		}

		if (data.category !== undefined && !(
			typeof data.category === 'string'
			|| (Array.isArray(data.category) && data.category.every((item) => typeof item === 'string'))
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
}
