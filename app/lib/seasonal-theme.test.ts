import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveSeasonalTheme } from './seasonal-theme';

const setVietnamDate = (isoDate: string) => {
	vi.setSystemTime(new Date(`${isoDate}T05:00:00.000Z`));
	return new Date();
};

describe('resolveSeasonalTheme', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('starts a fixed holiday exactly seven calendar days before the event', () => {
		expect(resolveSeasonalTheme(setVietnamDate('2026-08-25'))).toBe('summer');
		expect(resolveSeasonalTheme(setVietnamDate('2026-08-26'))).toBe('national-day');
		expect(resolveSeasonalTheme(setVietnamDate('2026-09-02'))).toBe('national-day');
		expect(resolveSeasonalTheme(setVietnamDate('2026-09-03'))).toBe('autumn');
	});

	it('finds the upcoming new year across a calendar-year boundary', () => {
		expect(resolveSeasonalTheme(setVietnamDate('2026-12-25'))).toBe('christmas');
		expect(resolveSeasonalTheme(setVietnamDate('2026-12-26'))).toBe('new-year');
		expect(resolveSeasonalTheme(setVietnamDate('2027-01-01'))).toBe('new-year');
		expect(resolveSeasonalTheme(setVietnamDate('2027-01-02'))).toBe('winter');
	});

	it('uses the normal season outside holiday windows', () => {
		expect(resolveSeasonalTheme(setVietnamDate('2026-03-15'))).toBe('spring');
		expect(resolveSeasonalTheme(setVietnamDate('2026-06-15'))).toBe('summer');
		expect(resolveSeasonalTheme(setVietnamDate('2026-09-15'))).toBe('autumn');
		expect(resolveSeasonalTheme(setVietnamDate('2026-12-15'))).toBe('winter');
	});

	it('honors explicit modes', () => {
		const date = setVietnamDate('2026-08-21');
		expect(resolveSeasonalTheme(date, 'none')).toBeNull();
		expect(resolveSeasonalTheme(date, 'christmas')).toBe('christmas');
	});
});
