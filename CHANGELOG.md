# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-10-06
### Added
- Initial public release: TreeForge core library (ESM source) in `src/`.
- UMD bundles for browser/CDN use: `dist/treeforge.umd.js` and `dist/treeforge.umd.min.js`.
- `unpkg` and `browser` fields in `package.json` so CDNs (unpkg/jsdelivr) can serve the minified bundle.
- `LICENSE` (ISC), `CHANGELOG.md`, and release artifacts.

### Notes
- The package publishes both the ESM source and a bundled UMD build to support modern bundlers and CDN usage.
- Run `npm install` then import via `import TreeForge from 'treeforge';` or use the UMD bundle via a script tag from unpkg.
