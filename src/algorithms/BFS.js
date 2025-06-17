export class BFS {
  constructor(nodes, edges, isDirected = false) {
    this.nodes = nodes;
    this.edges = edges;
    this.isDirected = isDirected;
    this.adj = {};

    this.nodes.forEach((node) => {
      this.adj[node.id] = [];

    });

    this.edges.forEach((edge) => {
      this.adj[edge.a].push(edge.b);
      if (!this.isDirected) this.adj[edge.b].push(edge.a);
    });
  }

  bfsWithSteps(start) {
    const queue = [start];
    const visited = new Set([start]);
    const steps = [];

    while (queue.length > 0) {
      const current = queue.shift();

      // children = neighbors not visited
      const children = this.adj[current].filter((n) => !visited.has(n));

      steps.push({ current, children });

      children.forEach((child) => {
        visited.add(child);
        queue.push(child);
      });
    }
    return steps;
  }
}
