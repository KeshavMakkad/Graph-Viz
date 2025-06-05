export class DFS {
  constructor(nodes, edges, isDirected = false) {
    this.adj = new Map();
    this.visited = new Set();
    this.isDirected = isDirected;

    // Build adjacency list
    for (let node of nodes) {
      this.adj.set(node.id, []);
    }

    for (let edge of edges) {
      const weight = edge.weight ?? 1;
      this.adj.get(edge.a).push({ node: edge.b, weight });
      if (!isDirected) {
        this.adj.get(edge.b).push({ node: edge.a, weight });
      }
    }
  }

  dfs(start) {
    this.visited.clear();
    const result = [];

    const dfsUtil = (node) => {
      if (this.visited.has(node)) return;
      this.visited.add(node);
      result.push(node);
      for (let neighbor of this.adj.get(node)) {
        dfsUtil(neighbor.node);
      }
    };

    dfsUtil(start);
    return result;
  }

  dfsAll() {
    this.visited.clear();
    const result = [];

    for (let node of this.adj.keys()) {
      if (!this.visited.has(node)) {
        const component = [];
        const dfsUtil = (u) => {
          if (this.visited.has(u)) return;
          this.visited.add(u);
          component.push(u);
          for (let v of this.adj.get(u)) {
            dfsUtil(v.node);
          }
        };
        dfsUtil(node);
        result.push(component);
      }
    }

    return result; // Array of connected components
  }
}
