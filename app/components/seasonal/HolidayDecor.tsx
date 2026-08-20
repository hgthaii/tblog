import type { HolidayThemeName } from '../../lib/seasonal-theme';
import { IconScene, type IconSceneDefinition } from './IconScene';

const HOLIDAY_SCENES: Record<HolidayThemeName, IconSceneDefinition> = {
	'national-day': {
		hero: '🇻🇳',
		accent: '★',
		signature: '2·9',
		particles: ['▰', '▪', '·'],
		particleCount: 8,
		particleMotion: 'confetti',
	},
	'mid-autumn': {
		hero: '🌕',
		accent: '🏮',
		particles: ['•'],
		particleCount: 8,
		particleMotion: 'firefly',
	},
	christmas: {
		hero: '🎄',
		accent: '✦',
		signature: '25·12',
		particles: ['❄︎', '·'],
		particleCount: 10,
		particleMotion: 'snow',
	},
	'new-year': {
		hero: '✦',
		accent: '＊',
		signature: '01·01',
		particles: ['▰', '▪', '·'],
		particleCount: 8,
		particleMotion: 'confetti',
	},
	tet: {
		hero: '🌼',
		accent: '🧧',
		particles: ['·'],
		fireworks: true,
	},
	'children-day': {
		hero: '🎈',
		accent: '🪁',
		signature: '01·06',
		particles: ['▰', '▪', '·'],
		particleCount: 8,
		particleMotion: 'confetti',
	},
	'reunification-day': {
		hero: '🇻🇳',
		accent: '✦',
		signature: '30·4 / 1·5',
		particles: ['▰', '▪', '·'],
		particleCount: 8,
		particleMotion: 'confetti',
	},
};

export function HolidayDecor({ theme }: { theme: HolidayThemeName }) {
	return <IconScene scene={HOLIDAY_SCENES[theme]} />;
}
