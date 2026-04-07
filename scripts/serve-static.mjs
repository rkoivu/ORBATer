import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import http from 'node:http';

const rootDir = process.cwd();
const baseArg = process.argv[2] || '.';
const port = Number(process.argv[3] || 4173);
const baseDir = resolve(rootDir, baseArg);

if (!existsSync(baseDir) || !statSync(baseDir).isDirectory()) {
  console.error(`ERROR: Directory not found: ${baseDir}`);
  if (baseArg === 'dist') console.error('Run "npm run build" first, or use "npm run serve:src" to serve the source tree.');
  process.exit(1);
}

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

const server = http.createServer((req, res) => {
  const urlPath = req.url?.split('?')[0] || '/';
  const relPath = urlPath === '/' ? 'index.html' : urlPath.slice(1);
  const fullPath = normalize(join(baseDir, relPath));
  if (!fullPath.startsWith(baseDir) || !existsSync(fullPath) || statSync(fullPath).isDirectory()) {
    send404(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': contentTypes[extname(fullPath)] || 'application/octet-stream' });
  createReadStream(fullPath).pipe(res);
});

server.listen(port, () => {
  console.log(`Serving ${baseDir} at http://127.0.0.1:${port}`);
});
