'use client';

import ErrorState from './components/ErrorState';
import ThemeToggle from './components/ThemeToggle';
import { COLOR_THEME_INIT_SCRIPT } from './lib/color-theme';
import { content, SITE_CONFIG } from './lib/config';
import { LocaleProvider } from './lib/LocaleContext';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html
			lang={SITE_CONFIG.locale.code}
			data-theme="system"
			data-theme-preference="system"
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: COLOR_THEME_INIT_SCRIPT }} />
			</head>
			<body>
				<LocaleProvider>
					<ErrorState
						code="500"
						title={content.errors.globalError.title}
						description={content.errors.globalError.description}
						onRetry={reset}
					/>
					<ThemeToggle />
				</LocaleProvider>
			</body>
		</html>
	);
}
