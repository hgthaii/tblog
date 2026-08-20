import { Particles } from './Particles';
import type { ParticleMotion } from './Particles';
import { Fireworks } from './Fireworks';

export interface IconSceneDefinition {
	hero: string;
	accent?: string;
	signature?: string;
	particles: readonly string[];
	particleCount?: number;
	particleMotion?: ParticleMotion;
	fireworks?: boolean;
}

export function IconScene({ scene }: { scene: IconSceneDefinition }) {
	return (
		<>
			<span className="seasonal-scene-icon seasonal-scene-icon--hero">{scene.hero}</span>
			{scene.accent && (
				<span className="seasonal-scene-icon seasonal-scene-icon--accent">
					{scene.accent}
				</span>
			)}
			{scene.signature && (
				<span className="seasonal-scene-signature">{scene.signature}</span>
			)}
			<span className="seasonal-scene-line" />
			{scene.fireworks ? (
				<Fireworks />
			) : (
				<Particles
					symbols={scene.particles}
					count={scene.particleCount}
					motion={scene.particleMotion}
				/>
			)}
		</>
	);
}
