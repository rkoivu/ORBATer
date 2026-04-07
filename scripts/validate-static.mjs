import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const indexPath = path.join(rootDir, 'index.html');

function walkFiles(dir, exts, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'dist' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, exts, out);
      continue;
    }
    if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function relative(filePath) {
  return path.relative(rootDir, filePath).replaceAll('\\', '/');
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function runNodeCheck(filePath) {
  const res = spawnSync(process.execPath, ['--check', filePath], {
    cwd: rootDir,
    encoding: 'utf8'
  });
  if (res.status !== 0) {
    fail(`Syntax check failed for ${relative(filePath)}\n${(res.stderr || res.stdout).trim()}`);
  }
}

function collectLocalRefs(html, attr, tag) {
  const regex = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"`, 'gi');
  const refs = [];
  for (const match of html.matchAll(regex)) {
    const value = match[1];
    if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) continue;
    refs.push(value);
  }
  return refs;
}

function validateReferencedFiles(html) {
  const refs = [
    ...collectLocalRefs(html, 'href', 'link'),
    ...collectLocalRefs(html, 'src', 'script')
  ];
  const seen = new Set();
  for (const ref of refs) {
    if (seen.has(ref)) fail(`Duplicate HTML reference: ${ref}`);
    seen.add(ref);
    if (!existsSync(path.join(rootDir, ref))) fail(`Missing file referenced by index.html: ${ref}`);
  }
}

function validateIndexStructure(html) {
  if (!html.includes('id="app-root"')) fail('index.html is missing required root element #app-root');
  if (!collectLocalRefs(html, 'src', 'script').length) fail('index.html does not load any local scripts');
}

function validateStaticTree() {
  for (const dir of ['js', 'css', 'assets']) {
    const full = path.join(rootDir, dir);
    if (!existsSync(full) || !statSync(full).isDirectory()) fail(`Required directory is missing: ${dir}`);
  }
}

const html = readFileSync(indexPath, 'utf8');
validateStaticTree();
validateReferencedFiles(html);
validateIndexStructure(html);

const jsFiles = walkFiles(path.join(rootDir, 'js'), new Set(['.js']));
const scriptFiles = existsSync(path.join(rootDir, 'scripts'))
  ? walkFiles(path.join(rootDir, 'scripts'), new Set(['.js', '.mjs']))
  : [];

for (const filePath of [...jsFiles, ...scriptFiles]) runNodeCheck(filePath);

if (process.exitCode) process.exit(process.exitCode);
console.log(`Validated ${jsFiles.length} app scripts, ${scriptFiles.length} local automation scripts, and index.html references.`);
