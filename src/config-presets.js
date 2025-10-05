/**
	* TreeForge Configuration Presets
	* Ready-to-use configurations for common use cases
	*/

import { TreeStyles } from './tree-styles.js';

export const ConfigPresets = {
	/**
		* MINIMAL - Basic tree with no extras
		* Perfect for: Simple file listings, minimal UI
		*/
	MINIMAL: {
		settings: TreeStyles.MINIMAL,
		features: {
			contextMenu: false,
			dragDrop: false,
			search: false,
			keyboard: true
		}
	},

	/**
		* GITHUB_CLONE - GitHub-style repository browser
		* Perfect for: Repository browsing, code exploration
		*/
	GITHUB_CLONE: {
		settings: TreeStyles.GITHUB,
		features: {
			contextMenu: true,
			dragDrop: false,
			search: true,
			keyboard: true,
			filePreview: true
		},
		contextMenuItems: ['open', 'copy-path', 'download'],
		shortcuts: {
			'Ctrl+F': 'search',
			'Enter': 'open-file',
			'ArrowUp': 'navigate-up',
			'ArrowDown': 'navigate-down'
		}
	},

	/**
		* VSCODE_CLONE - VS Code style editor
		* Perfect for: Code editors, IDE interfaces
		*/
	VSCODE_CLONE: {
		settings: TreeStyles.VSCODE_DARK,
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: true,
			editor: true,
			filePreview: true
		},
		editorConfig: {
			useBuiltInEditor: true,
			syntax: true,
			autoSave: true,
			tabSize: 2
		},
		contextMenuItems: [
			'new-file',
			'new-folder',
			'separator',
			'rename',
			'delete',
			'separator',
			'copy',
			'paste',
			'duplicate',
			'separator',
			'copy-path',
			'copy-relative-path'
		],
		shortcuts: {
			'Ctrl+N': 'new-file',
			'Ctrl+Shift+N': 'new-folder',
			'F2': 'rename',
			'Delete': 'delete',
			'Ctrl+C': 'copy',
			'Ctrl+V': 'paste',
			'Ctrl+F': 'search'
		}
	},

	/**
		* FILE_MANAGER - Full-featured file manager
		* Perfect for: File operations, content management
		*/
	FILE_MANAGER: {
		settings: TreeStyles.MATERIAL_DARK,
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: true,
			multiSelect: true,
			bulkOperations: true,
			filePreview: true,
			breadcrumbs: true
		},
		contextMenuItems: [
			'open',
			'open-with',
			'separator',
			'new-file',
			'new-folder',
			'upload',
			'separator',
			'cut',
			'copy',
			'paste',
			'duplicate',
			'separator',
			'rename',
			'delete',
			'separator',
			'properties',
			'share',
			'compress'
		],
		toolbar: {
			enabled: true,
			buttons: ['new', 'upload', 'download', 'delete', 'refresh', 'view-options']
		},
		shortcuts: {
			'Ctrl+N': 'new-file',
			'Ctrl+Shift+N': 'new-folder',
			'Ctrl+U': 'upload',
			'F2': 'rename',
			'Delete': 'delete',
			'Ctrl+A': 'select-all',
			'Ctrl+X': 'cut',
			'Ctrl+C': 'copy',
			'Ctrl+V': 'paste',
			'Ctrl+D': 'duplicate',
			'F5': 'refresh'
		}
	},

	/**
		* DOCS_BROWSER - Documentation browser
		* Perfect for: Documentation sites, knowledge bases
		*/
	DOCS_BROWSER: {
		settings: {
			...TreeStyles.GITHUB,
			icons: {
				folder: '📁',
				file: '📝',
				md: '📝',
				doc: '📘',
				pdf: '📕'
			}
		},
		features: {
			contextMenu: true,
			dragDrop: false,
			search: true,
			keyboard: true,
			filePreview: true,
			tableOfContents: true
		},
		contextMenuItems: ['open', 'open-in-new-tab', 'separator', 'bookmark', 'print', 'share'],
		toolbar: {
			enabled: true,
			buttons: ['home', 'back', 'forward', 'search', 'bookmark', 'print']
		},
		shortcuts: {
			'Ctrl+F': 'search',
			'Ctrl+B': 'bookmark',
			'Ctrl+P': 'print',
			'Alt+Left': 'back',
			'Alt+Right': 'forward'
		}
	},

	/**
		* MEDIA_BROWSER - Media library browser
		* Perfect for: Photo galleries, video libraries
		*/
	MEDIA_BROWSER: {
		settings: {
			...TreeStyles.COLORFUL,
			icons: {
				folder: '📁',
				file: '📄',
				image: '🖼️',
				video: '🎬',
				audio: '🎵',
				jpg: '🖼️',
				png: '🖼️',
				gif: '🖼️',
				mp4: '🎬',
				mp3: '🎵'
			}
		},
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: true,
			thumbnails: true,
			gridView: true,
			filePreview: true
		},
		contextMenuItems: [
			'open',
			'preview',
			'separator',
			'download',
			'share',
			'separator',
			'rename',
			'move',
			'delete',
			'separator',
			'properties'
		],
		viewOptions: {
			defaultView: 'grid',
			thumbnailSize: 'medium',
			showFileInfo: true
		},
		shortcuts: {
			'Space': 'preview',
			'Enter': 'open',
			'Delete': 'delete',
			'Ctrl+A': 'select-all',
			'Ctrl+D': 'download'
		}
	},

	/**
		* CODE_EDITOR - Lightweight code editor
		* Perfect for: Online code editors, code playgrounds
		*/
	CODE_EDITOR: {
		settings: TreeStyles.ONE_DARK,
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: true,
			editor: true,
			syntaxHighlight: true
		},
		editorConfig: {
			useBuiltInEditor: true,
			syntax: true,
			lineNumbers: true,
			autoComplete: true,
			autoSave: true,
			tabSize: 2,
			theme: 'one-dark'
		},
		contextMenuItems: [
			'new-file',
			'new-folder',
			'separator',
			'rename',
			'delete',
			'separator',
			'format',
			'lint',
			'separator',
			'copy-path'
		],
		shortcuts: {
			'Ctrl+S': 'save',
			'Ctrl+N': 'new-file',
			'Ctrl+F': 'find',
			'Ctrl+H': 'replace',
			'F2': 'rename',
			'Alt+Shift+F': 'format'
		}
	},

	/**
		* TERMINAL_STYLE - Terminal/CLI aesthetic
		* Perfect for: Command-line tools, system admin
		*/
	TERMINAL_STYLE: {
		settings: TreeStyles.ASCII,
		features: {
			contextMenu: false,
			dragDrop: false,
			search: true,
			keyboard: true
		},
		shortcuts: {
			'/': 'search',
			'h': 'navigate-left',
			'j': 'navigate-down',
			'k': 'navigate-up',
			'l': 'navigate-right',
			'Enter': 'open'
		}
	},

	/**
		* COMPACT - Minimal space usage
		* Perfect for: Sidebars, dashboards
		*/
	COMPACT: {
		settings: TreeStyles.ASCII_COMPACT,
		features: {
			contextMenu: true,
			dragDrop: false,
			search: true,
			keyboard: true
		},
		display: {
			indent: 1,
			fontSize: 12,
			lineHeight: 1.2,
			showFileExtension: false
		}
	},

	/**
		* ACCESSIBLE - Maximum accessibility
		* Perfect for: Screen readers, keyboard-only users
		*/
	ACCESSIBLE: {
		settings: TreeStyles.HIGH_CONTRAST,
		features: {
			contextMenu: true,
			dragDrop: false,
			search: true,
			keyboard: true,
			screenReader: true,
			focusIndicators: true
		},
		accessibility: {
			ariaLabels: true,
			keyboardNavigation: true,
			highContrast: true,
			focusVisible: true,
			announceChanges: true
		},
		shortcuts: {
			'Tab': 'next-item',
			'Shift+Tab': 'previous-item',
			'Enter': 'activate',
			'Space': 'select',
			'ArrowDown': 'next',
			'ArrowUp': 'previous',
			'ArrowRight': 'expand',
			'ArrowLeft': 'collapse'
		}
	},

	/**
		* MOBILE_OPTIMIZED - Touch-friendly mobile interface
		* Perfect for: Mobile apps, responsive designs
		*/
	MOBILE_OPTIMIZED: {
		settings: TreeStyles.MATERIAL_LIGHT,
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: false,
			touch: true,
			swipeActions: true
		},
		display: {
			indent: 4,
			fontSize: 16,
			touchTargetSize: 44,
			compactMode: true
		},
		gestures: {
			swipeLeft: 'delete',
			swipeRight: 'archive',
			longPress: 'context-menu',
			doubleTap: 'open'
		}
	},

	/**
		* LARGE_DATASET - Optimized for huge file systems
		* Perfect for: Enterprise systems, big data
		*/
	LARGE_DATASET: {
		settings: TreeStyles.MINIMAL,
		features: {
			contextMenu: true,
			dragDrop: false,
			search: true,
			keyboard: true,
			virtualScroll: true,
			lazyLoading: true,
			pagination: true
		},
		performance: {
			virtualScrolling: true,
			lazyLoad: true,
			cacheSize: 1000,
			renderBatchSize: 50,
			debounceSearch: 300
		},
		shortcuts: {
			'Ctrl+F': 'search',
			'PageDown': 'page-down',
			'PageUp': 'page-up',
			'Home': 'go-top',
			'End': 'go-bottom'
		}
	},

	/**
		* COLLABORATIVE - Real-time collaboration
		* Perfect for: Team workspaces, shared projects
		*/
	COLLABORATIVE: {
		settings: TreeStyles.VSCODE_LIGHT,
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: true,
			presence: true,
			liveUpdates: true,
			comments: true
		},
		collaboration: {
			showPresence: true,
			showCursors: true,
			enableComments: true,
			enableChat: true,
			conflictResolution: 'last-write-wins'
		},
		contextMenuItems: [
			'open',
			'separator',
			'share',
			'invite',
			'permissions',
			'separator',
			'comment',
			'mention',
			'separator',
			'history',
			'restore'
		]
	},

	/**
		* READ_ONLY - View-only mode
		* Perfect for: Public documentation, read-only access
		*/
	READ_ONLY: {
		settings: TreeStyles.GITHUB,
		features: {
			contextMenu: true,
			dragDrop: false,
			search: true,
			keyboard: true,
			editing: false
		},
		contextMenuItems: ['open', 'copy-path', 'download', 'share'],
		shortcuts: {
			'Ctrl+F': 'search',
			'Enter': 'open',
			'Ctrl+C': 'copy-path'
		}
	},

	/**
		* DRACULA_THEME - Dracula color scheme
		* Perfect for: Dark theme lovers
		*/
	DRACULA_THEME: {
		settings: TreeStyles.DRACULA,
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: true,
			editor: true
		}
	},

	/**
		* NORD_THEME - Nord color scheme
		* Perfect for: Nordic aesthetic
		*/
	NORD_THEME: {
		settings: TreeStyles.NORD,
		features: {
			contextMenu: true,
			dragDrop: true,
			search: true,
			keyboard: true,
			editor: true
		}
	}
};

/**
	* Get preset by name
	* @param {string} name - Preset name
	* @returns {object} Preset configuration
	*/
export function getPreset(name) {
	const preset = ConfigPresets[name];
	if (!preset) {
		throw new Error(`Preset "${name}" not found. Available: ${Object.keys(ConfigPresets).join(', ')}`);
	}
	return JSON.parse(JSON.stringify(preset)); // Deep clone
}

/**
	* Merge presets
	* @param {...string} presetNames - Preset names to merge
	* @returns {object} Merged configuration
	*/
export function mergePresets(...presetNames) {
	const merged = {
		settings: {},
		features: {},
		contextMenuItems: [],
		shortcuts: {}
	};

	for (const name of presetNames) {
		const preset = getPreset(name);
		Object.assign(merged.settings, preset.settings);
		Object.assign(merged.features, preset.features);
		Object.assign(merged.shortcuts, preset.shortcuts);
		if (preset.contextMenuItems) {
			merged.contextMenuItems.push(...preset.contextMenuItems);
		}
	}

	return merged;
}

/**
	* List all available presets
	* @returns {string[]} Array of preset names
	*/
export function listPresets() {
	return Object.keys(ConfigPresets);
}
