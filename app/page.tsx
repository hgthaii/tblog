'use client';

import Image from 'next/image';
import {
	ArrowUpRight,
	FileText,
	Github,
	Instagram,
	Linkedin,
	Mail,
	Milestone,
	NotebookPen,
} from 'lucide-react';

import TransitionLink from './components/TransitionLink';
import { SITE_CONFIG } from './lib/config';
import { useLocale } from './lib/LocaleContext';

export default function Home() {
	const { t, content } = useLocale();

	const navLinks = [
		{
			href: SITE_CONFIG.routes.blog,
			label: t('menu.writing.label'),
			description: t('menu.writing.description'),
			icon: NotebookPen,
		},
		{
			href: SITE_CONFIG.routes.milestones,
			label: t('menu.milestones.label'),
			description: t('menu.milestones.description'),
			icon: Milestone,
		},
		{
			href: SITE_CONFIG.routes.cv,
			label: t('menu.cv.label'),
			description: t('menu.cv.description'),
			icon: FileText,
		},
	];

	const socialLinks = [
		{ label: content.social.github, icon: Github, href: SITE_CONFIG.profile.github, external: true },
		{ label: content.social.instagram, icon: Instagram, href: SITE_CONFIG.profile.instagram, external: true },
		{ label: content.social.linkedin, icon: Linkedin, href: SITE_CONFIG.profile.linkedin, external: true },
		{ label: content.social.email, icon: Mail, href: SITE_CONFIG.site.emailHref },
	];

	return (
		<main className="home-page min-h-screen flex flex-col p-4 sm:p-6 pb-8">
			<div className="w-full max-w-6xl flex-1 mx-auto flex items-start md:items-center">
				<div className="w-full flex flex-col md:flex-row gap-5 md:gap-6">
					<section className="home-profile-card glass-card flex-1 p-5 sm:p-9 md:p-11 flex flex-col">
						<div className="home-profile-content">
							<div data-profile-anchor className="w-fit flex items-center gap-4 sm:gap-5 mb-7 sm:mb-8">
							<div data-profile-avatar className="avatar-halo w-14 h-14 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-[var(--border)] flex-shrink-0">
								<Image
									src={SITE_CONFIG.profile.avatar}
									alt={SITE_CONFIG.profile.name}
									width={72}
									height={72}
									className="profile-avatar-image object-cover w-full h-full"
									priority
									sizes="72px"
								/>
							</div>
							<div>
								<h1 className="text-[1.9rem] leading-none sm:text-[2rem] font-bold text-heading tracking-[-0.04em]">{t('home.name')}</h1>
								<p className="mt-1 text-[11px] text-muted tracking-wide">{t('home.location')}</p>
							</div>
							</div>

							<div className="home-bio max-w-[660px]">
								<p className="text-[14px] sm:text-[15px] text-foreground leading-[1.75] whitespace-pre-line">
									{content.home.bio}<span className="bio-end-anchor">
										<span className="bio-drift" aria-label={content.home.bioDrift.anchor + content.home.bioDrift.falling}>
											<span>{content.home.bioDrift.anchor}</span>
											<span className="bio-drift-falling">{content.home.bioDrift.falling}</span>
										</span>
									</span>
								</p>
							</div>

							<div className="home-social-links flex gap-2 flex-wrap">
							{socialLinks.map((social) => {
								const Icon = social.icon;

								return (
									<a
										key={social.label}
										href={social.href}
										title={social.label}
										aria-label={social.label}
										target={social.external ? '_blank' : undefined}
										rel={social.external ? 'noopener noreferrer' : undefined}
										className="icon-button p-2.5"
									>
										<Icon size={16} strokeWidth={1.5} />
									</a>
								);
							})}
							</div>
						</div>
					</section>

					<nav className="home-nav w-full md:w-[380px] flex flex-col gap-2.5 md:gap-4" aria-label={t('nav.home')}>
						{navLinks.map((link) => {
							const Icon = link.icon;
							const className = 'home-nav-link interactive-card group p-4 sm:p-5 flex items-center justify-between';
							const linkContent = (
								<>
									<div className="flex items-center gap-4 min-w-0">
										<div className="icon-tile w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0">
											<Icon size={18} strokeWidth={1.5} />
										</div>
										<div className="min-w-0">
											<h2 className="text-[14px] sm:text-[15px] font-semibold text-heading tracking-[-0.02em]">{link.label}</h2>
											{link.description && (
												<p title={link.description} className="text-[11px] sm:text-xs text-foreground leading-relaxed whitespace-normal break-words">
													{link.description}
												</p>
											)}
										</div>
									</div>
									<ArrowUpRight size={16} className="text-foreground opacity-45 sm:opacity-0 group-hover:opacity-60 group-hover:translate-x-1 transition-all flex-shrink-0" />
								</>
							);

							return (
								<TransitionLink
									key={link.href}
									href={link.href}
									direction="forward"
									title={`${link.label} — ${link.description}`}
									className={className}
								>
									{linkContent}
								</TransitionLink>
							);
						})}
					</nav>
				</div>
			</div>
			<footer className="home-footer mt-6">
				© {new Date().getFullYear()} {content.home.copyrightOwner}
			</footer>
		</main>
	);
}
