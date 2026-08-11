'use client';

import { ChevronsDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ContentShell from '../components/ContentShell';
import { useLocale } from '../lib/LocaleContext';

const slideOptions: KeyframeAnimationOptions = {
	duration: 420,
	easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
	fill: 'both',
};

type MilestoneItem = {
	stage: string;
	desc: string[];
	tags: string[];
};

type MilestoneCardProps = {
	indexLabel: string;
	stage: string;
	description: string;
	tags: string[];
	isMobileFull: boolean;
};

type MobileRoute = {
	width: number;
	height: number;
	path: string;
};

function MilestoneCard({ indexLabel, stage, description, tags, isMobileFull }: MilestoneCardProps) {
	const hasDescription = description.trim().length > 0;
	const [isExpanded, setIsExpanded] = useState(false);
	const [isUnclamped, setIsUnclamped] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const descriptionRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<Animation | null>(null);

	const toggle = () => {
		if (isMobileFull) return;

		const wrapper = wrapperRef.current;
		const descriptionElement = descriptionRef.current;

		if (!wrapper || !descriptionElement) return;

		const opening = !isExpanded;
		const currentHeight = wrapper.getBoundingClientRect().height;

		animationRef.current?.cancel();
		wrapper.style.height = 'auto';
		descriptionElement.dataset.unclamped = opening ? 'true' : 'false';

		const targetHeight = Math.ceil(
			Math.max(wrapper.getBoundingClientRect().height, wrapper.scrollHeight),
		);

		setIsExpanded(opening);
		setIsUnclamped(opening);

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			descriptionElement.dataset.unclamped = String(opening);
			setIsUnclamped(opening);
			wrapper.style.height = 'auto';
			return;
		}

		wrapper.style.height = `${targetHeight}px`;
		const animation = wrapper.animate(
			[{ height: `${currentHeight}px` }, { height: `${targetHeight}px` }],
			slideOptions,
		);

		animationRef.current = animation;
		animation.onfinish = () => {
			wrapper.style.height = 'auto';
			animation.cancel();
			if (animationRef.current === animation) animationRef.current = null;
		};
	};

	useEffect(() => {
		if (isMobileFull) {
			animationRef.current?.cancel();
			if (wrapperRef.current) wrapperRef.current.style.height = 'auto';
		}

		return () => animationRef.current?.cancel();
	}, [isMobileFull]);

	if (!hasDescription) {
		return (
			<div className="journey-card journey-card-empty" aria-label={stage}>
				<div className="journey-empty-content px-4 sm:px-5 py-4">
					<span className="journey-stage text-[11px] text-muted">{stage}</span>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`journey-card interactive-card ${isMobileFull ? 'journey-card-mobile-full' : ''}`}
			role={isMobileFull ? undefined : 'button'}
			tabIndex={isMobileFull ? undefined : 0}
			aria-expanded={isMobileFull ? undefined : isExpanded}
			onClick={isMobileFull ? undefined : toggle}
			onKeyDown={isMobileFull ? undefined : (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					toggle();
				}
			}}
		>
			<span className="journey-index absolute top-4 right-4 text-[11px] font-extrabold tracking-[0.12em] text-muted">
				#{indexLabel}
			</span>
			<div className="journey-card-header px-4 sm:px-5 py-4">
				<span className="journey-stage text-[11px] text-muted">{stage}</span>
			</div>
			<div ref={wrapperRef} className="journey-bookmark-description-wrap px-4 sm:px-5 pb-4 sm:pb-5">
				<div ref={descriptionRef} className="journey-bookmark-description" data-unclamped={isMobileFull || isUnclamped}>
					{description}
				</div>
				{tags.length > 0 && (
					<div className="journey-tags mt-3 flex flex-wrap gap-2">
						{tags.map((tag) => (
							<span key={tag} className="tag px-2.5 py-1 text-[10px] tracking-[0.08em]">
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
			<ChevronsDown size={16} strokeWidth={1.5} className="journey-card-chevron" />
		</div>
	);
}

export default function MilestonesPage() {
	const { content } = useLocale();
	const mapRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [mobileRoute, setMobileRoute] = useState<MobileRoute>({ width: 1, height: 1, path: '' });
	const timeline = content.milestones.timeline;
	const items: MilestoneItem[] = timeline.items.map((item) => ({
		stage: item.stage,
		desc: Array.isArray(item.desc) ? item.desc : [],
		tags: Array.isArray(item.tags) ? item.tags : [],
	}));

	useEffect(() => {
		const media = window.matchMedia('(max-width: 639px)');
		const update = () => setIsMobile(media.matches);

		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !isMobile) return;

		let frame = 0;
		const updateRoute = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const mapRect = map.getBoundingClientRect();
				const markers = Array.from(map.querySelectorAll<HTMLElement>('.journey-marker > span'));
				const points = markers.map((marker) => {
					const rect = marker.getBoundingClientRect();
					return {
						x: rect.left + rect.width / 2 - mapRect.left,
						y: rect.top + rect.height / 2 - mapRect.top,
					};
				});

				setMobileRoute({
					width: Math.max(1, mapRect.width),
					height: Math.max(1, mapRect.height),
					path: points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' '),
				});
			});
		};

		const observer = new ResizeObserver(updateRoute);
		observer.observe(map);
		updateRoute();
		window.addEventListener('resize', updateRoute);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('resize', updateRoute);
		};
	}, [isMobile, items.length]);

	return (
		<ContentShell active="milestones">
			<div className="milestones-page w-full max-w-[720px] mx-auto flex flex-col gap-7 sm:gap-9">
				<div className="milestones-intro flex flex-col gap-1">
					<h1 className="page-title">{content.milestones.pageTitle}</h1>
					<p className="page-subtitle max-w-[720px]">{timeline.description}</p>
				</div>

				<section className="milestones-timeline" aria-label={content.milestones.pageTitle}>
					<div ref={mapRef} className="journey-map">
						<svg className="journey-route journey-route-desktop" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
							<path
								className="journey-route-line journey-route-line-desktop"
								d="M500 0
									C 500 75, 445 105, 445 185
									S 555 265, 555 345
									S 445 425, 445 505
									S 555 585, 555 665
									S 445 745, 445 825
									S 500 925, 500 1000"
								pathLength="1"
							/>
						</svg>
						{mobileRoute.path && (
							<svg
								className="journey-route journey-route-mobile"
								viewBox={`0 0 ${mobileRoute.width} ${mobileRoute.height}`}
								preserveAspectRatio="none"
								aria-hidden="true"
							>
								<path className="journey-route-mobile-base" d={mobileRoute.path} pathLength="1" />
								<path className="journey-route-mobile-flow" d={mobileRoute.path} pathLength="1" />
							</svg>
						)}

						{items.length === 0 ? (
							<div className="text-sm text-foreground/70">{content.milestones.empty}</div>
						) : (
							<ol className="journey-stops">
								{items.map((step, idx) => (
									<li
										key={step.stage}
										className={`journey-stop group ${idx % 2 === 0 ? 'journey-stop--right' : 'journey-stop--left'}`}
									>
										<span className="journey-marker" aria-hidden="true">
											<span />
										</span>
										<MilestoneCard
											indexLabel={String(items.length - idx).padStart(2, '0')}
											stage={step.stage}
											description={step.desc.join('\n\n')}
											tags={step.tags}
											isMobileFull={isMobile}
										/>
									</li>
								))}
							</ol>
						)}
					</div>
				</section>
			</div>
		</ContentShell>
	);
}
