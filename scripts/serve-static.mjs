import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve('out');
const port = Number(process.env.TBLOG_E2E_PORT || 4173);
const mimeTypes = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.ico': 'image/x-icon',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.wasm': 'application/wasm',
	'.xml': 'application/xml; charset=utf-8',
};

const resolveRequest = (pathname) => {
	const decodedPath = decodeURIComponent(pathname).replace(/^\/+/, '');
	const candidate = path.resolve(root, decodedPath || 'index.html');
	if (!candidate.startsWith(`${root}${path.sep}`) && candidate !== root) return null;
	if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
	const indexFile = path.join(candidate, 'index.html');
	return fs.existsSync(indexFile) ? indexFile : null;
};

http.createServer((request, response) => {
	const pathname = new URL(request.url || '/', 'http://localhost').pathname;
	const filePath = resolveRequest(pathname);
	const status = filePath ? 200 : 404;
	const responseFile = filePath || path.join(root, '404.html');
	const contentType = mimeTypes[path.extname(responseFile).toLowerCase()] || 'application/octet-stream';

	response.writeHead(status, { 'Content-Type': contentType });
	fs.createReadStream(responseFile).pipe(response);
}).listen(port, '127.0.0.1', () => {
	console.log(`Static test server listening on http://127.0.0.1:${port}`);
});
