import fs from 'node:fs';
import path from 'node:path';

const outputDirectory = path.resolve('out');
const failures = [];

const requireFile = (relativePath) => {
	const filePath = path.join(outputDirectory, relativePath);
	if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
		failures.push(`missing ${relativePath}`);
		return '';
	}
	return fs.readFileSync(filePath, 'utf8');
};

const requireText = (relativePath, pattern, description) => {
	const source = requireFile(relativePath);
	if (source && !pattern.test(source)) failures.push(`${relativePath} has no ${description}`);
};

requireText('index.html', /<main[\s>]/, 'main content');
requireText('blog/index.html', /rel="canonical"/, 'canonical metadata');
requireText('404.html', /404/, '404 state');
requireText('robots.txt', /Sitemap:/, 'sitemap reference');
requireText('sitemap.xml', /\/blog\//, 'blog route');
requireText('feed.xml', /<rss[\s>]/, 'RSS document');
requireText('index.html', /\/favicon_io\/favicon\.ico/, 'favicon metadata');
requireText('index.html', /\/favicon_io\/apple-touch-icon\.png/, 'Apple touch icon metadata');
requireText('index.html', /\/favicon_io\/site\.webmanifest/, 'web app manifest metadata');
requireFile('favicon_io/favicon.ico');
requireFile('favicon_io/favicon-16x16.png');
requireFile('favicon_io/favicon-32x32.png');
requireFile('favicon_io/apple-touch-icon.png');
requireFile('favicon_io/android-chrome-192x192.png');
requireFile('favicon_io/android-chrome-512x512.png');
requireFile('favicon_io/site.webmanifest');
requireFile('pagefind/pagefind.js');
requireFile('pagefind/pagefind-entry.json');

const blogDirectory = path.join(outputDirectory, 'blog');
const postDirectories = fs.existsSync(blogDirectory)
	? fs.readdirSync(blogDirectory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name !== 'category')
		.filter((entry) => fs.existsSync(path.join(blogDirectory, entry.name, 'index.html')))
	: [];
if (postDirectories.length === 0) failures.push('missing a rendered blog post');

const categoryDirectory = path.join(blogDirectory, 'category');
const categoryPages = fs.existsSync(categoryDirectory)
	? fs.readdirSync(categoryDirectory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.filter((entry) => fs.existsSync(path.join(categoryDirectory, entry.name, 'index.html')))
	: [];
if (categoryPages.length === 0) failures.push('missing a rendered category page');

const hasOpenGraphImage = fs.existsSync(path.join(outputDirectory, 'opengraph-image'))
	|| fs.existsSync(path.join(outputDirectory, 'opengraph-image.png'));
if (!hasOpenGraphImage) failures.push('missing home Open Graph image');

if (failures.length > 0) {
	console.error(`Static output verification failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
	process.exit(1);
}

console.log(`Static output verified: ${postDirectories.length} posts, ${categoryPages.length} categories, RSS, search, favicon, SEO, and 404.`);
