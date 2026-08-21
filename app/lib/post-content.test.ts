import { describe, expect, it } from 'vitest';
import {
	calculateReadingMinutes,
	categoryToSlug,
	normalizePostDate,
	validatePostSources,
} from './post-content';

const post = (filename: string, frontmatter: string) => ({
	filename,
	raw: `---\n${frontmatter}\n---\n\nNội dung bài viết.`,
});

describe('validatePostSources', () => {
	it('accepts the documented Vietnamese and ISO date formats', () => {
		expect(() => validatePostSources([
			post('viet.md', 'title: Việt Nam\ncreatedAt: 21/08/2026'),
			post('iso.md', 'title: ISO\ncreatedAt: 2026-08-21'),
			post('datetime.md', 'title: Datetime\ncreatedAt: 2026-08-21T09:00:00+07:00'),
		])).not.toThrow();
	});

	it.each([
		['missing title', 'createdAt: 21/08/2026', '"title"'],
		['blank title', 'title: "  "\ncreatedAt: 21/08/2026', '"title"'],
		['missing date', 'title: Thiếu ngày', '"createdAt"'],
		['impossible date', 'title: Sai ngày\ncreatedAt: 31/02/2026', '"createdAt"'],
		['unsupported date', 'title: Sai format\ncreatedAt: 08-21-2026', '"createdAt"'],
	])('rejects %s', (_label, frontmatter, expectedMessage) => {
		expect(() => validatePostSources([post('invalid.md', frontmatter)]))
			.toThrow(expectedMessage);
	});

	it('rejects duplicate route slugs after removing the date prefix', () => {
		expect(() => validatePostSources([
			post('2026-08-21-chao-ban.md', 'title: Một\ncreatedAt: 21/08/2026'),
			post('chao-ban.mdx', 'title: Hai\ncreatedAt: 22/08/2026'),
		])).toThrow('route slug "chao-ban" is produced by multiple files');
	});
});

describe('post calculations', () => {
	it('normalizes valid dates and rejects invalid calendar dates', () => {
		expect(normalizePostDate('21/08/2026')).toBe('2026-08-21');
		expect(normalizePostDate('2026-08-21T09:00:00+07:00')).toBe('2026-08-21');
		expect(normalizePostDate('2026-02-29')).toBe('');
	});

	it('rounds reading time up and keeps a one-minute minimum', () => {
		expect(calculateReadingMinutes('')).toBe(1);
		expect(calculateReadingMinutes('một '.repeat(200))).toBe(1);
		expect(calculateReadingMinutes('một '.repeat(201))).toBe(2);
	});

	it('creates stable, URL-safe category slugs', () => {
		expect(categoryToSlug('Trải lòng')).toBe('trai-long');
		expect(categoryToSlug('Công việc & Cuộc sống')).toBe('cong-viec-cuoc-song');
	});
});
