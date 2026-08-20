import type { CSSProperties } from 'react';

const PARTICLE_POSITIONS = [
	{ x: '8%', y: '24%', delay: '-3.2s', duration: '15.8s', size: '0.72rem' },
	{ x: '18%', y: '72%', delay: '-8.1s', duration: '18.6s', size: '0.58rem' },
	{ x: '37%', y: '17%', delay: '-5.8s', duration: '16.2s', size: '0.5rem' },
	{ x: '61%', y: '76%', delay: '-1.7s', duration: '20.1s', size: '0.64rem' },
	{ x: '84%', y: '37%', delay: '-7.6s', duration: '17.2s', size: '0.54rem' },
	{ x: '93%', y: '82%', delay: '-4.9s', duration: '19.5s', size: '0.46rem' },
	{ x: '28%', y: '46%', delay: '-10.2s', duration: '21.4s', size: '0.48rem' },
	{ x: '49%', y: '57%', delay: '-6.4s', duration: '17.8s', size: '0.62rem' },
	{ x: '71%', y: '9%', delay: '-12.1s', duration: '22.2s', size: '0.44rem' },
	{ x: '79%', y: '66%', delay: '-2.8s', duration: '16.9s', size: '0.56rem' },
];

export type ParticleMotion = 'drift' | 'snow' | 'firefly' | 'confetti';

const particleStyle = (particle: (typeof PARTICLE_POSITIONS)[number], index: number) => ({
	'--seasonal-x': particle.x,
	'--seasonal-y': particle.y,
	'--seasonal-delay': particle.delay,
	'--seasonal-duration': particle.duration,
	'--seasonal-size': particle.size,
	'--seasonal-sway': index % 2 === 0 ? '1.4rem' : '-1.4rem',
	'--seasonal-confetti-sway': index % 2 === 0 ? '3.2rem' : '-3.2rem',
	'--seasonal-rotation': index % 2 === 0 ? '280deg' : '-280deg',
}) as CSSProperties;

export function Particles({
	symbols,
	count = PARTICLE_POSITIONS.length,
	motion = 'drift',
}: {
	symbols: readonly string[];
	count?: number;
	motion?: ParticleMotion;
}) {
	return PARTICLE_POSITIONS.slice(0, count).map((particle, index) => (
		<span
			key={index}
			className={`seasonal-scene-particle seasonal-scene-particle--${motion}`}
			style={particleStyle(particle, index)}
		>
			{symbols[index % symbols.length]}
		</span>
	));
}
