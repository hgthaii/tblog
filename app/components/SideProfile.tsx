'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, Instagram, Linkedin, Mail } from 'lucide-react';

import { useLocale } from '../lib/LocaleContext';
import { SITE_CONFIG } from '../lib/config';

type SidebarSection = 'blog' | 'portfolio' | 'cv';

export default function SideProfile({ active }: { active: SidebarSection }) {
	const { t } = useLocale();
	const bio = t('home.bio');
	const smileToken = ':)';
	const smileIndex = bio.lastIndexOf(smileToken);
	const hasSmile = smileIndex !== -1;
	const bioText = hasSmile ? bio.slice(0, smileIndex) : bio;

	const navItemClass = (section: SidebarSection) =>
		active === section
			? 'text-heading'
			: 'text-foreground hover:text-heading transition-colors';

	const socialLinks = [
		{ label: 'GitHub', icon: <Github size={15} strokeWidth={1.5} />, href: SITE_CONFIG.profile.github, external: true },
		{ label: 'Instagram', icon: <Instagram size={15} strokeWidth={1.5} />, href: SITE_CONFIG.profile.instagram, external: true },
		{ label: 'LinkedIn', icon: <Linkedin size={15} strokeWidth={1.5} />, href: SITE_CONFIG.profile.linkedin, external: true },
		{ label: 'Email', icon: <Mail size={15} strokeWidth={1.5} />, href: `mailto:${SITE_CONFIG.site.email}` },
	];

	return (
		<div className="w-full lg:max-w-[320px]">
			<div className="flex items-center gap-3" style={{ viewTransitionName: 'profile-anchor' }}>
				<div className="w-11 h-11 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] flex-shrink-0">
					<Image
						src={SITE_CONFIG.profile.avatar}
						alt={SITE_CONFIG.profile.name}
						width={44}
						height={44}
						className="object-cover w-full h-full"
					/>
				</div>
				<div>
					<p className="text-[28px] leading-none font-bold text-heading tracking-tight">{t('home.name')}</p>
					<p className="text-xs text-foreground opacity-70 mt-1">{t('home.location')}</p>
				</div>
			</div>

			<p className="mt-6 text-[14px] leading-relaxed text-foreground">
				{hasSmile ? (
					<>
						{bioText}
						<span className="inline-block bio-smile ml-1">:)</span>
					</>
				) : (
					bio
				)}
			</p>

			<nav className="mt-6 text-[12px] flex items-center gap-2">
				<Link href="/" className="text-foreground hover:text-heading transition-colors">
					{t('nav.home')}
				</Link>
				<span className="opacity-35">/</span>
				<Link href="/blog" className={navItemClass('blog')}>
					{t('nav.writing')}
				</Link>
				<span className="opacity-35">/</span>
				<Link href="/portfolio" className={navItemClass('portfolio')}>
					{t('nav.portfolio')}
				</Link>
				<span className="opacity-35">/</span>
				<a
					href={SITE_CONFIG.site.cvUrl}
					target="_blank"
					rel="noopener noreferrer"
					className={navItemClass('cv')}
				>
					{t('menu.cv.label')}
				</a>
			</nav>

			<div className="mt-6 flex gap-2">
				{socialLinks.map((social) => (
					<a
						key={social.label}
						href={social.href}
						title={social.label}
						target={social.external ? '_blank' : undefined}
						rel={social.external ? 'noopener noreferrer' : undefined}
						className="p-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-200 text-foreground hover:text-heading"
					>
						{social.icon}
					</a>
				))}
			</div>
		</div>
	);
}
