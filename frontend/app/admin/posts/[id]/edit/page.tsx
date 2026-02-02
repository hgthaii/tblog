'use client';

import { useEffect, useState } from 'react';
import PostForm from '@/components/admin/PostForm';
import { API_BASE_URL } from '../../../../lib/config';

export default function EditPostPage({ params }: { params: { id: string } }) {
	const [post, setPost] = useState<any>(null);

	useEffect(() => {
		const fetchPost = async () => {
			// We need a GET by ID for editing easily, or we can use slug. 
			// But the endpoint we have is GET /api/v1/posts/{slug}.
			// Let's add GET /api/v1/posts/id/{id} or similar if needed.
			// For now, I'll fetch ALL posts and find it, or use slug if I had it.
			// Better: Update Backend to support GET by ID.
			const res = await fetch(`${API_BASE_URL}/api/v1/posts`, {
				credentials: 'include'
			});
			if (res.ok) {
				const data = await res.json();
				const found = data.content.find((p: any) => p.id === parseInt(params.id));

				// Now fetch full detail for content
				if (found) {
					const detailRes = await fetch(`${API_BASE_URL}/api/v1/posts/${found.slug}`, {
						credentials: 'include'
					});
					if (detailRes.ok) setPost(await detailRes.json());
				}
			}
		};
		fetchPost();
	}, [params.id]);

	if (!post) return <div style={{ color: '#fff', padding: '100px', textAlign: 'center' }}>Loading post data...</div>;

	return <PostForm initialData={post} isEdit />;
}
