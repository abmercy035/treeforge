/**
	* TreeForge Simple Configuration
	* Focus: Tree display styles and rendering options
	*/

// Simple presets for common tree styles
export const TreeStyles = {
	// Minimal - just the tree structure
	MINIMAL: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: { folder: '📁', file: '📄' },
		colors: { folder: 'cyan', file: 'white' }
	},

	// GitHub style - clean with icons
	GITHUB: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: { folder: '📁', file: '📄', open: '📂' },
		colors: { folder: '#0366d6', file: '#586069' }
	},

	// Colorful - vibrant colors
	COLORFUL: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: { folder: '📁', file: '📄', open: '📂', code: '💻', image: '🖼️', doc: '📝' },
		colors: { folder: '#ff6b35', file: '#4ecdc4', open: '#95e1d3' }
	},

	// ASCII - classic terminal look
	ASCII: {
		asciiStyle: 'ascii',
		indent: 2,
		icons: { folder: '[+]', file: '[-]', open: '[-]' },
		colors: { folder: 'green', file: 'white' }
	},

	// VS Code style
	VSCODE: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: { folder: '📁', file: '📄', open: '📂' },
		colors: { folder: '#007acc', file: '#cccccc', background: '#1e1e1e' }
	}
};

/**
	* Simple config builder
	*/
export function buildTreeConfig(style = 'MINIMAL', overrides = {}) {
	const baseStyle = TreeStyles[style] || TreeStyles.MINIMAL;
	return {
		settings: {
			...baseStyle,
			...overrides
		}
	};
}

/**
	* Get available styles
	*/
export function getAvailableStyles() {
	return Object.keys(TreeStyles);
}
