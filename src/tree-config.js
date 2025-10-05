/**
	* TreeForge Complete Configuration Options
	* All available settings for TreeForge initialization
	*/

// ============ COMPLETE CONFIGURATION REFERENCE ============

/**
	* TreeForge Constructor Config
	* 
	* new TreeForge({
	*   containerId: string,         // REQUIRED: DOM element ID to render tree
	*   localData: object,            // Tree data (for local mode)
	*   settings: object,             // Display settings
	*   hooks: object,                // Event handlers
	*   onLoad: function,             // Data loader (for API mode)
	*   editorConfig: object,         // Editor configuration
	*   onFileOpen: function          // File open callback
	* })
	*/

// ============ SETTINGS OPTIONS ============

export const SettingsReference = {
	// ASCII style: 'unicode' or 'ascii'
	asciiStyle: 'unicode', // or 'ascii'

	// Indentation spaces per level
	indent: 2, // number of spaces

	// Colors for tree elements
	colors: {
		folder: '#0366d6',      // Folder text color
		file: '#586069',        // File text color
		open: '#0366d6',        // Open folder color
		background: '#ffffff',  // Tree background
		hover: '#f6f8fa',       // Hover state color
		selected: '#e1e4e8',    // Selected item color
		border: '#e1e4e8'       // Border color
	},

	// Icons for different file types
	icons: {
		// Basic icons
		folder: '📁',
		file: '📄',
		open: '📂',

		// File type specific icons
		js: '💛',
		ts: '🔷',
		json: '📋',
		md: '📝',
		css: '🎨',
		html: '🌐',

		// Media icons
		image: '🖼️',
		video: '🎬',
		audio: '🎵',

		// Other icons
		archive: '📦',
		config: '⚙️',
		git: '🔀',
		lock: '🔒',
		code: '💻',
		doc: '📝'
	}
};

// ============ EDITOR CONFIG OPTIONS ============

export const EditorConfigReference = {
	// Built-in editor
	useBuiltInEditor: true, // or false for custom editor

	// Editor DOM element IDs (for built-in editor)
	inputId: 'file-editor',      // Textarea element ID
	filenameId: 'editor-filename', // Filename display element ID
	saveButtonId: 'save-btn',     // Save button element ID
	closeButtonId: 'close-btn',   // Close button element ID

	// Custom editor function
	customEditor: null // or function(path, content, onSave) { ... }
};

// ============ DATA STRUCTURE ============

export const TreeDataStructure = {
	// Basic node structure
	name: 'src',           // Node name (required)
	type: 'folder',        // 'folder' or 'file' (required)
	children: [],          // Array of child nodes (for folders)

	// Optional properties
	id: 'unique-id',       // Unique identifier
	path: 'path/to/node',  // Full path
	size: 1024,            // File size in bytes
	modified: '2024-01-01', // Last modified date
	permissions: 'rw-r--r--', // Unix permissions
	icon: '📁',            // Custom icon
	color: '#0366d6',      // Custom color
	metadata: {}           // Any custom data
};

// ============ PRESET CONFIGURATIONS ============

// Simple Tree (minimal features)
export const SimpleTreeConfig = {
	settings: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: { folder: '📁', file: '📄' },
		colors: { folder: 'cyan', file: 'white' }
	}
};

// File Manager (full features with editor)
export const FileManagerConfig = {
	settings: {
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
			html: '🌐'
		},
		colors: {
			folder: '#0366d6',
			file: '#586069',
			hover: '#f6f8fa',
			selected: '#e1e4e8'
		}
	},
	editorConfig: {
		useBuiltInEditor: true,
		inputId: 'file-editor',
		filenameId: 'editor-filename',
		saveButtonId: 'save-btn',
		closeButtonId: 'close-btn'
	}
};

// GitHub Clone Style
export const GitHubCloneConfig = {
	settings: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂',
			js: '📜',
			json: '⚙️',
			md: '📝',
			git: '🔀'
		},
		colors: {
			folder: '#0366d6',
			file: '#586069',
			open: '#0366d6',
			background: '#ffffff',
			hover: '#f6f8fa',
			selected: '#e1e4e8',
			border: '#e1e4e8'
		}
	}
};

// VS Code Clone Style
export const VSCodeCloneConfig = {
	settings: {
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
			html: '🌐'
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
	editorConfig: {
		useBuiltInEditor: true,
		inputId: 'file-editor',
		filenameId: 'editor-filename',
		saveButtonId: 'save-btn',
		closeButtonId: 'close-btn'
	}
};

// Documentation Browser (read-only)
export const DocsBrowserConfig = {
	settings: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: {
			folder: '📁',
			file: '📄',
			md: '📝',
			doc: '📝'
		},
		colors: {
			folder: '#0366d6',
			file: '#586069',
			background: '#f6f8fa'
		}
	},
	editorConfig: {
		useBuiltInEditor: false
	}
};

// ASCII Terminal Style
export const TerminalConfig = {
	settings: {
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
			open: 'lime',
			background: 'black'
		}
	}
};

// ============ CONFIGURATION BUILDER ============

/**
	* Create custom configuration by merging presets
	* @param {...Object} configs - Configuration objects to merge
	* @returns {Object} Merged configuration
	*/
export function createConfig(...configs) {
	const merged = {
		settings: {
			icons: {},
			colors: {}
		},
		editorConfig: {},
		hooks: {}
	};

	for (const config of configs) {
		if (config.settings) {
			Object.assign(merged.settings, config.settings);
			if (config.settings.icons) {
				Object.assign(merged.settings.icons, config.settings.icons);
			}
			if (config.settings.colors) {
				Object.assign(merged.settings.colors, config.settings.colors);
			}
		}
		if (config.editorConfig) {
			Object.assign(merged.editorConfig, config.editorConfig);
		}
		if (config.hooks) {
			Object.assign(merged.hooks, config.hooks);
		}
	}

	return merged;
}

// ============ VALIDATION ============

/**
	* Validate TreeForge configuration
	* @param {Object} config - Configuration object
	* @returns {Array<string>} Array of error messages (empty if valid)
	*/
export function validateConfig(config) {
	const errors = [];

	// Check required fields
	if (!config.containerId) {
		errors.push('containerId is required');
	}

	// Check data source
	if (!config.localData && !config.onLoad) {
		errors.push('Either localData or onLoad must be provided');
	}

	// Validate settings
	if (config.settings) {
		if (config.settings.asciiStyle && !['unicode', 'ascii'].includes(config.settings.asciiStyle)) {
			errors.push('asciiStyle must be "unicode" or "ascii"');
		}

		if (config.settings.indent && typeof config.settings.indent !== 'number') {
			errors.push('indent must be a number');
		}
	}

	// Validate editor config
	if (config.editorConfig && config.editorConfig.useBuiltInEditor) {
		const required = ['inputId', 'filenameId', 'saveButtonId', 'closeButtonId'];
		for (const field of required) {
			if (!config.editorConfig[field]) {
				errors.push(`editorConfig.${field} is required when using built-in editor`);
			}
		}
	}

	return errors;
}

// ============ USAGE EXAMPLES ============

// Example 1: Minimal setup
export const example1 = {
	containerId: 'tree',
	localData: { name: 'root', type: 'folder', children: [] }
};

// Example 2: With API backend
export const example2 = {
	containerId: 'tree',
	onLoad: async () => {
		const response = await fetch('/api/tree');
		return await response.json();
	},
	hooks: {
		onCreateFile: async (path) => {
			await fetch('/api/files', {
				method: 'POST',
				body: JSON.stringify({ path })
			});
		}
	}
};

// Example 3: Full configuration
export const example3 = {
	containerId: 'tree',
	localData: { name: 'root', type: 'folder', children: [] },
	settings: {
		asciiStyle: 'unicode',
		indent: 2,
		icons: { folder: '📁', file: '📄', open: '📂' },
		colors: { folder: '#0366d6', file: '#586069' }
	},
	editorConfig: {
		useBuiltInEditor: true,
		inputId: 'editor',
		filenameId: 'filename',
		saveButtonId: 'save',
		closeButtonId: 'close'
	},
	hooks: {
		onCreateFile: (path) => console.log('Created:', path),
		onDeleteFile: (path) => console.log('Deleted:', path),
		onReadFile: (path) => localStorage.getItem(path) || '',
		onWriteFile: (path, content) => localStorage.setItem(path, content)
	},
	onFileOpen: (path, content) => {
		console.log(`Opened ${path}: ${content.length} bytes`);
	}
};

// Example 4: Using preset and custom config
export const example4 = createConfig(
	VSCodeCloneConfig,
	{
		hooks: {
			onCreateFile: (path) => console.log('File created:', path)
		}
	}
);
