'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { API_BASE_URL } from '../../app/lib/config';

// Load editor dynamically to avoid SSR issues
const MDEditor = dynamic(
	() => import('@uiw/react-md-editor'),
	{ ssr: false }
);

interface MarkdownEditorProps {
	value: string;
	onChange: (value: string | undefined) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
	const [isUploading, setIsUploading] = useState(false);

	const handleImageUpload = async (file: File) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append('file', file);

		try {
			const res = await fetch(`${API_BASE_URL}/api/v1/upload`, {
				method: 'POST',
				credentials: 'include',
				body: formData,
			});

			if (res.ok) {
				const data = await res.json();
				const imageUrl = data.url;
				const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;
				onChange(value + imageMarkdown);
			} else {
				alert('Failed to upload image');
			}
		} catch (err) {
			console.error('Upload error:', err);
			alert('Error uploading image');
		} finally {
			setIsUploading(false);
		}
	};

	const onPaste = async (event: React.ClipboardEvent) => {
		const items = event.clipboardData.items;
		for (let i = 0; i < items.length; i++) {
			if (items[i].type.indexOf('image') !== -1) {
				const file = items[i].getAsFile();
				if (file) handleImageUpload(file);
			}
		}
	};

	const onDrop = async (event: React.DragEvent) => {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files.length > 0 && files[0].type.indexOf('image') !== -1) {
			handleImageUpload(files[0]);
		}
	};

	return (
		<div
			data-color-mode="dark"
			onPaste={onPaste}
			onDrop={onDrop}
			style={{ minHeight: '500px' }}
		>
			{isUploading && (
				<div style={{
					position: 'absolute',
					top: 0, left: 0, right: 0, bottom: 0,
					background: 'rgba(0,0,0,0.5)',
					zIndex: 10,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 'var(--radius-sm)'
				}}>
					<div style={{ color: '#fff', fontWeight: 600 }}>Uploading Image...</div>
				</div>
			)}
			<MDEditor
				value={value}
				onChange={onChange}
				height={500}
				preview="live"
				style={{
					background: 'rgba(255, 255, 255, 0.02)',
					border: '1px solid var(--border)',
					borderRadius: 'var(--radius-sm)',
				}}
			/>
			<div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
				💡 Tip: Drag and drop or paste images directly into the editor.
			</div>
		</div>
	);
}
