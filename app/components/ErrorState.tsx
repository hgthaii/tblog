'use client';

import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';

type ErrorStateProps = {
	code: string;
	title: string;
	description: string;
	onRetry?: () => void;
};

export default function ErrorState({ code, title, description, onRetry }: ErrorStateProps) {
	return (
		<main className="error-page">
			<div className="error-ambient" aria-hidden="true">
				<svg viewBox="0 0 720 360" preserveAspectRatio="none" focusable="false">
					<path d="M-30 238C105 102 214 303 342 175S580 104 750 8" pathLength="1" />
					<circle cx="176" cy="220" r="4" />
					<circle cx="486" cy="132" r="4" />
				</svg>
			</div>

			<section className="error-state" aria-labelledby="error-title">
				<p className="error-code" aria-hidden="true">{code}</p>
				<div className="error-copy">
					<p className="error-kicker">một khoảng lặng ngoài dự tính</p>
					<h1 id="error-title">{title}</h1>
					<p>{description}</p>
				</div>

				<div className="error-actions">
					{onRetry && (
						<button type="button" onClick={onRetry} className="error-action error-action-primary">
							<RotateCcw size={15} strokeWidth={1.5} />
							thử lại
						</button>
					)}
					<Link href="/" className={`error-action ${onRetry ? '' : 'error-action-primary'}`}>
						<ArrowLeft size={15} strokeWidth={1.5} />
						về trang chủ
					</Link>
				</div>
			</section>
		</main>
	);
}
