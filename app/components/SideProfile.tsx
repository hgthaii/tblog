'use client';

import Image from 'next/image';
import { FileText, House, Milestone, NotebookPen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useLocale } from '../lib/LocaleContext';
import { SITE_CONFIG } from '../lib/config';
import TransitionLink from './TransitionLink';

type SidebarSection = 'blog' | 'milestones' | 'cv';

export default function SideProfile({ active }: { active: SidebarSection }) {
	const { t } = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const profileRef = useRef<HTMLDivElement>(null);
	const activeLabel = {
		blog: t('nav.writing'),
		milestones: t('nav.milestones'),
		cv: t('menu.cv.label'),
	}[active];

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (!profileRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsOpen(false);
		};
		const handleScroll = () => {
			if (window.scrollY > 40) setIsOpen(false);
		};

		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const navItemClass = (section: SidebarSection) =>
		active === section
			? 'text-heading'
			: 'text-foreground hover:text-heading transition-colors';

	return (
		<div ref={profileRef} className="relative z-40 w-fit max-w-full">
			<button
				type="button"
				aria-expanded={isOpen}
				aria-controls="profile-menu"
				aria-label={`${t('home.name')} — ${activeLabel}`}
				title={`${t('home.name')} — ${activeLabel}`}
				onClick={() => setIsOpen((current) => !current)}
				className="profile-chip group flex items-center gap-3 p-1.5 pr-3 focus:outline-none cursor-pointer"
				data-profile-anchor
			>
				<span data-profile-avatar className="avatar-halo w-9 h-9 rounded-xl overflow-hidden border border-[var(--border)] flex-shrink-0">
					<Image
						src={SITE_CONFIG.profile.avatar}
						alt={SITE_CONFIG.profile.name}
						width={36}
						height={36}
						className="profile-avatar-image object-cover w-full h-full"
						priority
						sizes="36px"
					/>
				</span>
				<span className="min-w-0 text-left">
					<span className="block text-[14px] leading-none font-semibold text-heading tracking-[-0.025em]">{t('home.name')}</span>
					<span className="block mt-1.5 text-[10px] leading-none text-muted truncate">{t('home.location')}</span>
				</span>
			</button>

			<div
				id="profile-menu"
				data-state={isOpen ? 'open' : 'closed'}
				className="profile-popover"
			>
				<nav className="profile-orbit" aria-label={t('nav.home')}>
					<TransitionLink
						href={SITE_CONFIG.routes.home}
						direction="backward"
						animateProfile={false}
						onNavigate={() => setIsOpen(false)}
						title={t('nav.home')}
						className="profile-menu-item flex w-9 h-9 items-center justify-center text-foreground"
					>
						<House size={16} strokeWidth={1.5} />
						<span className="sr-only">{t('nav.home')}</span>
					</TransitionLink>
					<TransitionLink
						href={SITE_CONFIG.routes.blog}
						direction="forward"
						animateProfile={false}
						onNavigate={() => setIsOpen(false)}
						title={t('nav.writing')}
						className={`profile-menu-item flex w-9 h-9 items-center justify-center ${navItemClass('blog')}`}
					>
						<NotebookPen size={16} strokeWidth={1.5} />
						<span className="sr-only">{t('nav.writing')}</span>
					</TransitionLink>
					<TransitionLink
						href={SITE_CONFIG.routes.milestones}
						direction="forward"
						animateProfile={false}
						onNavigate={() => setIsOpen(false)}
						title={t('nav.milestones')}
						className={`profile-menu-item flex w-9 h-9 items-center justify-center ${navItemClass('milestones')}`}
					>
						<Milestone size={16} strokeWidth={1.5} />
						<span className="sr-only">{t('nav.milestones')}</span>
					</TransitionLink>
					<TransitionLink
						href={SITE_CONFIG.routes.cv}
						direction="forward"
						animateProfile={false}
						onNavigate={() => setIsOpen(false)}
						title={t('menu.cv.label')}
						className={`profile-menu-item flex w-9 h-9 items-center justify-center ${navItemClass('cv')}`}
					>
						<FileText size={16} strokeWidth={1.5} />
						<span className="sr-only">{t('menu.cv.label')}</span>
					</TransitionLink>
				</nav>
			</div>
		</div>
	);
}
