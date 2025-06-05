import { buildAdjList } from '../utils/buildAdjList';

export class BFS {
  constructor(nodes, edges, directed = false) {
    this.nodes = nodes;
    this.edges = edges;
    this.directed = directed;
    this.adj = buildAdjList(nodes, edges, directed);
  }

  // Standard BFS from a single source
  bfs(startId) {
    const visited = new Set();
    const order = [];
    const queue = [startId];

    while (queue.length > 0) {
      const node = queue.shift();
      if (visited.has(node)) continue;
      visited.add(node);
      order.push(node);

      for (const neighbor of this.adj.get(node)) {
        if (!visited.has(neighbor.node)) {
          queue.push(neighbor.node);
        }
      }
    }

    return order;
  }

  // Multi-source BFS
  multiSourceBfs(sourceIds) {
    const visited = new Set();
    const order = [];
    const queue = [...sourceIds];

    while (queue.length > 0) {
      const node = queue.shift();
      if (visited.has(node)) continue;
      visited.add(node);
      order.push(node);

      for (const neighbor of this.adj.get(node)) {
        if (!visited.has(neighbor.node)) {
          queue.push(neighbor.node);
        }
      }
    }

    return order;
  }

  // 0-1 BFS using deque
  zeroOneBfs(startId) {
    const dist = new Map();
    this.nodes.forEach(node => dist.set(node.id, Infinity));
    dist.set(startId, 0);

    const deque = [];
    deque.push(startId);

    while (deque.length > 0) {
      const u = deque.shift();

      for (const { node: v, weight } of this.adj.get(u)) {
        const w = weight ?? 1;
        const alt = dist.get(u) + w;

        if (alt < dist.get(v)) {
          dist.set(v, alt);
          if (w === 0) {
            deque.unshift(v); // push to front
          } else {
            deque.push(v); // push to back
          }
        }
      }
    }

    return dist;
  }
}
