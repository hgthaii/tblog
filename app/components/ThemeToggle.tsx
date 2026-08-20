'use client';

import { Moon, Sun } from 'lucide-react';
import { PullCord } from 'pullcord';
import { useSyncExternalStore } from 'react';
import {
	COLOR_THEME_STORAGE_KEY,
	isColorThemePreference,
	resolveColorTheme,
	type ColorThemePreference,
	type ResolvedColorTheme,
} from '../lib/color-theme';
import { useLocale } from '../lib/LocaleContext';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
const DESKTOP_PULLCORD_QUERY = '(min-width: 640px) and (hover: hover) and (pointer: fine)';
const COLOR_THEME_CHANGE_EVENT = 'tblog-color-theme-change';

function applyColorTheme(preference: ColorThemePreference) {
	const root = document.documentElement;
	const resolvedTheme = resolveColorTheme(
		preference,
		window.matchMedia(DARK_MODE_QUERY).matches,
	);

	root.dataset.theme = resolvedTheme;
	root.dataset.themePreference = preference;
	root.style.colorScheme = resolvedTheme;
}

function getResolvedColorTheme(): ResolvedColorTheme {
	return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function subscribeToColorTheme(onStoreChange: () => void) {
	const colorScheme = window.matchMedia(DARK_MODE_QUERY);
	const handleThemeChange = () => onStoreChange();
	const handleSystemChange = () => {
		if (document.documentElement.dataset.themePreference === 'system') {
			applyColorTheme('system');
			onStoreChange();
		}
	};
	const handleStorageChange = (event: StorageEvent) => {
		if (event.key !== COLOR_THEME_STORAGE_KEY && event.key !== null) return;

		const storedPreference = isColorThemePreference(event.newValue)
			? event.newValue
			: 'system';
		applyColorTheme(storedPreference);
		onStoreChange();
	};

	window.addEventListener(COLOR_THEME_CHANGE_EVENT, handleThemeChange);
	window.addEventListener('storage', handleStorageChange);
	colorScheme.addEventListener('change', handleSystemChange);

	return () => {
		window.removeEventListener(COLOR_THEME_CHANGE_EVENT, handleThemeChange);
		window.removeEventListener('storage', handleStorageChange);
		colorScheme.removeEventListener('change', handleSystemChange);
	};
}

function subscribeToDesktopPullCord(onStoreChange: () => void) {
	const desktopQuery = window.matchMedia(DESKTOP_PULLCORD_QUERY);
	desktopQuery.addEventListener('change', onStoreChange);

	return () => desktopQuery.removeEventListener('change', onStoreChange);
}

function isDesktopPullCord() {
	return window.matchMedia(DESKTOP_PULLCORD_QUERY).matches;
}

export default function ThemeToggle() {
	const { t } = useLocale();
	const resolvedTheme = useSyncExternalStore<ResolvedColorTheme>(
		subscribeToColorTheme,
		getResolvedColorTheme,
		() => 'light',
	);
	const showPullCord = useSyncExternalStore(
		subscribeToDesktopPullCord,
		isDesktopPullCord,
		() => false,
	);
	const nextTheme: ResolvedColorTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
	const currentLabel = t(`theme.${resolvedTheme}`);
	const nextLabel = t(`theme.${nextTheme}`);
	const accessibleLabel = `${t('theme.label')}: ${currentLabel}. ${t('theme.switchTo')} ${nextLabel}`;

	const handleToggle = () => {
		try {
			window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, nextTheme);
		} catch {}

		applyColorTheme(nextTheme);
		window.dispatchEvent(new Event(COLOR_THEME_CHANGE_EVENT));
	};

	return (
		showPullCord ? (
			<PullCord
				className="theme-pullcord"
				onPull={handleToggle}
				pulled={resolvedTheme === 'light'}
				ariaLabel={accessibleLabel}
			/>
		) : (
			<div className="theme-toggle-shell">
				<button
					id="color-theme-toggle"
					type="button"
					className="theme-toggle"
					onClick={handleToggle}
					role="switch"
					aria-checked={resolvedTheme === 'dark'}
					aria-label={accessibleLabel}
					title={accessibleLabel}
				>
					<span className="theme-toggle-thumb" aria-hidden="true">
						<Sun className="theme-toggle-icon theme-toggle-icon--light" />
						<Moon className="theme-toggle-icon theme-toggle-icon--dark" />
					</span>
				</button>
			</div>
		)
	);
}
