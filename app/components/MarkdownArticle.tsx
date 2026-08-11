import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownArticle({ content }: { content: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
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
