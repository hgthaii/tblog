import type {
	SeasonalThemeName,
	SeasonThemeName,
} from '../../lib/seasonal-theme';
import { HolidayDecor } from './HolidayDecor';
import { SeasonDecor } from './SeasonDecor';

const SEASONS = new Set<SeasonThemeName>(['spring', 'summer', 'autumn', 'winter']);
const isSeasonTheme = (theme: SeasonalThemeName): theme is SeasonThemeName =>
	SEASONS.has(theme as SeasonThemeName);

export function SeasonalDecor({ theme }: { theme: SeasonalThemeName }) {
	if (isSeasonTheme(theme)) {
		return <SeasonDecor theme={theme} />;
	}

	return <HolidayDecor theme={theme} />;
}
