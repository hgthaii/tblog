'use client';

import SideProfile from './SideProfile';

type ShellSection = 'blog' | 'milestones' | 'cv';

export default function ContentShell({
	children,
	active,
	width = 'default',
}: {
	children: React.ReactNode;
	active: ShellSection;
	width?: 'default' | 'wide';
}) {
	return (
		<main className="app-shell min-h-screen px-5 py-4 sm:px-7 sm:py-6 md:px-10 md:py-10 pb-8">
			<div className="relative w-full max-w-[1420px] mx-auto">
				<aside className="corner-profile self-start">
					<SideProfile active={active} />
				</aside>

				<section
					className={`content-canvas w-full min-w-0 mt-10 lg:mt-0 ${
						width === 'wide' ? 'content-canvas-wide max-w-none mx-auto' : 'max-w-none mx-auto'
					}`}
				>
					<div className="w-full">{children}</div>
				</section>
			</div>
		</main>
	);
}
