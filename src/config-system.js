/**
	* TreeForge Configuration System
	* Handles configuration processing, merging, and defaults
	*/

/**
	* Default configuration
	*/
export const DEFAULT_CONFIG = {
	// Required
	containerId: null,

	// Data source
	localData: null,
	onLoad: null,

	// Display settings
	settings: {
		asciiStyle: 'unicode',
		indent: 2,
		colors: {
			folder: '#0366d6',
			file: '#586069',
			open: '#0366d6',
			background: '#ffffff',
			hover: '#f6f8fa',
			selected: '#e1e4e8',
			border: '#e1e4e8'
		},
		icons: {
			folder: '📁',
			file: '📄',
			open: '📂'
		}
	},

	// Features
	features: {
		contextMenu: true,
		dragDrop: false,
		search: false,
		keyboard: true,
		editor: false,
		multiSelect: false,
		virtualScroll: false
	},

	// Editor configuration
	editorConfig: {
		useBuiltInEditor: false,
		inputId: null,
		filenameId: null,
		saveButtonId: null,
		closeButtonId: null
	},

	// Hooks
	hooks: {},

	// Callbacks
	onFileOpen: null
};

/**
	* Process and merge configuration
	* @param {object} userConfig - User provided configuration
	* @returns {object} Processed configuration
	*/
export function processConfig(userConfig) {
	// Deep clone default config
	const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

	// Merge user config
	mergeDeep(config, userConfig);

	return config;
}

/**
	* Deep merge objects
	* @param {object} target - Target object
	* @param {object} source - Source object
	*/
function mergeDeep(target, source) {
	for (const key in source) {
		if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
			if (!target[key]) target[key] = {};
			mergeDeep(target[key], source[key]);
		} else {
			target[key] = source[key];
		}
	}
}

/**
	* Validate configuration
	* @param {object} config - Configuration to validate
	* @returns {object} Validation result { valid: boolean, errors: string[] }
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
	if (config.editorConfig?.useBuiltInEditor) {
		const required = ['inputId', 'filenameId', 'saveButtonId', 'closeButtonId'];
		for (const field of required) {
			if (!config.editorConfig[field]) {
				errors.push(`editorConfig.${field} is required when using built-in editor`);
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
	* Get configuration help
	* @param {string} section - Configuration section (optional)
	* @returns {string} Help text
	*/
export function getConfigHelp(section = null) {
	const help = {
		settings: `
Settings Configuration:
- asciiStyle: 'unicode' or 'ascii' (tree line style)
- indent: number (spaces per level)
- colors: object (color scheme)
- icons: object (icon mappings)

Example:
settings: {
  asciiStyle: 'unicode',
  indent: 2,
  colors: { folder: '#0366d6', file: '#586069' },
  icons: { folder: '📁', file: '📄' }
}
		`.trim(),

		hooks: `
Hooks Configuration:
Available hooks:
- onCreateFile(path, parentNode)
- onCreateFolder(path, parentNode)
- onDeleteFile(path, node)
- onDeleteFolder(path, node)
- onDeleteNode(path, node)
- onRenameNode(oldPath, newPath, node)
- onReadFile(path, node)
- onWriteFile(path, content, node)
- onLoad()
- onFileOpen(path, content, node)

All hooks support async/await.

Example:
hooks: {
  onReadFile: async (path) => {
    const response = await fetch(\`/api/files?path=\${path}\`);
    return await response.text();
  }
}
		`.trim(),

		features: `
Features Configuration:
- contextMenu: boolean (right-click menu)
- dragDrop: boolean (drag and drop support)
- search: boolean (search functionality)
- keyboard: boolean (keyboard shortcuts)
- editor: boolean (file editor)
- multiSelect: boolean (select multiple items)
- virtualScroll: boolean (virtual scrolling for large trees)

Example:
features: {
  contextMenu: true,
  dragDrop: true,
  search: true,
  keyboard: true
}
		`.trim(),

		editorConfig: `
Editor Configuration:
- useBuiltInEditor: boolean (use built-in editor)
- inputId: string (textarea element ID)
- filenameId: string (filename display element ID)
- saveButtonId: string (save button ID)
- closeButtonId: string (close button ID)
- customEditor: function (custom editor function)

Example:
editorConfig: {
  useBuiltInEditor: true,
  inputId: 'file-editor',
  filenameId: 'editor-filename',
  saveButtonId: 'save-btn',
  closeButtonId: 'close-btn'
}
		`.trim()
	};

	if (section) {
		return help[section] || `No help available for section: ${section}`;
	}

	return Object.entries(help)
		.map(([name, text]) => `${name.toUpperCase()}:\n${text}`)
		.join('\n\n');
}

/**
	* Create configuration from preset
	* @param {string} presetName - Name of preset
	* @param {object} overrides - Configuration overrides
	* @returns {object} Configuration
	*/
export function createFromPreset(presetName, overrides = {}) {
	const { ConfigPresets } = require('./config-presets.js');
	const preset = ConfigPresets[presetName];

	if (!preset) {
		throw new Error(`Preset "${presetName}" not found`);
	}

	const config = JSON.parse(JSON.stringify(preset));
	mergeDeep(config, overrides);

	return config;
}
