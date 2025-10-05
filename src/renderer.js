import { getPath } from "./utils.js";

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function renderTree(nodes, settings, prefix = "", parentPath = "") {
	if (!nodes) return "";

	// ? { branch: "├── ", last: "└── ", pipe: "│   " }
	const style = settings.asciiStyle === "unicode"
		? { branch: " ", last: " ", pipe: " " }
		: { branch: " ", last: " ", pipe: " " };

	let out = "";
	nodes.forEach((node, idx) => {
		const last = idx === nodes.length - 1;
		const connector = last ? style.last : style.branch;
		const icon = settings.icons[node.type];
		const path = getPath(parentPath, node.name);

		out += `<div class="tf-node" data-path="${escapeHtml(path)}">
		<div class="tf-node-name">${prefix}${connector}${icon} <span class="tf-name-text">${escapeHtml(node.name)}</span></div>
		<span class="tf-action"> ⋮  </span>
		</div>`;

		if (node.type === "folder" && !node.collapsed && node.children) {
			const newPrefix = prefix + (last ? " " : style.pipe);
			out += renderTree(node.children, settings, newPrefix, path);
		}
	});
	return out;
}
