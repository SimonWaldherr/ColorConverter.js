# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2026-04-30

A full project refactor. **No public API breaks** — every function from
the original `colorconv` global is still exposed and produces
bit-for-bit identical output.

### Added
- ES module source under `src/`, split into focused files.
- Modern build (esbuild) producing `dist/colorconverter.esm.js`,
  `dist/colorconverter.cjs`, `dist/colorconverter.umd.js` and a
  minified UMD bundle.
- `package.json` `"exports"` map with proper ESM / CJS conditions.
- Test suite using Node's built-in `node:test` runner, including the
  reference values from the original `nodecolorconv.js`, edge cases
  and round-trip checks.
- ESLint, Prettier and `.editorconfig` configuration.
- GitHub Actions workflow running lint + test + build on every push
  and pull request.
- `parse()` now also recognizes `cmyk(c%, m%, y%, k%)` strings.
- Examples now share a single stylesheet under `examples/`; the
  repository root contains a small landing `index.html` linking to
  each demo.
- This `CHANGELOG.md`.

### Changed
- `package.json` version bumped to `0.3.0` (was `0.1.2`, while the
  source header claimed `0.2.0`).
- `package.json` `bugs.url` corrected (previously pointed at an
  unrelated repository).
- README rewritten from scratch with a corrected conversion matrix,
  install instructions, ESM/CJS/browser quick starts and a full API
  reference.
- All HTML demos moved from the repository root into `examples/` and
  updated to load `dist/colorconverter.umd.js`.

### Removed
- `Gruntfile.js` and Grunt-based build (replaced by esbuild).
- `colorconverter.coffee` (CoffeeScript source duplicate).
- `colorconverter.min.js` (now generated as `dist/colorconverter.umd.min.js`).
- `nodecolorconv.js` (replaced by the proper test suite under `test/`).
- `.sizecache.json` (Grunt artifact).
