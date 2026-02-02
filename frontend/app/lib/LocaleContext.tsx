'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations } from './translations';

type LocaleContextType = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>('en');

	useEffect(() => {
		const savedLocale = localStorage.getItem('locale') as Locale;
		if (savedLocale && (savedLocale === 'en' || savedLocale === 'vi')) {
			setLocaleState(savedLocale);
		}
	}, []);

	const setLocale = (newLocale: Locale) => {
		setLocaleState(newLocale);
		localStorage.setItem('locale', newLocale);
	};

	const t = (path: string) => {
		const keys = path.split('.');
		let result: any = translations[locale];
		for (const key of keys) {
			if (result[key]) {
				result = result[key];
			} else {
				return path;
			}
		}
		return result as string;
	};

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
