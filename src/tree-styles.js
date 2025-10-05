/**
	* TreeForge Configuration & Styles
	* Complete configuration options for tree rendering
	*/

// ============ COMPLETE TREE STYLES ============

export const TreeStyles = {
	// 1. Minimal - just the tree structure
	MINIMAL: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄'
		},
		colors: {
			folder: 'cyan',
			file: 'white'
		}
	},

	// 2. GitHub style - clean with icons
	GITHUB: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂',
			js: '💛',
			json: '📋',
			md: '📝',
			css: '🎨',
			html: '🌐',
			image: '🖼️',
			video: '🎬',
			archive: '📦'
		},
		colors: {
			folder: '#0366d6',
			file: '#586069',
			open: '#0366d6',
			hover: '#f6f8fa',
			selected: '#e1e4e8'
		}
	},

	// 3. VS Code Dark - VS Code dark theme
	VSCODE_DARK: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂',
			js: '📜',
			ts: '🔷',
			json: '⚙️',
			md: '📝',
			css: '🎨',
			html: '🌐',
			git: '🔀'
		},
		colors: {
			folder: '#007acc',
			file: '#cccccc',
			open: '#0098ff',
			background: '#1e1e1e',
			hover: '#2a2d2e',
			selected: '#37373d',
			border: '#3c3c3c'
		}
	},

	// 4. VS Code Light
	VSCODE_LIGHT: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#007acc',
			file: '#383838',
			background: '#ffffff',
			hover: '#e8e8e8',
			selected: '#d4d4d4'
		}
	},

	// 5. Colorful - vibrant colors
	COLORFUL: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂',
			code: '💻',
			image: '🖼️',
			doc: '📝',
			video: '🎬',
			audio: '🎵',
			archive: '📦',
			config: '⚙️'
		},
		colors: {
			folder: '#ff6b35',
			file: '#4ecdc4',
			open: '#95e1d3',
			code: '#6c5ce7',
			image: '#fd79a8',
			doc: '#fdcb6e'
		}
	},

	// 6. Material Dark
	MATERIAL_DARK: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#82aaff',
			file: '#b0bec5',
			open: '#89ddff',
			background: '#263238',
			hover: '#2c3b41',
			selected: '#314549'
		}
	},

	// 7. Material Light
	MATERIAL_LIGHT: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#0277bd',
			file: '#546e7a',
			background: '#fafafa',
			hover: '#f5f5f5',
			selected: '#e0e0e0'
		}
	},

	// 8. ASCII Classic - classic terminal look
	ASCII: {
		asciiStyle: 'ascii',
		indent: 2,
		icons: {
			folder: '[+]',
			file: '[-]',
			open: '[-]'
		},
		colors: {
			folder: 'green',
			file: 'white',
			open: 'lime'
		}
	},

	// 9. ASCII Compact
	ASCII_COMPACT: {
		asciiStyle: 'ascii',
		indent: 1,
		icons: {
			folder: '+',
			file: '-',
			open: '-'
		},
		colors: {
			folder: 'cyan',
			file: 'gray'
		}
	},

	// 10. Monochrome - black and white
	MONOCHROME: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '▶',
			file: '○',
			open: '▼'
		},
		colors: {
			folder: '#000000',
			file: '#666666',
			open: '#000000',
			background: '#ffffff',
			hover: '#f0f0f0',
			selected: '#e0e0e0'
		}
	},

	// 11. Solarized Dark
	SOLARIZED_DARK: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#268bd2',
			file: '#839496',
			open: '#2aa198',
			background: '#002b36',
			hover: '#073642',
			selected: '#586e75'
		}
	},

	// 12. Dracula
	DRACULA: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#bd93f9',
			file: '#f8f8f2',
			open: '#8be9fd',
			background: '#282a36',
			hover: '#44475a',
			selected: '#6272a4'
		}
	},

	// 13. Nord
	NORD: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#88c0d0',
			file: '#d8dee9',
			open: '#8fbcbb',
			background: '#2e3440',
			hover: '#3b4252',
			selected: '#4c566a'
		}
	},

	// 14. One Dark
	ONE_DARK: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#61afef',
			file: '#abb2bf',
			open: '#56b6c2',
			background: '#282c34',
			hover: '#2c323c',
			selected: '#3e4451'
		}
	},

	// 15. High Contrast - Accessibility
	HIGH_CONTRAST: {
		asciiStyle: 'unicode',
		indent: 3,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		},
		colors: {
			folder: '#0000ff',
			file: '#000000',
			open: '#0000ff',
			background: '#ffffff',
			hover: '#ffff00',
			selected: '#00ffff',
			border: '#000000'
		}
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
