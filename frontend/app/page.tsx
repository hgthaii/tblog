'use client';

import Link from 'next/link';
import { useLocale } from './lib/LocaleContext';
import { PenTool, Terminal, Github } from 'lucide-react';

export default function Home() {
	const { t, locale, setLocale } = useLocale();

	return (
		<main style={{
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			padding: '0 12%',
			position: 'relative'
		}}>
			{/* Sidebar Icon Dock */}
			<aside style={{
				position: 'fixed',
				left: '40px',
				top: '50%',
				transform: 'translateY(-50%)',
				display: 'flex',
				flexDirection: 'column',
				gap: '40px',
				zIndex: 100
			}}>
				<Link href="/blog" title={t('nav.writing')} className="icon-link">
					<PenTool size={20} strokeWidth={1.2} />
				</Link>
				<Link href="/skills" title={t('nav.portfolio')} className="icon-link">
					<Terminal size={20} strokeWidth={1.2} />
				</Link>
				<a href="https://github.com/hgthaii" target="_blank" rel="noopener noreferrer" title={t('nav.social')} className="icon-link">
					<Github size={20} strokeWidth={1.2} />
				</a>
			</aside>

			{/* Top Header: Switcher */}
			<div className="header-switcher" style={{
				position: 'absolute',
				top: '60px',
				left: '12%',
				right: '12%',
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'center',
				zIndex: 100
			}}>
				<div style={{ display: 'flex', gap: '24px' }}>
					<button
						onClick={() => setLocale('en')}
						style={{
							background: 'none',
							border: 'none',
							color: locale === 'en' ? 'var(--text-primary)' : 'var(--text-tertiary)',
							fontSize: '0.65rem',
							fontWeight: locale === 'en' ? 600 : 300,
							cursor: 'pointer',
							letterSpacing: '0.15em'
						}}
					>
						EN.
					</button>
					<button
						onClick={() => setLocale('vi')}
						style={{
							background: 'none',
							border: 'none',
							color: locale === 'vi' ? 'var(--text-primary)' : 'var(--text-tertiary)',
							fontSize: '0.65rem',
							fontWeight: locale === 'vi' ? 600 : 300,
							cursor: 'pointer',
							letterSpacing: '0.15em'
						}}
					>
						VI.
					</button>
				</div>
			</div>

			{/* Asymmetric Editorial Studio Layout */}
			<div style={{
				position: 'relative',
				zIndex: 5,
				width: '100%',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				padding: '0 12%',
				overflow: 'hidden'
			}} className="gallery-container">

				{/* Editorial Art: Subtle Right-Side Texture */}
				<div style={{
					position: 'absolute',
					right: '-5%',
					top: '50%',
					transform: 'translateY(-50%)',
					width: '45vw',
					height: '65vh',
					backgroundImage: 'url("/images/studio-art.png")',
					backgroundSize: 'contain',
					backgroundPosition: 'center right',
					backgroundRepeat: 'no-repeat',
					opacity: 0.1,
					zIndex: -1,
					filter: 'grayscale(100%) blur(1px)',
					pointerEvents: 'none'
				}} />

				<div style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '120px',
					width: '100%',
					maxWidth: '1200px',
					alignItems: 'center',
					justifyContent: 'space-between'
				}} className="main-grid">
					{/* Editorial Column 01: Core Content */}
					<div style={{ maxWidth: '540px' }}>
						<header>
							<span style={{
								fontSize: '0.65rem',
								color: 'var(--text-tertiary)',
								letterSpacing: '0.3em',
								textTransform: 'uppercase',
								display: 'block',
								marginBottom: '40px',
								fontWeight: 500
							}}>
								{t('home.intro')}
							</span>
							<h1 style={{
								fontSize: '5.5rem',
								fontWeight: 400,
								marginBottom: '32px',
								letterSpacing: '-0.08em',
								color: 'var(--text-primary)',
								marginLeft: '-6px',
								lineHeight: 0.9,
								transition: 'all 0.5s ease'
							}}>
								{t('home.name')}
							</h1>
							<p style={{
								fontSize: '1.2rem',
								color: 'var(--text-secondary)',
								maxWidth: '440px',
								lineHeight: 1.8,
								fontWeight: 300,
								letterSpacing: '-0.01em'
							}}>
								{t('home.bio')}
							</p>
						</header>
					</div>

					{/* Editorial Column 02: Floating Metadata */}
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '100px',
						alignItems: 'flex-start',
						marginTop: '60px'
					}} className="side-content">
						<div style={{ maxWidth: '280px' }}>
							<span style={{
								fontSize: '0.6rem',
								color: 'var(--text-tertiary)',
								textTransform: 'uppercase',
								letterSpacing: '0.2em',
								fontWeight: 600,
								display: 'block',
								marginBottom: '20px'
							}}>
								{t('home.featured')} <span style={{ opacity: 0.3, marginLeft: '8px' }}>/ 01</span>
							</span>
							<p style={{
								fontSize: '0.85rem',
								color: 'var(--text-secondary)',
								fontWeight: 300,
								lineHeight: 1.7
							}}>
								{t('home.activity')}
							</p>
						</div>

						<div style={{ maxWidth: '280px' }}>
							<span style={{
								fontSize: '0.6rem',
								color: 'var(--text-tertiary)',
								textTransform: 'uppercase',
								letterSpacing: '0.2em',
								fontWeight: 600,
								display: 'block',
								marginBottom: '20px'
							}}>
								{t('blog.title').replace('.', '')} <span style={{ opacity: 0.3, marginLeft: '8px' }}>/ 02</span>
							</span>
							<Link href="/blog" style={{
								fontSize: '0.9rem',
								color: 'var(--text-primary)',
								fontWeight: 400,
								textDecoration: 'none',
								borderBottom: '1px solid var(--border)',
								transition: 'all 0.3s ease',
								paddingBottom: '2px',
								display: 'inline-block'
							}} className="underlined-link">
								{t('home.latest_writing')}
							</Link>
						</div>
					</div>
				</div>
			</div>

		</main>
	);
}
