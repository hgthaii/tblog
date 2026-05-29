import ContentShell from '../components/ContentShell';

export default function CvPage() {
	return (
		<ContentShell active="cv">
			<div className="glass-card border border-[rgba(255,255,255,0.08)] p-5 sm:p-8 rounded-2xl">
				<h1 className="text-2xl font-semibold text-heading mb-2">tiểu sử.</h1>
				<p className="text-sm text-foreground opacity-80">
					Put your experience, links, and downloadable resume here.
				</p>
			</div>
		</ContentShell>
	);
}
