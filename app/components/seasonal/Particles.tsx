import type { CSSProperties } from 'react';

const PARTICLE_POSITIONS = [
	{ x: '8%', y: '24%', delay: '-3.2s', duration: '15.8s', size: '0.72rem' },
	{ x: '18%', y: '72%', delay: '-8.1s', duration: '18.6s', size: '0.58rem' },
	{ x: '37%', y: '17%', delay: '-5.8s', duration: '16.2s', size: '0.5rem' },
	{ x: '61%', y: '76%', delay: '-1.7s', duration: '20.1s', size: '0.64rem' },
	{ x: '84%', y: '37%', delay: '-7.6s', duration: '17.2s', size: '0.54rem' },
	{ x: '93%', y: '82%', delay: '-4.9s', duration: '19.5s', size: '0.46rem' },
];

const particleStyle = (particle: (typeof PARTICLE_POSITIONS)[number]) => ({
	'--seasonal-x': particle.x,
	'--seasonal-y': particle.y,
	'--seasonal-delay': particle.delay,
	'--seasonal-duration': particle.duration,
	'--seasonal-size': particle.size,
}) as CSSProperties;

export function Particles({ symbols, count = PARTICLE_POSITIONS.length }: {
	symbols: readonly string[];
	count?: number;
}) {
	return PARTICLE_POSITIONS.slice(0, count).map((particle, index) => (
		<span
			key={index}
			className="seasonal-scene-particle"
			style={particleStyle(particle)}
		>
			{symbols[index % symbols.length]}
		</span>
	));
}
