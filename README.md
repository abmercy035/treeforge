# 🌲 TreeForge - Getting Started

**A lightweight, dependency-free JavaScript package for rendering file trees with style.**

[![NPM](https://img.shields.io/badge/npm-treeforge-red.svg)](https://www.npmjs.com/package/treeforge)
[![GitHub](https://img.shields.io/badge/github-treeforge-blue.svg)](https://github.com/abmercy035/treeforge)

---

## 📦 Installation

```bash
npm install treeforge
```

### **Don't forget the CSS!**

Add the TreeForge UI stylesheet to your HTML:

```html
<!-- Option 1: Direct link (CDN) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/treeforge@1.0.0/styles/ui.css">

<!-- Option 2: From node_modules -->
<link rel="stylesheet" href="node_modules/treeforge/styles/ui.css">

<!-- Option 3: Import in JS (with bundler) -->
<script>
import 'treeforge/styles/ui.css';
</script>
```

---

## 🚀 Quick Start (3 Lines)

```javascript
import TreeForge, { ConfigPresets } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: { name: 'root', type: 'folder', children: [] },
    ...ConfigPresets.GITHUB_CLONE  // That's it!
});
```

**Output:**
```
📁 root
└── (empty folder)
```

---

## ✨ What You Get

### 🎨 **15 Beautiful Styles**
```javascript
import { TreeStyles } from 'treeforge';

settings: TreeStyles.GITHUB            // GitHub style
settings: TreeStyles.VSCODE_DARK       // VS Code dark
settings: TreeStyles.DRACULA           // Dracula theme
settings: TreeStyles.NORD              // Nord theme
// ... and 11 more!
```

### ⚙️ **15 Configuration Presets**
```javascript
import { ConfigPresets } from 'treeforge';

...ConfigPresets.GITHUB_CLONE         // GitHub browser
...ConfigPresets.VSCODE_CLONE         // VS Code editor
...ConfigPresets.FILE_MANAGER         // File manager
...ConfigPresets.DOCS_BROWSER         // Documentation
// ... and 11 more!
```

### 🪝 **10 Lifecycle Hooks**
```javascript
hooks: {
    onCreateFile: (path) => {},
    onDeleteFile: (path) => {},
    onReadFile: (path) => {},
    onWriteFile: (path, content) => {},
    // ... and 6 more!
}
```

---

## 📖 Complete Examples

### Example 1: Simple Tree
```javascript
import TreeForge from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: {
        name: 'my-project',
        type: 'folder',
        children: [
            { name: 'src', type: 'folder', children: [] },
            { name: 'README.md', type: 'file' }
        ]
    }
});
```

### Example 2: With Built-in Style
```javascript
import TreeForge, { TreeStyles } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: myData,
    settings: TreeStyles.VSCODE_DARK  // Beautiful VS Code style!
});
```

### Example 3: Complete Configuration Preset
```javascript
import TreeForge, { ConfigPresets } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: myData,
    ...ConfigPresets.FILE_MANAGER  // Includes: style, features, shortcuts, menus!
});
```

### Example 4: With API Backend
```javascript
import TreeForge, { ConfigPresets, RestApiHooks } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    ...ConfigPresets.VSCODE_CLONE,
    onLoad: async () => {
        const res = await fetch('/api/tree');
        return await res.json();
    },
    hooks: RestApiHooks  // Pre-built REST API hooks!
});
```

### Example 5: With LocalStorage
```javascript
import TreeForge, { TreeStyles, LocalStorageHooks } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: myData,
    settings: TreeStyles.GITHUB,
    hooks: LocalStorageHooks  // Auto-save to localStorage!
});
```

---

## 🎯 Import Guide

### Main Imports
```javascript
// TreeForge class (default export)
import TreeForge from 'treeforge';

// Everything else (named exports)
import { 
    TreeStyles,           // 15 visual styles
    ConfigPresets,        // 15 complete configs
    LocalStorageHooks,    // Pre-built hooks
    RestApiHooks,         // Pre-built hooks
    combineHooks,         // Utility functions
    getPreset,
    mergePresets
} from 'treeforge';
```

### All Available Exports
```javascript
import TreeForge, {
    // Styles & Presets
    TreeStyles,              // 15 visual themes
    ConfigPresets,           // 15 complete configurations
    
    // Hook Examples
    LocalStorageHooks,       // Save to localStorage
    RestApiHooks,            // Connect to REST API
    AnalyticsHooks,          // Track events
    ValidationHooks,         // Validate operations
    CacheHooks,              // Cache file content
    AutoSaveHooks,           // Auto-save with debounce
    combineHooks,            // Combine multiple hooks
    
    // Utilities
    getPreset,               // Get specific preset
    mergePresets,            // Merge presets
    listPresets,             // List all presets
    createConfig,            // Create custom config
    validateConfig,          // Validate config
    
    // References
    SettingsReference,
    EditorConfigReference,
    TreeDataStructure
} from 'treeforge';
```

---

## 📚 Documentation

- **[HOW_TO_USE.md](./HOW_TO_USE.md)** - Import guide and patterns
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete documentation (1600+ lines)
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheat sheet
- **[CONFIG_README.md](./CONFIG_README.md)** - Configuration guide
- **[COMPLETE_REFERENCE.md](./COMPLETE_REFERENCE.md)** - API reference
 - **[mds/README.md](./mds/README.md)** - Documentation index: an organized table-of-contents for the `mds/` docs folder.

---

## 🎨 All 15 Styles

| Style | Theme | Usage |
|-------|-------|-------|
| `MINIMAL` | Basic | `TreeStyles.MINIMAL` |
| `GITHUB` | GitHub | `TreeStyles.GITHUB` |
| `VSCODE_DARK` | VS Code Dark | `TreeStyles.VSCODE_DARK` |
| `VSCODE_LIGHT` | VS Code Light | `TreeStyles.VSCODE_LIGHT` |
| `COLORFUL` | Vibrant | `TreeStyles.COLORFUL` |
| `MATERIAL_DARK` | Material Dark | `TreeStyles.MATERIAL_DARK` |
| `MATERIAL_LIGHT` | Material Light | `TreeStyles.MATERIAL_LIGHT` |
| `ASCII` | Terminal | `TreeStyles.ASCII` |
| `ASCII_COMPACT` | Compact | `TreeStyles.ASCII_COMPACT` |
| `MONOCHROME` | B&W | `TreeStyles.MONOCHROME` |
| `SOLARIZED_DARK` | Solarized | `TreeStyles.SOLARIZED_DARK` |
| `DRACULA` | Dracula | `TreeStyles.DRACULA` |
| `NORD` | Nord | `TreeStyles.NORD` |
| `ONE_DARK` | One Dark | `TreeStyles.ONE_DARK` |
| `HIGH_CONTRAST` | Accessible | `TreeStyles.HIGH_CONTRAST` |

---

## ⚙️ All 15 Configuration Presets

| Preset | Best For | Usage |
|--------|----------|-------|
| `MINIMAL` | Simple trees | `ConfigPresets.MINIMAL` |
| `GITHUB_CLONE` | Repo browser | `ConfigPresets.GITHUB_CLONE` |
| `VSCODE_CLONE` | Code editor | `ConfigPresets.VSCODE_CLONE` |
| `FILE_MANAGER` | File operations | `ConfigPresets.FILE_MANAGER` |
| `DOCS_BROWSER` | Documentation | `ConfigPresets.DOCS_BROWSER` |
| `MEDIA_BROWSER` | Photos/videos | `ConfigPresets.MEDIA_BROWSER` |
| `CODE_EDITOR` | Code playground | `ConfigPresets.CODE_EDITOR` |
| `TERMINAL_STYLE` | CLI aesthetic | `ConfigPresets.TERMINAL_STYLE` |
| `COMPACT` | Sidebar | `ConfigPresets.COMPACT` |
| `ACCESSIBLE` | Screen readers | `ConfigPresets.ACCESSIBLE` |
| `MOBILE_OPTIMIZED` | Touch devices | `ConfigPresets.MOBILE_OPTIMIZED` |
| `LARGE_DATASET` | 10,000+ files | `ConfigPresets.LARGE_DATASET` |
| `COLLABORATIVE` | Team workspace | `ConfigPresets.COLLABORATIVE` |
| `READ_ONLY` | View-only | `ConfigPresets.READ_ONLY` |
| `DRACULA_THEME` | Dracula colors | `ConfigPresets.DRACULA_THEME` |
| `NORD_THEME` | Nord colors | `ConfigPresets.NORD_THEME` |

---

## 🪝 All 10 Hooks

```javascript
hooks: {
    onCreateFile: (path, parentNode) => {},      // File created
    onCreateFolder: (path, parentNode) => {},    // Folder created
    onDeleteFile: (path, node) => {},            // File deleted
    onDeleteFolder: (path, node) => {},          // Folder deleted
    onDeleteNode: (path, node) => {},            // Any node deleted
    onRenameNode: (oldPath, newPath, node) => {},// Node renamed
    onReadFile: (path, node) => 'content',       // Read file
    onWriteFile: (path, content, node) => {},    // Write file
    onLoad: () => treeData,                      // Load data
    onFileOpen: (path, content, node) => {}      // File opened
}
```

---

## 💡 Common Patterns

### Pattern: GitHub-style Browser
```javascript
import TreeForge, { ConfigPresets } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: myData,
    ...ConfigPresets.GITHUB_CLONE
});
```

### Pattern: VS Code-style Editor
```javascript
import TreeForge, { ConfigPresets } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: myData,
    ...ConfigPresets.VSCODE_CLONE
});
```

### Pattern: Custom Style + Hooks
```javascript
import TreeForge, { TreeStyles, LocalStorageHooks } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: myData,
    settings: TreeStyles.DRACULA,
    hooks: LocalStorageHooks
});
```

### Pattern: Preset + Override
```javascript
import TreeForge, { ConfigPresets, TreeStyles } from 'treeforge';

const tree = new TreeForge({
    containerId: 'tree',
    localData: myData,
    ...ConfigPresets.FILE_MANAGER,  // Full features
    settings: TreeStyles.NORD       // But use Nord theme
});
```

---

## 🎯 Key Features

✅ **Zero Dependencies** - Pure vanilla JavaScript  
✅ **15 Styles** - Beautiful pre-built themes  
✅ **15 Presets** - Complete configurations ready to use  
✅ **10 Hooks** - Full control over CRUD operations  
✅ **Lightweight** - <15KB minified  
✅ **Type Safe** - TypeScript interfaces included  
✅ **Framework Agnostic** - Works with React, Vue, Angular, vanilla JS  
✅ **Fully Documented** - 1600+ lines of documentation  

---

## 🔗 Links

- **GitHub**: https://github.com/abmercy035/treeforge
- **NPM**: https://npmjs.com/package/treeforge
- **Issues**: https://github.com/abmercy035/treeforge/issues
- **Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)

---

## 📄 License

ISC © [abmercy035](https://github.com/abmercy035)

---

**TreeForge - Render trees beautifully in 3 lines of code** 🌲✨
