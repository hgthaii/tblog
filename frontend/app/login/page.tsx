'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DockNav from '@/components/DockNav';
import { API_BASE_URL } from '../lib/config';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ username, password }),
			});

			if (res.ok) {
				// Successful login
				// Since we are using Session cookies, the browser will handle it.
				router.push('/admin');
			} else {
				const data = await res.json();
				setError(data.message || 'Invalid username or password');
			}
		} catch (err) {
			setError('An error occurred during login. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '24px'
			}}>
				<div style={{
					width: '100%',
					maxWidth: '400px',
					background: 'var(--glass-bg)',
					backdropFilter: 'blur(var(--glass-blur))',
					WebkitBackdropFilter: 'blur(var(--glass-blur))',
					borderRadius: 'var(--radius-lg)',
					border: '1px solid var(--glass-border)',
					padding: '48px',
					boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
				}}>
					<div style={{ textAlign: 'center', marginBottom: '40px' }}>
						<h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.04em' }}>Admin Login</h1>
						<p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
							System Terminal Access
						</p>
					</div>

					<form onSubmit={handleLogin}>
						<div style={{ marginBottom: '24px' }}>
							<label style={{
								display: 'block',
								fontSize: '0.75rem',
								fontWeight: 700,
								color: 'var(--text-tertiary)',
								textTransform: 'uppercase',
								letterSpacing: '0.1em',
								marginBottom: '10px'
							}}>
								Username
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								style={{
									width: '100%',
									padding: '14px 18px',
									background: 'rgba(255, 255, 255, 0.03)',
									border: '1px solid var(--glass-border)',
									borderRadius: 'var(--radius-md)',
									color: '#fff',
									fontSize: '1rem',
									outline: 'none',
									transition: 'all 0.2s ease'
								}}
								placeholder="admin"
								required
							/>
						</div>

						<div style={{ marginBottom: '32px' }}>
							<label style={{
								display: 'block',
								fontSize: '0.75rem',
								fontWeight: 700,
								color: 'var(--text-tertiary)',
								textTransform: 'uppercase',
								letterSpacing: '0.1em',
								marginBottom: '10px'
							}}>
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								style={{
									width: '100%',
									padding: '14px 18px',
									background: 'rgba(255, 255, 255, 0.03)',
									border: '1px solid var(--glass-border)',
									borderRadius: 'var(--radius-md)',
									color: '#fff',
									fontSize: '1rem',
									outline: 'none',
									transition: 'all 0.2s ease'
								}}
								placeholder="••••••••"
								required
							/>
						</div>

						{error && (
							<div style={{
								background: 'rgba(239, 68, 68, 0.05)',
								border: '1px solid rgba(239, 68, 68, 0.2)',
								color: '#ef4444',
								padding: '14px',
								borderRadius: 'var(--radius-md)',
								fontSize: '0.85rem',
								marginBottom: '24px'
							}}>
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							style={{
								width: '100%',
								padding: '16px',
								background: isLoading ? 'var(--text-tertiary)' : 'var(--text-primary)',
								color: '#000',
								border: 'none',
								borderRadius: 'var(--radius-md)',
								fontWeight: 700,
								fontSize: '0.95rem',
								cursor: isLoading ? 'not-allowed' : 'pointer',
								transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
							}}
						>
							{isLoading ? 'Authenticating...' : 'Sign In'}
						</button>
					</form>

					<div style={{ marginTop: '32px', textAlign: 'center' }}>
						<Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 500 }}>
							← Back to Portfolio
						</Link>
					</div>
				</div>
			</div>

			<DockNav />
		</>
	);
}
