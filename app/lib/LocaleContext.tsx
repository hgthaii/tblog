'use client';

import React, { createContext, useContext } from "react";
import { content, LocaleContent } from "./config";

type LocaleContextValue = {
	content: LocaleContent;
	t: (path: string) => string;
}

const translate = (path: string) => {
	const keys = path.split('.');
	let result: Record<string, unknown> | string | unknown = content;

	for (const key of keys) {
		if (result && typeof result === 'object' && key in result) {
			result = (result as Record<string, unknown>)[key];
		} else {
			return path;
		}
	}

	return typeof result === 'string' ? result : path;
};

const defaultLocale: LocaleContextValue = {
	content,
	t: translate,
};

const LocaleContext = createContext<LocaleContextValue>(defaultLocale);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
	return (
		<LocaleContext.Provider value={defaultLocale}>
			{children}
		</LocaleContext.Provider>
	);
}

export function useLocale() {
	return useContext(LocaleContext);
}
