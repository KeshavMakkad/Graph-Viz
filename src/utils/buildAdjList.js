export function buildAdjList(nodes, edges, directed = false) {
  const adj = new Map();
  nodes.forEach(node => adj.set(node.id, []));

  edges.forEach(({ a, b, weight }) => {
    const w = weight ?? 1;
    adj.get(a).push({ node: b, weight: w });
    if (!directed) {
      adj.get(b).push({ node: a, weight: w });
    }
  });

  return adj;
}
