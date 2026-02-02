'use client';

import Link from 'next/link';
import { useLocale } from '../lib/LocaleContext';
import useSWR from 'swr';
import { API_BASE_URL } from '../lib/config';

interface Skill {
	id: number;
	name: string;
	description: string;
	icon: string;
	proficiency: number;
	type: string;
}

interface GroupedSkills {
	[key: string]: Skill[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ProficiencyBar({ value }: { value: number }) {
	return (
		<div style={{ width: '100%', height: '1px', background: 'var(--border)', position: 'relative' }}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					height: '100%',
					width: `${value}%`,
					background: 'var(--text-tertiary)',
					opacity: 0.5
				}}
			/>
		</div>
	);
}

export default function SkillsPage() {
	const { t } = useLocale();
	const { data: groupedSkills, isLoading } = useSWR<GroupedSkills>(`${API_BASE_URL}/api/v1/skills`, fetcher);

	return (
		<>
			<div className="container" style={{ maxWidth: '600px' }}>
				<header style={{ marginBottom: '100px' }}>
					<Link href="/" style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 400 }}>
						← {t('nav.index')}
					</Link>
					<h1 style={{ marginTop: '40px', fontSize: '3.5rem', fontWeight: 300, color: 'var(--text-primary)' }}>{t('skills.title')}</h1>
					<p style={{ marginTop: '24px', color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.8 }}>
						{t('skills.subtitle')}
					</p>
				</header>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
					{isLoading ? (
						<p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>sys.loading...</p>
					) : groupedSkills && Object.entries(groupedSkills).map(([type, skills]) => (
						<section key={type}>
							<h2 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '32px' }}>
								{type.toLowerCase()}
							</h2>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								{(skills as Skill[]).map((skill: Skill) => (
									<div key={skill.id} style={{ padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
											<h3 style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-primary)' }}>{skill.name.toLowerCase()}</h3>
											<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{skill.proficiency}%</span>
										</div>
										<ProficiencyBar value={skill.proficiency} />
										{skill.description && (
											<p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '20px', lineHeight: 1.8, fontWeight: 300 }}>
												{skill.description.toLowerCase()}
											</p>
										)}
									</div>
								))}
							</div>
						</section>
					))}
				</div>
			</div>

			<div style={{ position: 'fixed', bottom: '60px', right: '60px' }}>
				<Link href="/" className="nav-link" style={{ fontSize: '0.7rem' }}>
					{t('nav.esc')}
				</Link>
			</div>
		</>
	);
}
