import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { locale } from '../lib/translations';

export default function MarkdownArticle({ content }: { content: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				table: ({ children, ...props }) => (
					<div className="markdown-table-wrap" tabIndex={0} role="region" aria-label={locale === 'vi' ? 'Bảng nội dung có thể cuộn ngang' : 'Horizontally scrollable table'}>
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
