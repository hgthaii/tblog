import Link from 'next/link';

export default function NotFound() {
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
			<h1 style={{ fontSize: '6rem', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-blue)' }}>404</h1>
			<h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Page Not Found</h2>
			<p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
				The page you are looking for doesn't exist or has been moved.
			</p>
			<Link
				href="/"
				style={{
					padding: '12px 32px',
					background: 'var(--text-primary)',
					color: '#000',
					border: 'none',
					borderRadius: '100px',
					fontWeight: 600,
					textDecoration: 'none'
				}}
			>
				Go Back Home
			</Link>
		</div>
	);
}
