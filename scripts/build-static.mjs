import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

const result = spawnSync(process.execPath, [path.join('scripts', 'validate-static.mjs')], {
  cwd: rootDir,
  stdio: 'inherit'
});
if (result.status !== 0) process.exit(result.status ?? 1);

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const relPath of ['assets', 'css', 'js', 'index.html', 'README.md']) {
  const src = path.join(rootDir, relPath);
  const dest = path.join(distDir, relPath);
  if (existsSync(src)) cpSync(src, dest, { recursive: true });
}

const buildInfo = {
  builtAt: new Date().toISOString(),
  source: 'static-copy',
  entry: 'index.html'
};
writeFileSync(path.join(distDir, 'build-info.json'), `${JSON.stringify(buildInfo, null, 2)}\n`, 'utf8');

const html = readFileSync(path.join(distDir, 'index.html'), 'utf8');
if (!html.includes('<div id="app-root"></div>')) {
  console.error('ERROR: Built index.html is missing #app-root');
  process.exit(1);
}

console.log(`Built static site into ${path.relative(rootDir, distDir) || 'dist'}.`);
