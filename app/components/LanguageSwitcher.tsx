'use client';

import { useEffect, useState } from 'react';
import { Locale } from '../lib/translations';
import { useLocale } from '../lib/LocaleContext';

export default function LanguageSwitcher() {
	const { locale, setLocale } = useLocale();
	const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const nextState = window.scrollY > 10;
			setIsHiddenOnScroll((prev) => (prev === nextState ? prev : nextState));
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div
			className={`fixed z-50 glass-card flex p-0.5 rounded-lg overflow-hidden right-[max(12px,env(safe-area-inset-right))] top-[max(12px,env(safe-area-inset-top))] md:right-6 md:top-6 transition-all duration-200 ${
				isHiddenOnScroll ? 'opacity-0 -translate-y-2 pointer-events-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto' : 'opacity-100 translate-y-0'
			}`}
		>
			{(['en', 'vi'] as const).map((lang) => (
				<button
					key={lang}
					onClick={() => setLocale(lang as Locale)}
					title={lang === 'en' ? 'English' : 'Tiếng Việt'}
					className={`px-2.5 py-1.5 text-[10px] font-semibold tracking-wider transition-all duration-200 cursor-pointer rounded-md min-w-9 ${locale === lang
						? 'bg-[rgba(255,255,255,0.06)] text-heading'
						: 'text-foreground hover:text-heading'
						}`}
				>
					{lang}
				</button>
			))}
		</div>
	);
}
