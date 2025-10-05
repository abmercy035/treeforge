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
		bar.innerHTML = `
			<button class="tf-btn" data-action="new-file">New File</button>
			<button class="tf-btn" data-action="new-folder">New Folder</button>
			<button class="tf-btn" data-action="collapse-all">Collapse All</button>
			<button class="tf-btn" data-action="refresh">Refresh</button>`;
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

	// _attachEvents() {
	// 	this.container.querySelectorAll(".tf-node").forEach(el => {
	// 		const path = el.dataset.path;
	// 		const node = findNode(this.data, path);

	// 		// Left click → toggle folder or open file
	// 		el.onclick = (e) => {
	// 			if (e.target.classList.contains("tf-action")) return; // skip if clicking ⋮

	// 			if (node.type === "folder") {
	// 				node.collapsed = !node.collapsed;
	// 				this.refresh();
	// 			} else {
	// 				this.onFileOpen(node);
	// 			}
	// 		};

	// 		// Right-click → context menu
	// 		el.oncontextmenu = (e) => {
	// 			e.preventDefault();
	// 			this._showContextMenu(e, path);
	// 		};

	// 		// ⋮ button click
	// 		const actionBtn = el.querySelector(".tf-action");
	// 		if (actionBtn) {
	// 			actionBtn.onclick = (e) => {
	// 				e.stopPropagation();
	// 				this._showContextMenu(e, path);
	// 			};
	// 		}
	// 	});
	// }

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



	// 	_handleContextAction(action) {
	//   let path = this.selectedPath;
	//   let node = findNode(this.data, path);

	//   // If it's a file and user clicks "New File/Folder", fallback to parent
	//   if (node?.type === "file") {
	//     const parts = path.split("/");
	//     parts.pop();
	//     path = parts.join("/");
	//     node = findNode(this.data, path);
	//   }

	//   switch (action) {
	//     case "New File":
	//       {
	//         let fname = this.settings.newFilePrompt 
	//           ? this.settings.newFilePrompt()
	//           : prompt("Enter file name:", "newFile.js");
	//         if (fname) this.createFile(path, fname);
	//       }
	//       break;

	//     case "New Folder":
	//       {
	//         let dname = this.settings.newFolderPrompt 
	//           ? this.settings.newFolderPrompt()
	//           : prompt("Enter folder name:", "newFolder");
	//         if (dname) this.createFolder(path, dname);
	//       }
	//       break;

	//     case "Rename":
	//       {
	//         const newName = this.settings.renamePrompt 
	//           ? this.settings.renamePrompt(node.name)
	//           : prompt("Rename to:", node.name);
	//         if (newName) this.renameNode(this.selectedPath, newName);
	//       }
	//       break;

	//     case "Delete":
	//       {
	//         const ok = this.settings.deleteConfirm
	//           ? this.settings.deleteConfirm(node.name)
	//           : confirm(`Delete "${node.name}"?`);
	//         if (ok) this.deleteNode(this.selectedPath);
	//       }
	//       break;
	//   }

	//   this.menu.style.display = "none";
	// }




}
