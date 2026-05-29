'use client';

import Image from 'next/image';
import { useLocale } from './lib/LocaleContext';
import { SITE_CONFIG } from './lib/config';
import TransitionLink from './components/TransitionLink';
import { PenTool, Terminal, Github, Instagram, Linkedin, Mail, FileText, ArrowUpRight } from 'lucide-react';

export default function Home() {
	const { t } = useLocale();
	const bio = t('home.bio');
	const smileToken = ':)';
	const smileIndex = bio.lastIndexOf(smileToken);
	const hasSmile = smileIndex !== -1;
	const bioText = hasSmile ? bio.slice(0, smileIndex) : bio;

	const navLinks = [
		{
			href: '/blog',
			label: t('menu.writing.label'),
			icon: <PenTool size={18} strokeWidth={1.5} />,
			description: t('menu.writing.description'),
		},
		{
			href: '/portfolio',
			label: t('menu.portfolio.label'),
			icon: <Terminal size={18} strokeWidth={1.5} />,
			description: t('menu.portfolio.description'),
		},
		{
			href: SITE_CONFIG.site.cvUrl,
			label: t('menu.cv.label'),
			icon: <FileText size={18} strokeWidth={1.5} />,
			description: t('menu.cv.description'),
			external: true,
		},
	];

	const socials = [
		{ label: 'GitHub', icon: <Github size={16} strokeWidth={1.5} />, href: SITE_CONFIG.profile.github, external: true },
		{ label: 'Instagram', icon: <Instagram size={16} strokeWidth={1.5} />, href: SITE_CONFIG.profile.instagram, external: true },
		{ label: 'LinkedIn', icon: <Linkedin size={16} strokeWidth={1.5} />, href: SITE_CONFIG.profile.linkedin, external: true },
		{ label: 'Email', icon: <Mail size={16} strokeWidth={1.5} />, href: `mailto:${SITE_CONFIG.site.email}` },
	];

	return (
		<main className="min-h-screen flex items-start md:items-center justify-center p-4 sm:p-6 font-mono pb-8">
			{/* Two-column layout */}
			<div className="w-full max-w-6xl flex flex-col md:flex-row gap-5 md:gap-6 mt-14 md:mt-0">

				{/* LEFT: Profile */}
				<div className="glass-card flex-1 p-5 sm:p-9 md:p-11 flex flex-col">
					<div>
						{/* Avatar + Name */}
						<div className="flex items-center gap-4 sm:gap-5 mb-7 sm:mb-8" style={{ viewTransitionName: 'profile-anchor' }}>
							<div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] flex-shrink-0">
								<Image
									src={SITE_CONFIG.profile.avatar}
									alt={SITE_CONFIG.profile.name}
									width={64}
									height={64}
									className="object-cover w-full h-full"
									priority
                                    sizes="64px"
								/>
							</div>
							<div>
								<h1 className="text-[2rem] leading-none sm:text-3xl font-bold text-heading tracking-tight">
									{t('home.name')}
								</h1>
								<p className="text-xs text-foreground tracking-wide">
									{t('home.location')}
								</p>
							</div>
						</div>

						{/* Bio */}
						<p className="text-[14px] sm:text-[15px] text-foreground leading-relaxed mb-7 sm:mb-8">
							{hasSmile ? (
								<>
									{bioText}
									<span className="inline-block bio-smile ml-1">:)</span>
								</>
							) : (
								bio
							)}
						</p>

						{/* Social links */}
						<div className="flex gap-2 flex-wrap">
							{socials.map((social, i) => (
								<a
									key={i}
									href={social.href}
									title={social.label}
									target={social.external ? '_blank' : undefined}
									rel={social.external ? 'noopener noreferrer' : undefined}
									aria-label="social link"
									className="p-2.5 sm:p-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] active:scale-[0.96] transition-all duration-200 text-foreground hover:text-heading"
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* RIGHT: Navigation */}
				<div className="w-full md:w-[380px] flex flex-col gap-2.5 md:gap-4">
					{navLinks.map((link, idx) => {
						const content = (
							<>
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-[rgba(255,255,255,0.03)] group-hover:bg-[rgba(255,255,255,0.06)] transition-colors text-foreground group-hover:text-heading">
										{link.icon}
									</div>
									<div>
										<h2 className="text-[15px] sm:text-sm font-semibold text-heading flex items-center gap-1.5 tracking-tight transition-colors">{link.label}</h2>
										<p title={link.description} className="text-[11px] sm:text-xs text-foreground leading-relaxed whitespace-normal break-words">
											{link.description}
										</p>
									</div>
								</div>
								<ArrowUpRight size={16} className="text-foreground opacity-45 sm:opacity-0 group-hover:opacity-60 group-hover:translate-x-1 transition-all" />
							</>
						);

						if (link.external) {
							return (
								<a
									key={idx}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									title={`${link.label} — ${link.description}`}
									className="glass-card group p-4 sm:p-6 flex items-center justify-between hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200"
								>
									{content}
								</a>
							);
						}

						return (
							<TransitionLink
								key={idx}
								href={link.href}
								title={`${link.label} — ${link.description}`}
								className="glass-card group p-4 sm:p-6 flex items-center justify-between hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200"
							>
								{content}
							</TransitionLink>
						);
					})}
				</div>

			</div>
		</main>
	);
}
