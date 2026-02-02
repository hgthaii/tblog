'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_BASE_URL } from '../../lib/config';

export default function AdminSkillManagement() {
	const [skills, setSkills] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingSkill, setEditingSkill] = useState<any>(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		icon: '',
		proficiency: 80,
		type: 'LANGUAGE'
	});
	const router = useRouter();

	const skillTypes = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE', 'OTHER'];

	const fetchSkills = async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/api/v1/skills/list`, {
				credentials: 'include'
			});
			if (res.ok) {
				setSkills(await res.json());
			} else if (res.status === 401) {
				router.push('/login');
			}
		} catch (err) {
			console.error('Failed to fetch skills:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchSkills();
	}, []);

	const handleEdit = (skill: any) => {
		setEditingSkill(skill);
		setFormData({
			name: skill.name,
			description: skill.description || '',
			icon: skill.icon || '',
			proficiency: skill.proficiency,
			type: skill.type
		});
	};

	const handleCancel = () => {
		setEditingSkill(null);
		setFormData({ name: '', description: '', icon: '', proficiency: 80, type: 'LANGUAGE' });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const url = editingSkill
			? `${API_BASE_URL}/api/v1/skills/${editingSkill.id}`
			: `${API_BASE_URL}/api/v1/skills`;
		const method = editingSkill ? 'PUT' : 'POST';

		try {
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData)
			});
			if (res.ok) {
				fetchSkills();
				handleCancel();
			} else {
				alert('Failed to save skill');
			}
		} catch (err) {
			alert('Error saving skill');
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Delete this skill?')) return;
		try {
			const res = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (res.ok) fetchSkills();
		} catch (err) {
			alert('Error deleting skill');
		}
	};

	return (
		<AdminLayout>
			<div style={{ marginBottom: '60px' }}>
				<h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>Technical Arsenal</h1>
				<p style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>Registry of core competencies and technical proficiency levels.</p>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '60px' }}>
				{/* List Section */}
				<div style={{
					borderTop: '1px solid var(--border)'
				}}>
					<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
						<thead>
							<tr>
								<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Designation</th>
								<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Classification</th>
								<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Proficiency</th>
								<th style={{ padding: '24px 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr><td colSpan={4} style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Initializing database...</td></tr>
							) : skills.map((skill) => (
								<tr key={skill.id} style={{ borderTop: '1px solid var(--border)' }}>
									<td style={{ padding: '20px 0' }}>
										<div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{skill.name}</div>
									</td>
									<td style={{ padding: '20px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
										{skill.type}
									</td>
									<td style={{ padding: '20px 0' }}>
										<div style={{ width: '120px', height: '2px', background: 'rgba(255, 255, 255, 0.05)' }}>
											<div style={{ width: `${skill.proficiency}%`, height: '100%', background: 'rgba(255, 255, 255, 0.4)' }} />
										</div>
									</td>
									<td style={{ padding: '20px 0', textAlign: 'right' }}>
										<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
											<button onClick={() => handleEdit(skill)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
											<button onClick={() => handleDelete(skill.id)} style={{ background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Form Section */}
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '40px',
					height: 'fit-content'
				}}>
					<div>
						<h2 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
							{editingSkill ? 'Refine Skill' : 'New Registry'}
						</h2>
						<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
							<div>
								<span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Name</span>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required
									style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: '#fff', fontSize: '0.9rem' }}
								/>
							</div>
							<div>
								<span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Classification</span>
								<select
									value={formData.type}
									onChange={(e) => setFormData({ ...formData, type: e.target.value })}
									style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: '#fff', fontSize: '0.9rem', appearance: 'none', outline: 'none' }}
								>
									{skillTypes.map(t => <option key={t} value={t} style={{ background: '#000' }}>{t}</option>)}
								</select>
							</div>
							<div>
								<span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Proficiency ({formData.proficiency}%)</span>
								<input
									type="range"
									min="0"
									max="100"
									value={formData.proficiency}
									onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
									style={{ width: '100%', accentColor: 'var(--text-primary)' }}
								/>
							</div>
							<div>
								<span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Description</span>
								<textarea
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									style={{ width: '100%', height: '80px', background: 'transparent', border: '1px solid var(--border)', color: '#fff', resize: 'none', padding: '10px', fontSize: '0.85rem' }}
								/>
							</div>

							<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
								<button type="submit" className="bento-card" style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
									{editingSkill ? 'Confirm' : 'Commit'}
								</button>
								{editingSkill && (
									<button type="button" onClick={handleCancel} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid transparent', color: 'var(--text-tertiary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}>
										Discard
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
