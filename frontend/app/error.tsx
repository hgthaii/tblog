'use client';

import Link from 'next/link';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div style={{
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			textAlign: 'center',
			padding: '24px'
		}}>
			<h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>Oops!</h1>
			<p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
				Something went wrong on our end. We've been notified and are looking into it.
			</p>
			<div style={{ display: 'flex', gap: '16px' }}>
				<button
					onClick={() => reset()}
					style={{
						padding: '12px 24px',
						background: 'var(--text-primary)',
						color: '#000',
						border: 'none',
						borderRadius: '100px',
						fontWeight: 600,
						cursor: 'pointer'
					}}
				>
					Try Again
				</button>
				<Link
					href="/"
					style={{
						padding: '12px 24px',
						background: 'var(--bg-card)',
						color: '#fff',
						border: '1px solid var(--border)',
						borderRadius: '100px',
						fontWeight: 600,
						textDecoration: 'none'
					}}
				>
					Go Home
				</Link>
			</div>
		</div>
	);
}
