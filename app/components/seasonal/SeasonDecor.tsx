import type { SeasonThemeName } from '../../lib/seasonal-theme';
import { IconScene, type IconSceneDefinition } from './IconScene';

const SEASON_SCENES: Record<SeasonThemeName, IconSceneDefinition> = {
	spring: {
		hero: '🌼',
		accent: '🌸',
		signature: '◇  ○',
		particles: ['·', '❀'],
		particleCount: 5,
	},
	summer: {
		hero: '🌻',
		accent: '🍂',
		particles: ['🍂', '·'],
		particleCount: 5,
	},
	autumn: {
		hero: '🍁',
		accent: '⌁',
		particles: ['🍁', '·'],
		particleCount: 5,
	},
	winter: {
		hero: '☃︎',
		accent: '❄︎',
		particles: ['❄︎', '·'],
	},
};

export function SeasonDecor({ theme }: { theme: SeasonThemeName }) {
	return <IconScene scene={SEASON_SCENES[theme]} />;
}
