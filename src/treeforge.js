import { renderTree } from "./renderer.js";
import { findNode, getPath } from "./utils.js";

export class TreeForge {
	constructor(config) {
		this.container = document.getElementById(config.containerId);
		if (!this.container) throw new Error("Invalid containerId");

		this.data = config.localData || [];
		this.mode = config.localData ? "local" : "api";

		// File content state
		this.currentFile = null; // currently open file path
		this.fileContents = {}; // path -> content mapping
		this.unsavedChanges = new Set(); // paths with unsaved changes

		// Editor configuration - user can provide their own elements
		this.editorConfig = {
			inputId: config.editorInputId || null,           // textarea/input for content
			filenameId: config.editorFilenameId || null,     // element to display filename
			saveButtonId: config.editorSaveButtonId || null, // save button
			closeButtonId: config.editorCloseButtonId || null, // close button
			unsavedIndicatorId: config.editorUnsavedIndicatorId || null, // unsaved indicator
			containerId: config.editorContainerId || null,   // editor container (for show/hide)
			useBuiltIn: !config.editorInputId                // use built-in editor if no input provided
		};

		this.onFileOpen = config.onFileOpen || (() => { });

		this.settings = Object.assign({
			asciiStyle: "unicode", // or "ascii"
			indent: 2,
			colors: {
				folder: "cyan",
				file: "white"
			},
			icons: {
				folder: "📁",
				file: "📄"
			}
		}, config.settings || {}); this.hooks = config.hooks || {};
		this.onLoad = config.onLoad || null;

		if (this.mode === "api" && typeof this.onLoad !== "function") {
			throw new Error("API mode requires onLoad function");
		}

		// Create toolbar, modal, context menu and content editor
		this._buildToolbar();
		this._buildModal();
		this._buildContextMenu();
		this._buildContentEditor();
		this.refresh();
	}

	// ------------ Public Methods ------------

	_getUniqueName(parent, name) {
		const children = parent.children || [];

		// If name doesn't exist, return as is
		if (!children.some(c => c.name === name)) {
			return name;
		}

		// Extract extension and base name
		const lastDotIndex = name.lastIndexOf('.');
		const hasExtension = lastDotIndex > 0 && lastDotIndex < name.length - 1;

		let baseName, extension;
		if (hasExtension) {
			baseName = name.substring(0, lastDotIndex);
			extension = name.substring(lastDotIndex); // includes the dot
		} else {
			baseName = name;
			extension = '';
		}

		// Find next available number
		let counter = 1;
		let uniqueName;
		do {
			uniqueName = `${baseName}(${counter})${extension}`;
			counter++;
		} while (children.some(c => c.name === uniqueName));

		return uniqueName;
	}

	async createFile(parentPath, name) {
		if (!name) return false;

		if (this.mode === "api") {
			const ok = await this.hooks.onCreateFile?.(parentPath, name);
			if (ok) await this.refresh();
			return ok;
		}

		const parent = findNode(this.data, parentPath) || { children: this.data };
		if (!parent || (parent.type && parent.type !== "folder")) return false;

		// Auto-increment name if duplicate exists
		const uniqueName = this._getUniqueName(parent, name);

		parent.children = parent.children || [];
		parent.children.push({ name: uniqueName, type: "file" });
		this.refresh();
		return true;
	}

	async createFolder(parentPath, name) {
		if (!name) return false;

		if (this.mode === "api") {
			const ok = await this.hooks.onCreateFolder?.(parentPath, name);
			if (ok) await this.refresh();
			return ok;
		}

		const parent = findNode(this.data, parentPath) || { children: this.data };
		if (!parent || (parent.type && parent.type !== "folder")) return false;

		// Auto-increment name if duplicate exists
		const uniqueName = this._getUniqueName(parent, name);

		parent.children = parent.children || [];
		parent.children.push({ name: uniqueName, type: "folder", children: [] });
		this.refresh();
		return true;
	}

	async deleteNode(path) {
		const node = findNode(this.data, path);
		if (!node) return false;

		// confirm via configured callback or modal
		if (this.settings.deleteConfirm) {
			if (!this.settings.deleteConfirm(node.name)) return false;
		} else {
			// use built-in modal if present
			const ok = await this._showConfirmModal(`Delete "${node.name}"?`);
			if (!ok) return false;
		}

		if (this.mode === "api") {
			// Call specific hook based on node type
			let ok;
			if (node.type === 'folder') {
				ok = await this.hooks.onDeleteFolder?.(path, node);
				// Fallback to generic hook if specific one not provided
				if (ok === undefined) ok = await this.hooks.onDeleteNode?.(path, node);
			} else {
				ok = await this.hooks.onDeleteFile?.(path, node);
				// Fallback to generic hook if specific one not provided
				if (ok === undefined) ok = await this.hooks.onDeleteNode?.(path, node);
			}
			if (ok) await this.refresh();
			return ok;
		}

		const parts = path.split("/");
		const target = parts.pop();
		const parent = findNode(this.data, parts.join("/"));

		if (!parent || !parent.children) return false;

		parent.children = parent.children.filter(c => c.name !== target);
		this.refresh();
		return true;
	}

	async renameNode(path, newName) {
		const node = findNode(this.data, path);
		if (!node) return false;

		// allow prompt if no newName given
		if (!newName && this.settings.renamePrompt) {
			newName = this.settings.renamePrompt(node.name);
		}
		if (!newName) return false;

		if (this.mode === "api") {
			const ok = await this.hooks.onRenameNode?.(path, newName);
			if (ok) await this.refresh();
			return ok;
		}

		node.name = newName;
		this.refresh();
		return true;
	}
	// ----------------------
	// Toolbar + Modal helpers
	// ----------------------

	_buildToolbar() {
		// create a small toolbar at top of container
		const bar = document.createElement("div");
		bar.className = "tf-toolbar";
		bar.innerHTML =
			`<button class="tf-btn" data-action="new-file">
		<svg width="64px" height="64px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0">
		</g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
		<title>file_new_line</title>
		<g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> 
		<g id="File" transform="translate(-336.000000, -96.000000)" fill-rule="nonzero"> 
		<g id="file_new_line" transform="translate(336.000000, 96.000000)">
		<path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero">
		</path> <path d="M13.5858,2 C14.0572667,2 14.5115877,2.16648691 14.870172,2.46691468 L15,2.58579 L19.4142,7 C19.7476222,7.33339556 19.9511481,7.77238321 19.9922598,8.23835797 L20,8.41421 L20,20 C20,21.0543909 19.18415,21.9181678 18.1492661,21.9945144 L18,22 L6,22 C4.94563773,22 4.08183483,21.18415 4.00548573,20.1492661 L4,20 L4,4 C4,2.94563773 4.81587733,2.08183483 5.85073759,2.00548573 L6,2 L13.5858,2 Z M12,4 L6,4 L6,20 L18,20 L18,10 L13.5,10 C12.6716,10 12,9.32843 12,8.5 L12,4 Z M12,11.5 C12.5523,11.5 13,11.9477 13,12.5 L13,14 L14.5,14 C15.0523,14 15.5,14.4477 15.5,15 C15.5,15.5523 15.0523,16 14.5,16 L13,16 L13,17.5 C13,18.0523 12.5523,18.5 12,18.5 C11.4477,18.5 11,18.0523 11,17.5 L11,16 L9.5,16 C8.94772,16 8.5,15.5523 8.5,15 C8.5,14.4477 8.94772,14 9.5,14 L11,14 L11,12.5 C11,11.9477 11.4477,11.5 12,11.5 Z M14,4.41421 L14,8 L17.5858,8 L14,4.41421 Z" id="形状" fill="#fff"> </path> </g> </g> </g> </g></svg></button>
			<button class="tf-btn" data-action="new-folder"><svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0601 16.5V11.5" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14.5 14H9.5" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10"></path> </g></svg></button>
			<button class="tf-btn" data-action="collapse-all"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M9 9H4v1h5V9z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3l1-1h7l1 1v7l-1 1h-2v2l-1 1H3l-1-1V6l1-1h2V3zm1 2h4l1 1v4h2V3H6v2zm4 1H3v7h7V6z"></path></g></svg></button>
			<button class="tf-btn" data-action="refresh"><svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 2L13 3.99545L12.9408 4.05474M13 18.0001L11 19.9108L11.0297 19.9417M12.9408 4.05474L11 6M12.9408 4.05474C12.6323 4.01859 12.3183 4 12 4C7.58172 4 4 7.58172 4 12C4 14.5264 5.17107 16.7793 7 18.2454M17 5.75463C18.8289 7.22075 20 9.47362 20 12C20 16.4183 16.4183 20 12 20C11.6716 20 11.3477 19.9802 11.0297 19.9417M13 22.0001L11.0297 19.9417" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
			</g>
			</svg>
			</button>`;
		// Insert toolbar as first child of container
		this.container.insertBefore(bar, this.container.firstChild);

		bar.addEventListener("click", async (e) => {
			const action = e.target.dataset.action;
			switch (action) {
				case "new-file": {
					const name = await this._showInputModal('Create New File', 'Enter file name...', 'newFile.js');
					if (name) await this.createFile("", name);
					break;
				}
				case "new-folder": {
					const name = await this._showInputModal('Create New Folder', 'Enter folder name...', 'newFolder');
					if (name) await this.createFolder("", name);
					break;
				}
				case "collapse-all": {
					this._setAllCollapsed(true);
					this.refresh();
					break;
				}
				case "refresh": {
					this.refresh();
					break;
				}
			}
		});
	}

	_setAllCollapsed(val) {
		function walk(nodes) {
			(nodes || []).forEach(n => {
				if (n.type === "folder") {
					n.collapsed = val;
					walk(n.children);
				}
			});
		}
		walk(this.data);
	}

	_buildContentEditor() {
		if (this.editorConfig.useBuiltIn) {
			// Create TreeForge's built-in editor
			this._editorPanel = document.createElement('div');
			this._editorPanel.className = 'tf-content-editor';
			this._editorPanel.style.display = 'none';
			this._editorPanel.innerHTML = `
				<div class="tf-editor-header">
					<div class="tf-editor-title">
						<span class="tf-editor-filename">No file selected</span>
						<span class="tf-editor-unsaved" style="display: none;">●</span>
					</div>
					<div class="tf-editor-actions">
						<button class="tf-btn" data-action="save">Save</button>
						<button class="tf-btn" data-action="close">Close</button>
					</div>
				</div>
				<div class="tf-editor-body">
					<textarea class="tf-editor-textarea" placeholder="File content will appear here..."></textarea>
				</div>
			`;

			// Insert editor after tree container
			this.container.parentElement.appendChild(this._editorPanel);

			// Store references to built-in elements
			this._editorElements = {
				input: this._editorPanel.querySelector('.tf-editor-textarea'),
				filename: this._editorPanel.querySelector('.tf-editor-filename'),
				saveBtn: this._editorPanel.querySelector('[data-action="save"]'),
				closeBtn: this._editorPanel.querySelector('[data-action="close"]'),
				unsavedIndicator: this._editorPanel.querySelector('.tf-editor-unsaved'),
				container: this._editorPanel
			};
		} else {
			// Use user-provided editor elements
			this._editorElements = {
				input: document.getElementById(this.editorConfig.inputId),
				filename: this.editorConfig.filenameId ? document.getElementById(this.editorConfig.filenameId) : null,
				saveBtn: this.editorConfig.saveButtonId ? document.getElementById(this.editorConfig.saveButtonId) : null,
				closeBtn: this.editorConfig.closeButtonId ? document.getElementById(this.editorConfig.closeButtonId) : null,
				unsavedIndicator: this.editorConfig.unsavedIndicatorId ? document.getElementById(this.editorConfig.unsavedIndicatorId) : null,
				container: this.editorConfig.containerId ? document.getElementById(this.editorConfig.containerId) : null
			};

			if (!this._editorElements.input) {
				throw new Error(`Editor input element with id "${this.editorConfig.inputId}" not found`);
			}
		}

		// Setup event listeners (works for both built-in and user-provided)
		const { input, saveBtn, closeBtn, unsavedIndicator } = this._editorElements;

		// Track changes
		input.addEventListener('input', () => {
			if (this.currentFile) {
				this.unsavedChanges.add(this.currentFile);
				if (unsavedIndicator) {
					unsavedIndicator.style.display = 'inline';
				}
			}
		});

		// Save button (optional)
		if (saveBtn) {
			saveBtn.addEventListener('click', async () => {
				if (this.currentFile) {
					await this._saveFileContent(this.currentFile, input.value);
				}
			});
		}

		// Close button (optional)
		if (closeBtn) {
			closeBtn.addEventListener('click', async () => {
				if (this.currentFile && this.unsavedChanges.has(this.currentFile)) {
					const ok = await this._showConfirmModal('You have unsaved changes. Close anyway?');
					if (!ok) return;
				}
				this._closeEditor();
			});
		}

		// Keyboard shortcuts (Ctrl+S / Cmd+S)
		input.addEventListener('keydown', async (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				if (this.currentFile) {
					await this._saveFileContent(this.currentFile, input.value);
				}
			}
		});
	}

	_buildModal() {
		this._modal = document.createElement("div");
		this._modal.className = "tf-modal";
		this._modal.style.display = "none";
		this._modal.innerHTML = `
			<div class="tf-modal-backdrop"></div>
			<div class="tf-modal-body">
				<div class="tf-modal-header"></div>
				<div class="tf-modal-message"></div>
				<div class="tf-modal-input-wrapper" style="display: none;">
					<input type="text" class="tf-modal-input" placeholder="Enter name..." />
				</div>
				<div class="tf-modal-actions">
					<button data-cancel>Cancel</button>
					<button data-ok>OK</button>
				</div>
			</div>`;
		document.body.appendChild(this._modal);

		const cancelBtn = this._modal.querySelector('[data-cancel]');
		const okBtn = this._modal.querySelector('[data-ok]');
		const input = this._modal.querySelector('.tf-modal-input');

		cancelBtn.addEventListener('click', () => this._hideModal(null));
		okBtn.addEventListener('click', () => {
			if (this._modalMode === 'input') {
				this._hideModal(input.value.trim());
			} else {
				this._hideModal(true);
			}
		});

		// Handle Enter key in input
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				okBtn.click();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				cancelBtn.click();
			}
		});
	}

	_showConfirmModal(msg) {
		return new Promise(resolve => {
			this._modalMode = 'confirm';
			this._modal.querySelector('.tf-modal-header').textContent = '';
			this._modal.querySelector('.tf-modal-message').textContent = msg;
			this._modal.querySelector('.tf-modal-input-wrapper').style.display = 'none';
			this._modal.style.display = 'block';
			this._modal._resolve = resolve;
		});
	}

	_showInputModal(title, placeholder = '', defaultValue = '') {
		return new Promise(resolve => {
			this._modalMode = 'input';
			const input = this._modal.querySelector('.tf-modal-input');
			this._modal.querySelector('.tf-modal-header').textContent = title;
			this._modal.querySelector('.tf-modal-message').textContent = '';
			this._modal.querySelector('.tf-modal-input-wrapper').style.display = 'block';
			input.placeholder = placeholder;
			input.value = defaultValue;
			this._modal.style.display = 'block';
			this._modal._resolve = resolve;
			// Focus and select input after a brief delay for animation
			setTimeout(() => {
				input.focus();
				input.select();
			}, 100);
		});
	}

	_hideModal(result) {
		this._modal.style.display = 'none';
		const input = this._modal.querySelector('.tf-modal-input');
		if (input) input.value = '';
		if (this._modal._resolve) {
			this._modal._resolve(result);
			this._modal._resolve = null;
		}
	}

	collapse(path) {
		const node = findNode(this.data, path);
		if (node?.type === "folder") {
			node.collapsed = true;
			this.refresh();
		}
	}

	uncollapse(path) {
		const node = findNode(this.data, path);
		if (node?.type === "folder") {
			node.collapsed = false;
			this.refresh();
		}
	}

	async open(path) {
		const node = findNode(this.data, path);
		if (node?.type === "file") {
			this.onFileOpen(node);
			await this._openFileInEditor(path, node);
		}
	}

	async _openFileInEditor(path, node) {
		// Check for unsaved changes before switching files
		if (this.currentFile && this.unsavedChanges.has(this.currentFile)) {
			const ok = await this._showConfirmModal('You have unsaved changes. Switch files anyway?');
			if (!ok) return;
		}

		this.currentFile = path;
		const content = await this._readFileContent(path, node);
		this.fileContents[path] = content;

		// Update UI using stored element references
		const { input, filename, unsavedIndicator, container } = this._editorElements;

		input.value = content;

		if (filename) {
			filename.textContent = node.name;
		}

		if (unsavedIndicator) {
			unsavedIndicator.style.display = this.unsavedChanges.has(path) ? 'inline' : 'none';
		}

		if (container) {
			container.style.display = this.editorConfig.useBuiltIn ? 'flex' : 'block';
		}
	}

	async _readFileContent(path, node) {
		// Check if content is already loaded
		if (this.fileContents[path] !== undefined) {
			return this.fileContents[path];
		}

		// Use hook if provided
		if (this.hooks.onReadFile) {
			return await this.hooks.onReadFile(path, node);
		}

		// Default: check if node has content property
		return node.content || '';
	}

	async _saveFileContent(path, content) {
		// Use hook if provided
		if (this.hooks.onWriteFile) {
			const success = await this.hooks.onWriteFile(path, content);
			if (!success) return;
		} else {
			// Default: save to node's content property
			const node = findNode(this.data, path);
			if (node) {
				node.content = content;
			}
		}

		// Update state
		this.fileContents[path] = content;
		this.unsavedChanges.delete(path);

		// Update UI
		const { unsavedIndicator } = this._editorElements;
		if (unsavedIndicator) {
			unsavedIndicator.style.display = 'none';
		}
	}

	_closeEditor() {
		this.currentFile = null;

		const { input, filename, unsavedIndicator, container } = this._editorElements;

		if (container) {
			container.style.display = 'none';
		}

		input.value = '';

		if (filename) {
			filename.textContent = 'No file selected';
		}

		if (unsavedIndicator) {
			unsavedIndicator.style.display = 'none';
		}
	}

	async refresh() {
		if (this.mode === "api") {
			this.data = await this.onLoad();
		}

		// Find or create tree content wrapper
		let treeContent = this.container.querySelector('.tf-tree-content');
		if (!treeContent) {
			// First time: wrap everything after toolbar
			treeContent = document.createElement('div');
			treeContent.className = 'tf-tree-content';
			this.container.appendChild(treeContent);
		}

		// Render tree into content wrapper
		treeContent.innerHTML = renderTree(this.data, this.settings);
		this._attachEvents();
	}

	// ----------------------
	// HELPERS
	// ----------------------

	_getPath(node, current = "") {
		return current ? `${current}/${node.name}` : node.name;
	}

	_findNode(node, path, current = "") {
		const fullPath = current ? `${current}/${node.name}` : node.name;
		if (fullPath === path) return node;

		if (node.type === "folder" && node.children) {
			for (let child of node.children) {
				const found = this._findNode(child, path, fullPath);
				if (found) return found;
			}
		}
		return null;
	}

	_removeNode(node, path, current = "") {
		const fullPath = current ? `${current}/${node.name}` : node.name;

		if (node.type === "folder" && node.children) {
			const idx = node.children.findIndex(c => `${fullPath}/${c.name}` === path);
			if (idx !== -1) {
				node.children.splice(idx, 1);
				return true;
			}

			for (let child of node.children) {
				if (this._removeNode(child, path, fullPath)) return true;
			}
		}
		return false;
	}

	// ------------ Internals ------------

	_attachEvents() {
		this.container.querySelectorAll(".tf-node").forEach(el => {

			const path = el.dataset.path;
			const node = findNode(this.data, path);

			// Left click → toggle folder or open file
			el.onclick = async (e) => {
				if (e.target.classList.contains("tf-action")) return; // skip if clicking ⋮
				if (node.type === "folder") {
					node.collapsed = !node.collapsed;
					this.refresh();
				} else {
					await this.open(path);
				}
			};

			// double-click name -> inline rename
			const nameEl = el.querySelector('.tf-name-text');
			if (nameEl) {
				nameEl.ondblclick = (ev) => {
					ev.stopPropagation();
					nameEl.contentEditable = true;
					nameEl.focus();
					// select text
					const range = document.createRange();
					range.selectNodeContents(nameEl);
					const sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				};

				nameEl.onblur = async (ev) => {
					nameEl.contentEditable = false;
					const newName = nameEl.textContent.trim();
					if (!newName || newName === node.name) { this.refresh(); return; }
					// prevent duplicates in parent
					const parts = el.dataset.path.split('/');
					parts.pop();
					const parent = findNode(this.data, parts.join('/')) || { children: this.data };
					if ((parent.children || []).some(c => c.name === newName)) {
						alert('Name already exists');
						this.refresh();
						return;
					}
					await this.renameNode(el.dataset.path, newName);
				};

				nameEl.onkeydown = (ev) => {
					if (ev.key === 'Enter') {
						ev.preventDefault();
						nameEl.blur();
					} else if (ev.key === 'Escape') {
						nameEl.contentEditable = false;
						this.refresh();
					}
				};
			}

			// ⋮ button click
			const actionBtn = el.querySelector(".tf-action");
			if (actionBtn) {
				actionBtn.onclick = (e) => {
					e.stopPropagation();
					this._showContextMenu(e, path);
				};
			}
		});

		// single container-level contextmenu handler (moved out of per-node loop)
		this.container.addEventListener("contextmenu", e => {
			e.preventDefault();
			const nodeEl = e.target.closest(".tf-node");
			if (!nodeEl) return;
			this._showContextMenu(e, nodeEl.dataset.path);
		});
	}




	// ----------------------
	// Context Menu
	// ----------------------

	_buildContextMenu() {
		this.menu = document.createElement("div");
		this.menu.className = "tf-context-menu";
		this.menu.style.display = "none";
		document.body.appendChild(this.menu);

		["New File", "New Folder", "Rename", "Delete"].forEach(action => {
			const item = document.createElement("div");
			item.textContent = action;
			item.className = "tf-context-item";
			item.dataset.action = action;
			item.addEventListener("click", async () => await this._handleContextAction(action));
			this.menu.appendChild(item);
		});

		document.addEventListener("click", () => (this.menu.style.display = "none"));
	}

	_showContextMenu(e, path) {
		this.selectedPath = path;
		this.menu.style.display = "block";
		this.menu.style.left = e.pageX + "px";
		this.menu.style.top = e.pageY + "px";

		// disable create options if selected node is a file
		const node = findNode(this.data, path);
		const isFile = node?.type === 'file';
		this.menu.querySelectorAll('.tf-context-item').forEach(it => {
			const act = it.dataset.action;
			if ((act === 'New File' || act === 'New Folder') && isFile) {
				it.classList.add('disabled');
			} else {
				it.classList.remove('disabled');
			}
		});
	}



	async _handleContextAction(action) {
		let path = this.selectedPath;
		let node = findNode(this.data, path);

		switch (action) {
			case "New File": {
				// If creating under a file, fallback to parent folder
				if (node?.type === "file") {
					const parts = path.split("/");
					parts.pop();
					path = parts.join("/");
					node = findNode(this.data, path);
				}
				// if still a file after fallback, ignore
				if (node?.type === 'file') break;
				const fname = this.settings.newFilePrompt
					? this.settings.newFilePrompt()
					: await this._showInputModal('Create New File', 'Enter file name...', 'newFile.js');

				if (fname) {
					if (this.settings.onCreateFile) {
						this.settings.onCreateFile(path, fname);
					} else {
						this.createFile(path, fname);
					}
				}
				break;
			}

			case "New Folder": {
				// If creating under a file, fallback to parent folder
				if (node?.type === "file") {
					const parts = path.split("/");
					parts.pop();
					path = parts.join("/");
					node = findNode(this.data, path);
				}
				// if still a file after fallback, ignore
				if (node?.type === 'file') break;
				const dname = this.settings.newFolderPrompt
					? this.settings.newFolderPrompt()
					: await this._showInputModal('Create New Folder', 'Enter folder name...', 'newFolder');

				if (dname) {
					if (this.settings.onCreateFolder) {
						this.settings.onCreateFolder(path, dname);
					} else {
						this.createFolder(path, dname);
					}
				}
				break;
			}

			case "Rename": {
				// trigger inline rename if element present
				const nodeEl = document.querySelector(`.tf-node[data-path="${path}"]`);
				if (nodeEl) {
					const nameEl = nodeEl.querySelector('.tf-name-text');
					if (nameEl) {
						// directly trigger the rename UI without event
						nameEl.contentEditable = true;
						nameEl.focus();
						// select text
						const range = document.createRange();
						range.selectNodeContents(nameEl);
						const sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					}
				}
				break;
			} case "Delete": {
				// use modal pipeline (await it)
				const ok = this._showConfirmModal(`Delete "${node?.name}"?`);

				if (ok) {
					if (this.settings.onDelete) {
						this.settings.onDelete(this.selectedPath);
					} else {
						this.deleteNode(this.selectedPath);
					}
				}
				break;
			}
		}

		this.menu.style.display = "none";
	}

}
