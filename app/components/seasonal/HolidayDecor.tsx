import type { HolidayThemeName } from '../../lib/seasonal-theme';
import { IconScene, type IconSceneDefinition } from './IconScene';

const HOLIDAY_SCENES: Record<HolidayThemeName, IconSceneDefinition> = {
	'national-day': {
		hero: '🇻🇳',
		accent: '★',
		signature: '2·9',
		particles: ['·', '✦', '★'],
		particleCount: 5,
	},
	'mid-autumn': {
		hero: '🌕',
		accent: '🏮',
		particles: ['·', '✦'],
		particleCount: 5,
	},
	christmas: {
		hero: '🎄',
		accent: '✦',
		signature: '25·12',
		particles: ['❄︎', '·'],
	},
	'new-year': {
		hero: '✦',
		accent: '＊',
		signature: '01·01',
		particles: ['·', '✧', '＊'],
	},
	tet: {
		hero: '🌼',
		accent: '🧧',
		particles: ['·', '✿'],
		particleCount: 5,
	},
	'children-day': {
		hero: '🎈',
		accent: '🪁',
		signature: '01·06',
		particles: ['·', '○'],
		particleCount: 4,
	},
	'reunification-day': {
		hero: '🇻🇳',
		accent: '✦',
		signature: '30·4 / 1·5',
		particles: ['·', '✦'],
		particleCount: 5,
	},
};

export function HolidayDecor({ theme }: { theme: HolidayThemeName }) {
	return <IconScene scene={HOLIDAY_SCENES[theme]} />;
}
