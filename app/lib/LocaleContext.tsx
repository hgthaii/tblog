'use client';

import React, { createContext, useContext } from "react";
import { content, LocaleContent } from "./translations";

type LocaleContextValue = {
	content: LocaleContent;
	t: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
	const t = (path: string) => {
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
	}

	return (
		<LocaleContext.Provider value={{ content, t }}>
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
