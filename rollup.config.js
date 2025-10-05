import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
	// UMD build (non-minified)
	{
		input: 'src/umd-entry.js',
		output: {
			file: 'dist/treeforge.umd.js',
			format: 'umd',
			name: 'TreeForge',
			exports: 'named'
		},
		plugins: [resolve()]
	},
	// UMD minified
	{
		input: 'src/umd-entry.js',
		output: {
			file: 'dist/treeforge.umd.min.js',
			format: 'umd',
			name: 'TreeForge',
			exports: 'named'
		},
		plugins: [resolve(), terser()]
	}
];
