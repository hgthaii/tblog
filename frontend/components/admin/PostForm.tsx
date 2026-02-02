'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { API_BASE_URL } from '../../app/lib/config';

interface PostFormProps {
	initialData?: any;
	isEdit?: boolean;
}

export default function PostForm({ initialData, isEdit }: PostFormProps) {
	const [title, setTitle] = useState(initialData?.title || '');
	const [slug, setSlug] = useState(initialData?.slug || '');
	const [content, setContent] = useState(initialData?.content || '');
	const [category, setCategory] = useState(initialData?.categorySlug || '');
	const [tags, setTags] = useState(initialData?.tags || '');
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<any[]>([]);
	const router = useRouter();

	useEffect(() => {
		// Fetch categories for selection
		const fetchCategories = async () => {
			const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
				credentials: 'include'
			});
			if (res.ok) setCategories(await res.json());
		};
		fetchCategories();
	}, []);

	// Simple slug generation from title
	const generateSlug = (text: string) => {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setTitle(val);
		if (!isEdit) setSlug(generateSlug(val));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const payload = {
			title,
			slug,
			content,
			categorySlug: category,
			tags,
			authorName: 'admin' // Default for now
		};

		const url = isEdit
			? `${API_BASE_URL}/api/v1/posts/${initialData.id}`
			: `${API_BASE_URL}/api/v1/posts`;

		const method = isEdit ? 'PUT' : 'POST';

		try {
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(payload)
			});

			if (res.ok) {
				router.push('/admin/posts');
			} else {
				alert('Failed to save post');
			}
		} catch (err) {
			alert('Error saving post');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AdminLayout>
			<div style={{ marginBottom: '60px' }}>
				<h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
					{isEdit ? 'Refine Article' : 'Compose Publication'}
				</h1>
				<p style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>
					{isEdit ? `Modifying index: ${initialData.slug}` : 'Begin a new recording in the system database'}
				</p>
			</div>

			<form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '60px' }}>
				{/* Editor Area */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
					<div>
						<label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Title</label>
						<input
							type="text"
							value={title}
							onChange={handleTitleChange}
							placeholder="Entry Designation"
							style={{
								width: '100%',
								fontSize: '1.5rem',
								fontWeight: 700,
								background: 'transparent',
								border: 'none',
								borderBottom: '1px solid var(--border)',
								padding: '8px 0',
								color: '#fff',
								outline: 'none'
							}}
							required
						/>
					</div>

					<div style={{ minHeight: '600px' }}>
						<label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Content</label>
						<MarkdownEditor
							value={content}
							onChange={(val) => setContent(val || '')}
						/>
					</div>
				</div>

				{/* Sidebar Options */}
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '40px',
					height: 'fit-content'
				}}>
					<div>
						<label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Configuration</label>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
							<div>
								<span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>URL Slug</span>
								<input
									type="text"
									value={slug}
									onChange={(e) => setSlug(e.target.value)}
									style={{
										width: '100%',
										padding: '10px 0',
										background: 'transparent',
										border: 'none',
										borderBottom: '1px solid var(--border)',
										color: '#fff',
										fontSize: '0.9rem',
										fontFamily: 'var(--font-mono)'
									}}
								/>
							</div>

							<div>
								<span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</span>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									style={{
										width: '100%',
										padding: '10px 0',
										background: 'transparent',
										border: 'none',
										borderBottom: '1px solid var(--border)',
										color: '#fff',
										fontSize: '0.9rem',
										appearance: 'none',
										outline: 'none'
									}}
								>
									<option value="" style={{ background: '#000' }}>Unassigned</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.slug} style={{ background: '#000' }}>{cat.name}</option>
									))}
								</select>
							</div>

							<div>
								<span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Keywords</span>
								<input
									type="text"
									value={tags}
									onChange={(e) => setTags(e.target.value)}
									placeholder="Separated by comma"
									style={{
										width: '100%',
										padding: '10px 0',
										background: 'transparent',
										border: 'none',
										borderBottom: '1px solid var(--border)',
										color: '#fff',
										fontSize: '0.9rem'
									}}
								/>
							</div>
						</div>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
						<button
							type="submit"
							disabled={isLoading}
							className="bento-card"
							style={{
								width: '100%',
								padding: '16px',
								display: 'flex',
								justifyContent: 'center',
								fontWeight: 700,
								fontSize: '0.85rem',
								cursor: isLoading ? 'not-allowed' : 'pointer'
							}}
						>
							{isLoading ? 'Processing...' : (isEdit ? 'Confirm Modifications' : 'Commit Publication')}
						</button>

						<button
							type="button"
							onClick={() => router.back()}
							style={{
								width: '100%',
								padding: '12px',
								background: 'transparent',
								border: '1px solid transparent',
								color: 'var(--text-tertiary)',
								fontSize: '0.85rem',
								cursor: 'pointer',
								fontWeight: 500
							}}
						>
							Discard Changes
						</button>
					</div>
				</div>
			</form>
		</AdminLayout>
	);
}
