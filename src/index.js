// Main TreeForge class
export { TreeForge } from "./treeforge.js";

// Configuration presets (15 ready-to-use configs)
export { ConfigPresets, getPreset, mergePresets, listPresets } from "./config-presets.js";

// Style themes (15 visual themes)
export { TreeStyles } from "./tree-styles.js";

// Hook utilities and examples
export { 
	LocalStorageHooks, 
	RestApiHooks, 
	AnalyticsHooks, 
	ValidationHooks, 
	CacheHooks, 
	AutoSaveHooks,
	combineHooks 
} from "./tree-hooks.js";

// Configuration utilities
export { 
	SettingsReference,
	EditorConfigReference,
	TreeDataStructure,
	SimpleTreeConfig,
	FileManagerConfig,
	GitHubCloneConfig,
	VSCodeCloneConfig,
	DocsBrowserConfig,
	TerminalConfig,
	createConfig,
	validateConfig
} from "./tree-config.js";

// Configuration system
export { 
	DEFAULT_CONFIG,
	processConfig,
	getConfigHelp,
	createFromPreset
} from "./config-system.js";
