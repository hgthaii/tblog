import { describe, expect, it } from 'vitest';
import { normalizeSearchText } from './search';

describe('normalizeSearchText', () => {
	it('makes Vietnamese text searchable without diacritics', () => {
		expect(normalizeSearchText('Một vài âm điệu từ tôi')).toBe('mot vai am dieu tu toi');
		expect(normalizeSearchText('Đường về Đà Nẵng')).toBe('duong ve da nang');
	});

	it('normalizes case and repeated whitespace', () => {
		expect(normalizeSearchText('  TRẢI   LÒNG  ')).toBe('trai long');
	});
});
