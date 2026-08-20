import type { CSSProperties } from 'react';

const FIREWORKS = [
	{
		x: '76%',
		y: '20%',
		delay: '-1.1s',
		size: 'clamp(3.8rem, 8vw, 6rem)',
		distance: '-2.3rem',
		fadeDistance: '-2.7rem',
	},
	{
		x: '24%',
		y: '31%',
		delay: '-3.8s',
		size: 'clamp(2.8rem, 6vw, 4.6rem)',
		distance: '-1.8rem',
		fadeDistance: '-2.1rem',
	},
	{
		x: '62%',
		y: '68%',
		delay: '-5.4s',
		size: 'clamp(2.4rem, 5vw, 4rem)',
		distance: '-1.5rem',
		fadeDistance: '-1.8rem',
	},
] as const;

const RAY_ANGLES = Array.from({ length: 10 }, (_, index) => `${index * 36}deg`);

const fireworkStyle = (firework: (typeof FIREWORKS)[number]) => ({
	'--firework-x': firework.x,
	'--firework-y': firework.y,
	'--firework-delay': firework.delay,
	'--firework-size': firework.size,
	'--firework-distance': firework.distance,
	'--firework-fade-distance': firework.fadeDistance,
}) as CSSProperties;

export function Fireworks() {
	return (
		<div className="seasonal-fireworks">
			{FIREWORKS.map((firework, fireworkIndex) => (
				<span
					key={fireworkIndex}
					className="seasonal-firework"
					style={fireworkStyle(firework)}
				>
					{RAY_ANGLES.map((angle) => (
						<i
							key={angle}
							className="seasonal-firework-ray"
							style={{ '--firework-angle': angle } as CSSProperties}
						/>
					))}
				</span>
			))}
		</div>
	);
}
