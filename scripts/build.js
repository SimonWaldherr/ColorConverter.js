import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { build } from 'esbuild';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'src/index.js');
const DIST = resolve(ROOT, 'dist');

const PKG = JSON.parse(await readFile(resolve(ROOT, 'package.json'), 'utf8'));

const banner = `/**
 * ColorConverter.js v${PKG.version}
 * ${PKG.description}
 *
 * @license MIT
 * @author ${PKG.author.name} <${PKG.author.email}>
 * @see ${PKG.homepage}
 */`;

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const common = {
  entryPoints: [SRC],
  bundle: true,
  target: ['es2020'],
  banner: { js: banner },
};

// 1. ESM build
await build({
  ...common,
  format: 'esm',
  outfile: resolve(DIST, 'colorconverter.esm.js'),
});

// 2. CJS build
await build({
  ...common,
  format: 'cjs',
  outfile: resolve(DIST, 'colorconverter.cjs'),
});

// 3. UMD build (esbuild has no native UMD format, so wrap an IIFE manually)
const iifeResult = await build({
  ...common,
  format: 'iife',
  globalName: '__colorconvModule',
  write: false,
  banner: undefined,
});
const iifeCode = iifeResult.outputFiles[0].text;

const umdWrapped = `${banner}
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.colorconv = factory();
    // Backwards-compat alias used by the original library:
    root.returnExports = root.colorconv;
  }
}(typeof self !== 'undefined' ? self : this, function () {
${iifeCode}
  return __colorconvModule.default;
}));
`;
await writeFile(resolve(DIST, 'colorconverter.umd.js'), umdWrapped);

// 4a. Also write colorconverter.js at the repo root for backwards compatibility.
// Old users who loaded this library via a raw GitHub URL, CDN, or direct script tag
// used `<script src="colorconverter.js">` — this keeps those links working.
await writeFile(resolve(ROOT, 'colorconverter.js'), umdWrapped);

// 4. Minified UMD
await build({
  stdin: { contents: umdWrapped, resolveDir: ROOT, loader: 'js' },
  minify: true,
  target: ['es2017'],
  outfile: resolve(DIST, 'colorconverter.umd.min.js'),
  banner: { js: banner },
});

console.log(`Built dist/ for colorconverter v${PKG.version}`);
