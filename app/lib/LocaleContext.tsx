'use client';

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { Locale, translations } from "./translations";

type LocaleContextValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (path: string) => string;
}

const STORAGE_KEY = 'locale';
const LOCALE_EVENT = 'locale-change';

const isLocale = (value: string | null): value is Locale =>
	value === 'en' || value === 'vi';

const getLocaleSnapshot = (): Locale => {
	if (typeof window === 'undefined') return 'vi';

	const savedLocale = window.localStorage.getItem(STORAGE_KEY);
	return isLocale(savedLocale) ? savedLocale : 'vi';
};

const subscribeToLocale = (callback: () => void) => {
	if (typeof window === 'undefined') return () => undefined;

	const storageListener = (event: StorageEvent) => {
		if (event.key === STORAGE_KEY) callback();
	};

	const localeListener = () => callback();

	window.addEventListener('storage', storageListener);
	window.addEventListener(LOCALE_EVENT, localeListener);

	return () => {
		window.removeEventListener('storage', storageListener);
		window.removeEventListener(LOCALE_EVENT, localeListener);
	};
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
	const locale = useSyncExternalStore<Locale>(
		subscribeToLocale,
		getLocaleSnapshot,
		() => 'vi',
	);

	const setLocale = (newLocale: Locale) => {
		if (typeof window === 'undefined') return;

		window.localStorage.setItem(STORAGE_KEY, newLocale);
		window.dispatchEvent(new Event(LOCALE_EVENT));
	}

	const t = (path: string) => {
		const keys = path.split('.');
		let result: Record<string, unknown> | string | unknown = translations[locale];
		for (const key of keys) {
			if (result && typeof result === 'object' && key in result) {
				result = (result as Record<string, unknown>)[key];
			} else {
				return path;
			}
		}

		return typeof result === 'string' ? result : path;
	}

	return (
		<LocaleContext.Provider value={{ locale, setLocale, t }}>
			{children}
		</LocaleContext.Provider>
	);
}

export function useLocale() {
	const context = useContext(LocaleContext);
	if (context === undefined) {
		throw new Error('useLocale must be used within a LocaleProvider');
	}
	return context;
}
