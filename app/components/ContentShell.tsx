'use client';

import SideProfile from './SideProfile';

type ShellSection = 'blog' | 'portfolio' | 'cv';

export default function ContentShell({
	children,
	active,
}: {
	children: React.ReactNode;
	active: ShellSection;
}) {
	return (
		<main className="min-h-screen flex justify-center p-4 sm:p-6 md:p-10 font-mono pb-8">
			<div className="w-full max-w-[1360px] grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] mt-14 sm:mt-0">
				<aside className="lg:sticky lg:top-8 self-start">
					<SideProfile active={active} />
				</aside>

				<section className="w-full flex lg:justify-center">
					<div className="w-full max-w-[800px]">{children}</div>
				</section>
			</div>
		</main>
	);
}
