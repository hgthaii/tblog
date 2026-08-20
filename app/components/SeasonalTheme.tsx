'use client';

import { useSyncExternalStore } from 'react';

import { SITE_CONFIG } from '../lib/config';
import { resolveSeasonalTheme, type SeasonalThemeName } from '../lib/seasonal-theme';
import { SeasonalDecor } from './seasonal/SeasonalDecor';

const subscribeToDate = (onDateChange: () => void) => {
	const timer = window.setInterval(onDateChange, 60 * 60 * 1000);
	return () => window.clearInterval(timer);
};

const getServerTheme = () => null;

export default function SeasonalTheme() {
	const theme = useSyncExternalStore<SeasonalThemeName | null>(
		subscribeToDate,
		() => resolveSeasonalTheme(new Date(), SITE_CONFIG.seasonalTheme.mode),
		getServerTheme,
	);

	if (!theme) return null;

	return (
		<div
			className={`seasonal-theme seasonal-theme--${theme}`}
			data-seasonal-theme={theme}
			aria-hidden="true"
		>
			<SeasonalDecor theme={theme} />
		</div>
	);
}
