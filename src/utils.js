export function findNode(tree, path) {
  if (!path) return { children: tree };
  const parts = path.split("/");
  let cur = { children: tree };
  for (const p of parts) {
    cur = (cur.children || []).find(c => c.name === p);
    if (!cur) return null;
  }
  return cur;
}

export function getPath(parentPath, name) {
  return parentPath ? `${parentPath}/${name}` : name;
}

