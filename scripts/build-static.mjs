import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

// Copy non-minified assets first
for (const relPath of ['assets', 'README.md']) {
  const src = path.join(rootDir, relPath);
  const dest = path.join(distDir, relPath);
  if (existsSync(src)) {
    const { cpSync } = await import('node:fs');
    cpSync(src, dest, { recursive: true });
  }
}

// Copy index.html as-is
writeFileSync(
  path.join(distDir, 'index.html'),
  readFileSync(path.join(rootDir, 'index.html'), 'utf8'),
  'utf8'
);

// Minify JS and CSS using esbuild
let esbuild;
try {
  esbuild = await import('esbuild');
} catch {
  console.warn('esbuild not found — copying files without minification. Run: npm install');
  const { cpSync } = await import('node:fs');
  for (const relPath of ['css', 'js']) {
    const src = path.join(rootDir, relPath);
    const dest = path.join(distDir, relPath);
    if (existsSync(src)) cpSync(src, dest, { recursive: true });
  }
  esbuild = null;
}

if (esbuild) {
  const transform = esbuild.transform;

  async function minifyDir(srcDir, destDir, loader) {
    mkdirSync(destDir, { recursive: true });
    const files = readdirSync(srcDir);
    for (const file of files) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      const source = readFileSync(srcFile, 'utf8');
      try {
        const { code } = await transform(source, { loader, minify: true });
        writeFileSync(destFile, code, 'utf8');
      } catch (err) {
        console.warn(`Warning: could not minify ${file}, copying as-is. ${err.message}`);
        writeFileSync(destFile, source, 'utf8');
      }
    }
  }

  await minifyDir(path.join(rootDir, 'js'), path.join(distDir, 'js'), 'js');
  await minifyDir(path.join(rootDir, 'css'), path.join(distDir, 'css'), 'css');

  console.log('JS and CSS minified.');
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
