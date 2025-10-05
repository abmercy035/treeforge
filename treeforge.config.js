export const Config = ({ data, containerId }) => {
  return {
    containerId: containerId || "treeforge",
    localData: data,
    onFileOpen: (file) => {
      document.getElementById("editor").textContent = `Opened: ${file.name}`;
    },
    renamePrompt: (oldName) => prompt("Rename to:", oldName),
    deleteConfirm: (name) => confirm(`Delete "${name}"?`),
    settings: {
      asciiStyle: "unicode",
      // icons: { folder: "📁" }
    }
  }
};
 