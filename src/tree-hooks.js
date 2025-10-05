/**
	* TreeForge Hooks Reference
	* Complete documentation of all available hooks
	*/

// ============ ALL AVAILABLE HOOKS ============

/**
	* 1. onCreateFile - Called when a file is created
	* @param {string} path - Full path of the file (e.g., "src/utils.js")
	* @param {Object} parentNode - Parent folder node
	* @returns {void|Promise<void>}
	* 
	* Example:
	* onCreateFile: (path, parentNode) => {
	*   console.log(`File created: ${path}`);
	*   // Save to API, update database, etc.
	* }
	*/

/**
	* 2. onCreateFolder - Called when a folder is created
	* @param {string} path - Full path of the folder (e.g., "src/components")
	* @param {Object} parentNode - Parent folder node
	* @returns {void|Promise<void>}
	* 
	* Example:
	* onCreateFolder: (path, parentNode) => {
	*   console.log(`Folder created: ${path}`);
	*   // Create on server, etc.
	* }
	*/

/**
	* 3. onDeleteFile - Called when a file is deleted
	* @param {string} path - Full path of the deleted file
	* @param {Object} node - The deleted file node
	* @returns {void|Promise<void>}
	* 
	* Example:
	* onDeleteFile: (path, node) => {
	*   console.log(`File deleted: ${path}`);
	*   // Remove from database, etc.
	* }
	*/

/**
	* 4. onDeleteFolder - Called when a folder is deleted
	* @param {string} path - Full path of the deleted folder
	* @param {Object} node - The deleted folder node
	* @returns {void|Promise<void>}
	* 
	* Example:
	* onDeleteFolder: (path, node) => {
	*   console.log(`Folder deleted: ${path}`);
	*   // Recursively delete from server, etc.
	* }
	*/

/**
	* 5. onDeleteNode - Fallback called when any node is deleted
	* @param {string} path - Full path of the deleted node
	* @param {Object} node - The deleted node
	* @returns {void|Promise<void>}
	* 
	* Example:
	* onDeleteNode: (path, node) => {
	*   console.log(`Node deleted: ${path}`);
	*   // Generic delete handler
	* }
	*/

/**
	* 6. onRenameNode - Called when a file or folder is renamed
	* @param {string} oldPath - Old path before rename
	* @param {string} newPath - New path after rename
	* @param {Object} node - The renamed node
	* @returns {void|Promise<void>}
	* 
	* Example:
	* onRenameNode: (oldPath, newPath, node) => {
	*   console.log(`Renamed: ${oldPath} → ${newPath}`);
	*   // Update references, database, etc.
	* }
	*/

/**
	* 7. onReadFile - Called when file content is read
	* @param {string} path - Full path of the file
	* @param {Object} node - The file node
	* @returns {string|Promise<string>} - File content
	* 
	* Example:
	* onReadFile: async (path, node) => {
	*   const response = await fetch(`/api/files?path=${path}`);
	*   return await response.text();
	* }
	*/

/**
	* 8. onWriteFile - Called when file content is written
	* @param {string} path - Full path of the file
	* @param {string} content - New file content
	* @param {Object} node - The file node
	* @returns {void|Promise<void>}
	* 
	* Example:
	* onWriteFile: async (path, content, node) => {
	*   await fetch('/api/files', {
	*     method: 'POST',
	*     body: JSON.stringify({ path, content })
	*   });
	* }
	*/

/**
	* 9. onLoad - Called to load tree data (for API mode)
	* @returns {Object|Promise<Object>} - Tree data structure
	* 
	* Example:
	* onLoad: async () => {
	*   const response = await fetch('/api/tree');
	*   return await response.json();
	* }
	*/

/**
	* 10. onFileOpen - Called when a file is opened in editor
	* @param {string} path - Full path of the file
	* @param {string} content - File content
	* @param {Object} node - The file node
	* @returns {void}
	* 
	* Example:
	* onFileOpen: (path, content, node) => {
	*   console.log(`Opened: ${path}`);
	*   // Track analytics, etc.
	* }
	*/

// ============ HOOK USAGE EXAMPLES ============

// Example 1: Local Storage Backend
export const LocalStorageHooks = {
	onCreateFile: (path) => {
		const files = JSON.parse(localStorage.getItem('tree-files') || '{}');
		files[path] = '';
		localStorage.setItem('tree-files', JSON.stringify(files));
	},

	onDeleteFile: (path) => {
		const files = JSON.parse(localStorage.getItem('tree-files') || '{}');
		delete files[path];
		localStorage.setItem('tree-files', JSON.stringify(files));
	},

	onReadFile: (path) => {
		const files = JSON.parse(localStorage.getItem('tree-files') || '{}');
		return files[path] || '';
	},

	onWriteFile: (path, content) => {
		const files = JSON.parse(localStorage.getItem('tree-files') || '{}');
		files[path] = content;
		localStorage.setItem('tree-files', JSON.stringify(files));
	}
};

// Example 2: REST API Backend
export const RestApiHooks = {
	onCreateFile: async (path) => {
		await fetch('/api/files', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path, type: 'file' })
		});
	},

	onCreateFolder: async (path) => {
		await fetch('/api/folders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path })
		});
	},

	onDeleteFile: async (path) => {
		await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
			method: 'DELETE'
		});
	},

	onRenameNode: async (oldPath, newPath) => {
		await fetch('/api/rename', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ oldPath, newPath })
		});
	},

	onReadFile: async (path) => {
		const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
		return await response.text();
	},

	onWriteFile: async (path, content) => {
		await fetch('/api/files', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path, content })
		});
	},

	onLoad: async () => {
		const response = await fetch('/api/tree');
		return await response.json();
	}
};

// Example 3: Analytics Hooks
export const AnalyticsHooks = {
	onCreateFile: (path) => {
		console.log('📊 Analytics: File created', path);
		// Send to analytics service
	},

	onDeleteFile: (path) => {
		console.log('📊 Analytics: File deleted', path);
	},

	onRenameNode: (oldPath, newPath) => {
		console.log('📊 Analytics: Node renamed', { oldPath, newPath });
	},

	onFileOpen: (path, content) => {
		console.log('📊 Analytics: File opened', path, `(${content.length} bytes)`);
	}
};

// Example 4: Validation Hooks
export const ValidationHooks = {
	onCreateFile: (path) => {
		if (!path.includes('.')) {
			throw new Error('Files must have an extension');
		}
		if (path.length > 255) {
			throw new Error('Path too long (max 255 characters)');
		}
	},

	onRenameNode: (oldPath, newPath) => {
		if (newPath.includes('..')) {
			throw new Error('Invalid path: cannot use ".."');
		}
		const forbidden = ['con', 'prn', 'aux', 'nul'];
		const filename = newPath.split('/').pop().toLowerCase();
		if (forbidden.includes(filename)) {
			throw new Error('Forbidden filename');
		}
	},

	onWriteFile: (path, content) => {
		if (content.length > 10 * 1024 * 1024) { // 10MB
			throw new Error('File too large (max 10MB)');
		}
	}
};

// Example 5: Caching Hooks
export const CacheHooks = {
	cache: new Map(),

	onReadFile: async function (path) {
		if (this.cache.has(path)) {
			console.log('📦 Cache hit:', path);
			return this.cache.get(path);
		}

		console.log('🌐 Cache miss, fetching:', path);
		const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
		const content = await response.text();
		this.cache.set(path, content);
		return content;
	},

	onWriteFile: async function (path, content) {
		this.cache.set(path, content);
		await fetch('/api/files', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path, content })
		});
	},

	onDeleteFile: function (path) {
		this.cache.delete(path);
	},

	onRenameNode: function (oldPath, newPath) {
		if (this.cache.has(oldPath)) {
			this.cache.set(newPath, this.cache.get(oldPath));
			this.cache.delete(oldPath);
		}
	}
};

// Example 6: Debounced Auto-Save Hooks
export const AutoSaveHooks = {
	saveTimeout: null,

	onWriteFile: function (path, content) {
		clearTimeout(this.saveTimeout);

		this.saveTimeout = setTimeout(async () => {
			console.log('💾 Auto-saving:', path);
			await fetch('/api/files', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ path, content })
			});
			console.log('✅ Saved:', path);
		}, 1000); // Save after 1 second of inactivity
	}
};

// Example 7: Combining Multiple Hooks
export function combineHooks(...hookObjects) {
	const combined = {};

	for (const hooks of hookObjects) {
		for (const [hookName, hookFn] of Object.entries(hooks)) {
			if (!combined[hookName]) {
				combined[hookName] = hookFn;
			} else {
				// Chain multiple hooks for same event
				const existing = combined[hookName];
				combined[hookName] = async (...args) => {
					await existing(...args);
					await hookFn(...args);
				};
			}
		}
	}

	return combined;
}

// Usage: const hooks = combineHooks(RestApiHooks, AnalyticsHooks, ValidationHooks);
