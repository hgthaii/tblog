'use client';

import { ArrowLeft, RotateCcw } from 'lucide-react';
import { content } from '../lib/config';
import RouteTransition from './RouteTransition';
import TransitionLink from './TransitionLink';

type ErrorStateProps = {
	code: string;
	title: string;
	description: string;
	onRetry?: () => void;
};

export default function ErrorState({ code, title, description, onRetry }: ErrorStateProps) {
	return (
		<RouteTransition>
			<main className="error-page">
				<section className="error-state" aria-labelledby="error-title">
				<p className="error-code" aria-hidden="true">{code}</p>
				<div className="error-copy">
					<p className="error-kicker">{content.errors.kicker}</p>
					<h1 id="error-title">{title}</h1>
					<p>{description}</p>
				</div>

				<div className="error-actions">
					{onRetry && (
						<button type="button" onClick={onRetry} className="error-action error-action-primary">
							<RotateCcw size={15} strokeWidth={1.5} />
							{content.errors.retry}
						</button>
					)}
					<TransitionLink href="/" direction="backward" className={`error-action ${onRetry ? '' : 'error-action-primary'}`}>
						<ArrowLeft size={15} strokeWidth={1.5} />
						{content.errors.home}
					</TransitionLink>
				</div>
				</section>
			</main>
		</RouteTransition>
	);
}
