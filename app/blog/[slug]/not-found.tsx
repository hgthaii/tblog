import ContentShell from '../../components/ContentShell';

export default function NotFound() {
	return (
		<ContentShell active="blog">
			<div className="glass-card border border-[rgba(255,255,255,0.08)] p-5 sm:p-8 rounded-2xl max-w-md w-full">
				<h1 className="text-xl font-semibold text-heading mb-2">Post not found</h1>
				<p className="text-sm text-foreground opacity-80">The page you’re looking for doesn’t exist.</p>
			</div>
		</ContentShell>
	);
}
