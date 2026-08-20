export const COLOR_THEME_STORAGE_KEY = 'tblog-color-theme';

export const COLOR_THEME_PREFERENCES = ['system', 'light', 'dark'] as const;

export type ColorThemePreference = typeof COLOR_THEME_PREFERENCES[number];
export type ResolvedColorTheme = Exclude<ColorThemePreference, 'system'>;

export function isColorThemePreference(value: string | null): value is ColorThemePreference {
	return COLOR_THEME_PREFERENCES.includes(value as ColorThemePreference);
}

export function resolveColorTheme(
	preference: ColorThemePreference,
	prefersDark: boolean,
): ResolvedColorTheme {
	return preference === 'system'
		? prefersDark ? 'dark' : 'light'
		: preference;
}

export const COLOR_THEME_INIT_SCRIPT = `(() => {
	const root = document.documentElement;
	let preference = 'system';

	try {
		const savedPreference = window.localStorage.getItem('${COLOR_THEME_STORAGE_KEY}');
		if (savedPreference === 'light' || savedPreference === 'dark') {
			preference = savedPreference;
		}
	} catch {}

	const resolvedTheme = preference === 'system'
		? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		: preference;

	root.dataset.theme = resolvedTheme;
	root.dataset.themePreference = preference;
	root.style.colorScheme = resolvedTheme;
})();`;
