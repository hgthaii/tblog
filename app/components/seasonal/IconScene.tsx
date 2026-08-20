import { Particles } from './Particles';

export interface IconSceneDefinition {
	hero: string;
	accent?: string;
	signature?: string;
	particles: readonly string[];
	particleCount?: number;
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
			<Particles symbols={scene.particles} count={scene.particleCount} />
		</>
	);
}
