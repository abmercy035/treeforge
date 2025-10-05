/**
	* TreeForge Configuration Validator
	* Comprehensive validation with helpful error messages and suggestions
	*/

import { DEFAULT_CONFIG } from './config-system.js';

// Validation severity levels
export const SEVERITY = {
	ERROR: 'error',
	WARNING: 'warning',
	INFO: 'info'
};

// Validation categories
export const CATEGORY = {
	REQUIRED: 'required',
	TYPE: 'type',
	RANGE: 'range',
	COMPATIBILITY: 'compatibility',
	PERFORMANCE: 'performance',
	SECURITY: 'security',
	ACCESSIBILITY: 'accessibility'
};

/**
	* Main validation function
	*/
export function validateConfig(config) {
	const issues = [];

	// Required field validations
	issues.push(...validateRequired(config));

	// Type validations
	issues.push(...validateTypes(config));

	// Range validations
	issues.push(...validateRanges(config));

	// Compatibility validations
	issues.push(...validateCompatibility(config));

	// Performance validations
	issues.push(...validatePerformance(config));

	// Security validations
	issues.push(...validateSecurity(config));

	// Accessibility validations
	issues.push(...validateAccessibility(config));

	// Cross-setting validations
	issues.push(...validateCrossSettings(config));

	return {
		isValid: !issues.some(i => i.severity === SEVERITY.ERROR),
		errors: issues.filter(i => i.severity === SEVERITY.ERROR),
		warnings: issues.filter(i => i.severity === SEVERITY.WARNING),
		info: issues.filter(i => i.severity === SEVERITY.INFO),
		all: issues
	};
}

/**
	* Validate required fields
	*/
function validateRequired(config) {
	const issues = [];

	if (!config.containerId) {
		issues.push({
			severity: SEVERITY.ERROR,
			category: CATEGORY.REQUIRED,
			field: 'containerId',
			message: 'containerId is required',
			suggestion: 'Set containerId to the ID of your DOM element, e.g., "my-tree"',
			example: `containerId: 'my-tree'`
		});
	}

	if (config.dataSource?.type === 'ajax' && !config.dataSource.url) {
		issues.push({
			severity: SEVERITY.ERROR,
			category: CATEGORY.REQUIRED,
			field: 'dataSource.url',
			message: 'dataSource.url is required when type is "ajax"',
			suggestion: 'Provide a URL to fetch data from',
			example: `dataSource: { type: 'ajax', url: '/api/tree-data' }`
		});
	}

	return issues;
}

/**
	* Validate data types
	*/
function validateTypes(config) {
	const issues = [];

	// String validations
	const stringFields = [
		{ path: 'containerId', name: 'containerId' },
		{ path: 'rootPath', name: 'rootPath' },
		{ path: 'theme.name', name: 'theme.name' }
	];

	stringFields.forEach(({ path, name }) => {
		const value = getNestedValue(config, path);
		if (value !== null && value !== undefined && typeof value !== 'string') {
			issues.push({
				severity: SEVERITY.ERROR,
				category: CATEGORY.TYPE,
				field: name,
				message: `${name} must be a string, got ${typeof value}`,
				suggestion: `Change ${name} to a string value`,
				example: `${name}: 'your-value-here'`
			});
		}
	});

	// Number validations
	const numberFields = [
		{ path: 'tree.indentSize', name: 'tree.indentSize', min: 0 },
		{ path: 'tree.iconSize', name: 'tree.iconSize', min: 0 },
		{ path: 'tree.lineHeight', name: 'tree.lineHeight', min: 0 },
		{ path: 'tree.animationDuration', name: 'tree.animationDuration', min: 0 },
		{ path: 'layout.width', name: 'layout.width', min: 0 },
		{ path: 'performance.maxVisibleNodes', name: 'performance.maxVisibleNodes', min: 1 }
	];

	numberFields.forEach(({ path, name, min }) => {
		const value = getNestedValue(config, path);
		if (value !== null && value !== undefined) {
			if (typeof value !== 'number') {
				issues.push({
					severity: SEVERITY.ERROR,
					category: CATEGORY.TYPE,
					field: name,
					message: `${name} must be a number, got ${typeof value}`,
					suggestion: `Change ${name} to a numeric value`,
					example: `${name}: ${min || 100}`
				});
			} else if (min !== undefined && value < min) {
				issues.push({
					severity: SEVERITY.ERROR,
					category: CATEGORY.RANGE,
					field: name,
					message: `${name} must be >= ${min}, got ${value}`,
					suggestion: `Set ${name} to at least ${min}`,
					example: `${name}: ${min}`
				});
			}
		}
	});

	// Boolean validations
	const booleanFields = [
		'autoLoad', 'tree.showRoot', 'tree.showIcons', 'tree.animations',
		'search.enabled', 'editor.enabled', 'debug.enabled'
	];

	booleanFields.forEach(path => {
		const value = getNestedValue(config, path);
		if (value !== null && value !== undefined && typeof value !== 'boolean') {
			issues.push({
				severity: SEVERITY.ERROR,
				category: CATEGORY.TYPE,
				field: path,
				message: `${path} must be a boolean, got ${typeof value}`,
				suggestion: `Change ${path} to true or false`,
				example: `${path}: true`
			});
		}
	});

	// Array validations
	if (config.toolbar?.buttons && !Array.isArray(config.toolbar.buttons)) {
		issues.push({
			severity: SEVERITY.ERROR,
			category: CATEGORY.TYPE,
			field: 'toolbar.buttons',
			message: 'toolbar.buttons must be an array',
			suggestion: 'Provide an array of button names',
			example: `toolbar: { buttons: ['refresh', 'new-file', 'new-folder'] }`
		});
	}

	return issues;
}

/**
	* Validate value ranges
	*/
function validateRanges(config) {
	const issues = [];

	// Indent size validation
	if (config.tree?.indentSize > 100) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.RANGE,
			field: 'tree.indentSize',
			message: 'tree.indentSize is very large (> 100px)',
			suggestion: 'Consider using a smaller indent size (typically 16-24px)',
			example: 'tree: { indentSize: 20 }'
		});
	}

	// Icon size validation
	if (config.tree?.iconSize > 64) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.RANGE,
			field: 'tree.iconSize',
			message: 'tree.iconSize is very large (> 64px)',
			suggestion: 'Large icons may affect layout. Consider 16-32px range',
			example: 'tree: { iconSize: 20 }'
		});
	}

	// Animation duration validation
	if (config.tree?.animationDuration > 1000) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.RANGE,
			field: 'tree.animationDuration',
			message: 'tree.animationDuration is very long (> 1s)',
			suggestion: 'Long animations may feel sluggish. Consider 100-300ms',
			example: 'tree: { animationDuration: 200 }'
		});
	}

	// Cache size validation
	if (config.performance?.cacheSize > 1000) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.RANGE,
			field: 'performance.cacheSize',
			message: 'performance.cacheSize is very large (> 1000)',
			suggestion: 'Large cache may consume excessive memory',
			example: 'performance: { cacheSize: 100 }'
		});
	}

	// Max visible nodes validation
	if (config.performance?.maxVisibleNodes > 10000) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.RANGE,
			field: 'performance.maxVisibleNodes',
			message: 'performance.maxVisibleNodes is very large (> 10000)',
			suggestion: 'Consider enabling virtualScroll for better performance',
			example: 'performance: { maxVisibleNodes: 1000, virtualScroll: true }'
		});
	}

	return issues;
}

/**
	* Validate compatibility between settings
	*/
function validateCompatibility(config) {
	const issues = [];

	// Multi-select requires selection
	if (config.tree?.multiSelect && config.tree.selectOnClick === false) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.COMPATIBILITY,
			field: 'tree.multiSelect',
			message: 'tree.multiSelect is enabled but selectOnClick is false',
			suggestion: 'Enable selectOnClick for multi-select to work properly',
			example: 'tree: { multiSelect: true, selectOnClick: true }'
		});
	}

	// Drag and drop with virtual scroll
	if (config.tree?.dragAndDrop && config.performance?.virtualScroll) {
		issues.push({
			severity: SEVERITY.INFO,
			category: CATEGORY.COMPATIBILITY,
			field: 'tree.dragAndDrop',
			message: 'Drag and drop with virtual scroll may have limited functionality',
			suggestion: 'Test thoroughly or disable virtualScroll for full drag support',
			example: 'performance: { virtualScroll: false }'
		});
	}

	// Editor without split layout
	if (config.editor?.enabled && config.layout?.type !== 'split') {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.COMPATIBILITY,
			field: 'editor.enabled',
			message: 'Editor is enabled but layout is not "split"',
			suggestion: 'Use split layout to show both tree and editor',
			example: 'layout: { type: "split" }'
		});
	}

	// Search in toolbar without toolbar
	if (config.search?.enabled && config.search.position === 'toolbar' && !config.toolbar?.enabled) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.COMPATIBILITY,
			field: 'search.position',
			message: 'Search position is "toolbar" but toolbar is not enabled',
			suggestion: 'Enable toolbar or change search position',
			example: 'toolbar: { enabled: true }'
		});
	}

	// Click behavior conflicts
	if (config.tree?.clickToOpen && config.tree.doubleClickToOpen) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.COMPATIBILITY,
			field: 'tree.clickToOpen',
			message: 'Both clickToOpen and doubleClickToOpen are enabled',
			suggestion: 'Enable only one click behavior to avoid confusion',
			example: 'tree: { clickToOpen: true, doubleClickToOpen: false }'
		});
	}

	return issues;
}

/**
	* Validate performance settings
	*/
function validatePerformance(config) {
	const issues = [];

	// Animations with large trees
	if (config.tree?.animations && config.performance?.maxVisibleNodes > 5000) {
		issues.push({
			severity: SEVERITY.INFO,
			category: CATEGORY.PERFORMANCE,
			field: 'tree.animations',
			message: 'Animations enabled with large tree (> 5000 nodes)',
			suggestion: 'Consider disabling animations for better performance',
			example: 'tree: { animations: false }'
		});
	}

	// No lazy loading with large dataset
	if (!config.performance?.lazyLoading && config.performance?.maxVisibleNodes > 1000) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.PERFORMANCE,
			field: 'performance.lazyLoading',
			message: 'Lazy loading disabled with large tree (> 1000 nodes)',
			suggestion: 'Enable lazy loading for better performance',
			example: 'performance: { lazyLoading: true }'
		});
	}

	// Virtual scroll without lazy loading
	if (config.performance?.virtualScroll && !config.performance.lazyLoading) {
		issues.push({
			severity: SEVERITY.INFO,
			category: CATEGORY.PERFORMANCE,
			field: 'performance.virtualScroll',
			message: 'Virtual scroll enabled without lazy loading',
			suggestion: 'Enable lazy loading for optimal performance',
			example: 'performance: { virtualScroll: true, lazyLoading: true }'
		});
	}

	// Lines with large trees
	if (config.tree?.showLines && config.performance?.maxVisibleNodes > 3000) {
		issues.push({
			severity: SEVERITY.INFO,
			category: CATEGORY.PERFORMANCE,
			field: 'tree.showLines',
			message: 'Tree lines enabled with large tree (> 3000 nodes)',
			suggestion: 'Consider disabling lines for better rendering performance',
			example: 'tree: { showLines: false }'
		});
	}

	return issues;
}

/**
	* Validate security settings
	*/
function validateSecurity(config) {
	const issues = [];

	// No file restrictions
	if (config.security?.allowedExtensions === null &&
		(!config.security?.blockedExtensions || config.security.blockedExtensions.length === 0)) {
		issues.push({
			severity: SEVERITY.INFO,
			category: CATEGORY.SECURITY,
			field: 'security',
			message: 'No file extension restrictions configured',
			suggestion: 'Consider adding file type restrictions for security',
			example: `security: { blockedExtensions: ['exe', 'bat', 'cmd'] }`
		});
	}

	// Large file size limit
	if (config.security?.maxFileSize > 100 * 1024 * 1024) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.SECURITY,
			field: 'security.maxFileSize',
			message: 'Very large file size limit (> 100MB)',
			suggestion: 'Large files may cause memory issues',
			example: 'security: { maxFileSize: 10 * 1024 * 1024 } // 10MB'
		});
	}

	// HTML escaping disabled
	if (config.security?.escapeHtml === false) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.SECURITY,
			field: 'security.escapeHtml',
			message: 'HTML escaping is disabled',
			suggestion: 'Disabling HTML escaping may expose XSS vulnerabilities',
			example: 'security: { escapeHtml: true }'
		});
	}

	// Absolute paths allowed
	if (config.security?.allowAbsolutePaths) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.SECURITY,
			field: 'security.allowAbsolutePaths',
			message: 'Absolute paths are allowed',
			suggestion: 'Allowing absolute paths may expose system structure',
			example: 'security: { allowAbsolutePaths: false }'
		});
	}

	return issues;
}

/**
	* Validate accessibility settings
	*/
function validateAccessibility(config) {
	const issues = [];

	// Accessibility disabled
	if (config.accessibility?.enabled === false) {
		issues.push({
			severity: SEVERITY.INFO,
			category: CATEGORY.ACCESSIBILITY,
			field: 'accessibility.enabled',
			message: 'Accessibility features are disabled',
			suggestion: 'Consider enabling accessibility for better user experience',
			example: 'accessibility: { enabled: true }'
		});
	}

	// Keyboard navigation disabled
	if (config.accessibility?.keyboardNavigation === false) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.ACCESSIBILITY,
			field: 'accessibility.keyboardNavigation',
			message: 'Keyboard navigation is disabled',
			suggestion: 'Keyboard navigation is important for accessibility',
			example: 'accessibility: { keyboardNavigation: true }'
		});
	}

	// Focus visibility disabled
	if (config.accessibility?.focusVisible === false) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.ACCESSIBILITY,
			field: 'accessibility.focusVisible',
			message: 'Focus visibility is disabled',
			suggestion: 'Focus indicators help keyboard users navigate',
			example: 'accessibility: { focusVisible: true }'
		});
	}

	return issues;
}

/**
	* Validate cross-setting dependencies
	*/
function validateCrossSettings(config) {
	const issues = [];

	// Checkboxes for multi-select
	if (config.tree?.multiSelect && !config.tree.showCheckboxes) {
		issues.push({
			severity: SEVERITY.INFO,
			category: CATEGORY.COMPATIBILITY,
			field: 'tree.showCheckboxes',
			message: 'Multi-select enabled without checkboxes',
			suggestion: 'Consider enabling checkboxes for better UX',
			example: 'tree: { multiSelect: true, showCheckboxes: true }'
		});
	}

	// Custom sort without sortable
	if (config.tree?.customSort && !config.tree.sortable) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.COMPATIBILITY,
			field: 'tree.sortable',
			message: 'Custom sort function provided but sortable is disabled',
			suggestion: 'Enable sortable to use custom sort function',
			example: 'tree: { sortable: true, customSort: yourFunction }'
		});
	}

	// Context menu items without context menu
	if (config.tree?.contextMenuItems?.length > 0 && !config.tree.contextMenu) {
		issues.push({
			severity: SEVERITY.WARNING,
			category: CATEGORY.COMPATIBILITY,
			field: 'tree.contextMenu',
			message: 'Context menu items provided but context menu is disabled',
			suggestion: 'Enable context menu to use the items',
			example: 'tree: { contextMenu: true }'
		});
	}

	return issues;
}

/**
	* Get nested value from object using dot notation
	*/
function getNestedValue(obj, path) {
	return path.split('.').reduce((current, key) =>
		current?.[key], obj
	);
}

/**
	* Generate validation report
	*/
export function getValidationReport(validationResult) {
	const { errors, warnings, info } = validationResult;

	let report = '=== TreeForge Configuration Validation Report ===\n\n';

	if (validationResult.isValid) {
		report += '✓ Configuration is valid!\n\n';
	} else {
		report += '✗ Configuration has errors that must be fixed!\n\n';
	}

	if (errors.length > 0) {
		report += `ERRORS (${errors.length}):\n`;
		errors.forEach((issue, i) => {
			report += `\n${i + 1}. [${issue.field}] ${issue.message}\n`;
			if (issue.suggestion) report += `   💡 ${issue.suggestion}\n`;
			if (issue.example) report += `   📝 Example: ${issue.example}\n`;
		});
		report += '\n';
	}

	if (warnings.length > 0) {
		report += `WARNINGS (${warnings.length}):\n`;
		warnings.forEach((issue, i) => {
			report += `\n${i + 1}. [${issue.field}] ${issue.message}\n`;
			if (issue.suggestion) report += `   💡 ${issue.suggestion}\n`;
			if (issue.example) report += `   📝 Example: ${issue.example}\n`;
		});
		report += '\n';
	}

	if (info.length > 0) {
		report += `SUGGESTIONS (${info.length}):\n`;
		info.forEach((issue, i) => {
			report += `\n${i + 1}. [${issue.field}] ${issue.message}\n`;
			if (issue.suggestion) report += `   💡 ${issue.suggestion}\n`;
			if (issue.example) report += `   📝 Example: ${issue.example}\n`;
		});
	}

	return report;
}

/**
	* Get suggestions based on use case
	*/
export function getSuggestionsForUseCase(useCase) {
	const suggestions = {
		'code-editor': {
			title: 'Code Editor Configuration',
			config: {
				tree: {
					showIcons: true,
					showLines: true,
					multiSelect: true,
					dragAndDrop: true
				},
				editor: {
					enabled: true,
					syntaxHighlight: true,
					lineNumbers: true
				},
				layout: {
					type: 'split',
					splitRatio: 0.25
				}
			}
		},
		'file-browser': {
			title: 'File Browser Configuration',
			config: {
				tree: {
					showIcons: true,
					showFileSize: true,
					contextMenu: true,
					dragAndDrop: true
				},
				search: {
					enabled: true
				},
				toolbar: {
					enabled: true,
					buttons: ['refresh', 'new-file', 'new-folder']
				}
			}
		},
		'documentation': {
			title: 'Documentation Browser Configuration',
			config: {
				tree: {
					showIcons: true,
					showLines: true,
					clickToOpen: true
				},
				search: {
					enabled: true,
					includeContent: true,
					fuzzy: true
				},
				layout: {
					type: 'split',
					splitRatio: 0.3
				}
			}
		},
		'large-dataset': {
			title: 'Large Dataset Configuration',
			config: {
				performance: {
					lazyLoading: true,
					virtualScroll: true,
					maxVisibleNodes: 500
				},
				tree: {
					animations: false,
					showLines: false
				}
			}
		}
	};

	return suggestions[useCase] || null;
}
