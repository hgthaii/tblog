import ContentShell from '../components/ContentShell';

export default function PortfolioPage() {
	return (
		<ContentShell active="portfolio">
			<div className="glass-card border border-[rgba(255,255,255,0.08)] p-5 sm:p-8 rounded-2xl">
				<h1 className="text-2xl font-semibold text-heading mb-2">portfolio.</h1>
				<p className="text-sm text-foreground opacity-80">
					Add your projects here. This page is static-export friendly (no backend required).
				</p>
			</div>
		</ContentShell>
	);
}
