export type HolidayThemeName =
	| 'national-day'
	| 'mid-autumn'
	| 'christmas'
	| 'new-year'
	| 'tet'
	| 'children-day'
	| 'reunification-day';

export type SeasonThemeName = 'spring' | 'summer' | 'autumn' | 'winter';
export type SeasonalThemeName = HolidayThemeName | SeasonThemeName;
export type SeasonalThemeMode = 'auto' | 'none' | SeasonalThemeName;

export const SEASONAL_THEME_WINDOW = {
	daysBefore: 7,
	daysAfter: 0,
} as const;

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';

const getNumberPart = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
	Number(parts.find((part) => part.type === type)?.value);

const vietnamDateFormatter = new Intl.DateTimeFormat('en-CA', {
	timeZone: VIETNAM_TIME_ZONE,
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
});

const vietnameseLunarFormatter = new Intl.DateTimeFormat('en-u-ca-chinese', {
	timeZone: VIETNAM_TIME_ZONE,
	month: 'numeric',
	day: 'numeric',
});

const getVietnamDateParts = (date: Date) => {
	const parts = vietnamDateFormatter.formatToParts(date);
	return {
		year: getNumberPart(parts, 'year'),
		month: getNumberPart(parts, 'month'),
		day: getNumberPart(parts, 'day'),
	};
};

const getVietnamDateSerial = (date: Date) => {
	const { year, month, day } = getVietnamDateParts(date);
	return Date.UTC(year, month - 1, day);
};

const isWithinWindow = (daysUntilEvent: number) =>
	daysUntilEvent >= -SEASONAL_THEME_WINDOW.daysAfter &&
	daysUntilEvent <= SEASONAL_THEME_WINDOW.daysBefore;

const getFixedHolidayDistance = (
	date: Date,
	eventMonth: number,
	eventDay: number,
) => {
	const { year } = getVietnamDateParts(date);
	const today = getVietnamDateSerial(date);
	return [year - 1, year, year + 1]
		.map((candidateYear) =>
			Math.round((Date.UTC(candidateYear, eventMonth - 1, eventDay) - today) / DAY_IN_MS),
		)
		.filter(isWithinWindow)
		.sort((first, second) => Math.abs(first) - Math.abs(second))[0];
};

const getLunarHolidayDistance = (date: Date, eventMonth: number, eventDay: number) => {
	try {
		for (
			let offset = -SEASONAL_THEME_WINDOW.daysAfter;
			offset <= SEASONAL_THEME_WINDOW.daysBefore;
			offset += 1
		) {
			const candidate = new Date(date.getTime() + offset * DAY_IN_MS);
			const parts = vietnameseLunarFormatter.formatToParts(candidate);
			const lunarMonth = getNumberPart(parts, 'month');
			const lunarDay = getNumberPart(parts, 'day');

			if (lunarMonth === eventMonth && lunarDay === eventDay) return offset;
		}
	} catch {
		return undefined;
	}

	return undefined;
};

const getReunificationDistance = (date: Date) => {
	const april30 = getFixedHolidayDistance(date, 4, 30);
	const may1 = getFixedHolidayDistance(date, 5, 1);
	return [april30, may1]
		.filter((distance): distance is number => distance !== undefined)
		.sort((first, second) => Math.abs(first) - Math.abs(second))[0];
};

const getHolidayTheme = (date: Date): HolidayThemeName | null => {
	const candidates: Array<{ theme: HolidayThemeName; distance: number | undefined }> = [
		{ theme: 'new-year', distance: getFixedHolidayDistance(date, 1, 1) },
		{ theme: 'tet', distance: getLunarHolidayDistance(date, 1, 1) },
		{ theme: 'reunification-day', distance: getReunificationDistance(date) },
		{ theme: 'children-day', distance: getFixedHolidayDistance(date, 6, 1) },
		{ theme: 'national-day', distance: getFixedHolidayDistance(date, 9, 2) },
		{ theme: 'mid-autumn', distance: getLunarHolidayDistance(date, 8, 15) },
		{ theme: 'christmas', distance: getFixedHolidayDistance(date, 12, 25) },
	];

	return candidates
		.filter((candidate): candidate is { theme: HolidayThemeName; distance: number } =>
			candidate.distance !== undefined,
		)
		.sort((first, second) => Math.abs(first.distance) - Math.abs(second.distance))[0]
		?.theme ?? null;
};

const getSeasonTheme = (date: Date): SeasonThemeName => {
	const { month } = getVietnamDateParts(date);
	if (month >= 3 && month <= 5) return 'spring';
	if (month >= 6 && month <= 8) return 'summer';
	if (month >= 9 && month <= 11) return 'autumn';
	return 'winter';
};

export function resolveSeasonalTheme(
	date: Date,
	mode: SeasonalThemeMode = 'auto',
): SeasonalThemeName | null {
	if (mode === 'none') return null;
	if (mode !== 'auto') return mode;
	return getHolidayTheme(date) ?? getSeasonTheme(date);
}
