import 'server-only';

import { marked } from 'marked';

export function renderMarkdownToHtml(markdown: string) {
	const out = marked.parse(markdown);
	return typeof out === 'string' ? Promise.resolve(out) : out;
}
