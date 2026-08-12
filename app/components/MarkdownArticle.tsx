import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { content as localeContent } from '../lib/config';

export default function MarkdownArticle({ content }: { content: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				table: ({ children, ...props }) => (
					<div className="markdown-table-wrap" tabIndex={0} role="region" aria-label={localeContent.accessibility.scrollableTable}>
						<table {...props}>{children}</table>
					</div>
				),
				a: ({ href, ...props }) => {
					const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);

					return (
						<a
							href={href}
							{...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
							{...props}
						/>
					);
				},
			}}
		>
			{content}
		</ReactMarkdown>
	);
}
