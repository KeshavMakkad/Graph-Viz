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

      // Make a copy of the queue at this point
      const queueSnapshot = [...queue];
      
      // Add the children to the visited set and queue
      const newAdditions = [];
      children.forEach((child) => {
        visited.add(child);
        queue.push(child);
        newAdditions.push(child);
      });
      
      // Store the current state including the queue
      steps.push({ 
        current, 
        children, 
        queue: queueSnapshot,
        newAdditions  // Track which nodes are newly added in this step
      });
    }
    return steps;
  }

  shortestPathBFS(start, end) {
    const queue = [start];
    const visited = new Set([start]);
    const steps = [];
    const parent = {}; // To reconstruct the path
    let pathFound = false;
    
    while (queue.length > 0 && !pathFound) {
      const current = queue.shift();
      
      // If we reached the end node, we can stop
      if (current === end) {
        pathFound = true;
        
        // Mark this as the final step
        steps.push({
          current,
          children: [],
          queue: [...queue],
          newAdditions: [],
          isEnd: true
        });
        
        break;
      }
      
      // Get unvisited neighbors
      const children = this.adj[current].filter(n => !visited.has(n));
      
      // Make a copy of the queue at this point
      const queueSnapshot = [...queue];
      
      // Track newly added nodes
      const newAdditions = [];
      
      // Add neighbors to the queue
      children.forEach(child => {
        visited.add(child);
        queue.push(child);
        parent[child] = current; // Store the parent for path reconstruction
        newAdditions.push(child);
      });
      
      // Record this step
      steps.push({
        current,
        children,
        queue: queueSnapshot,
        newAdditions,
        isEnd: false
      });
    }
    
    // Reconstruct the path if found
    const path = [];
    if (pathFound) {
      let node = end;
      while (node !== undefined) {
        path.unshift(node);
        node = parent[node];
      }
    }
    
    return {
      steps,
      path,
      pathFound
    };
  }
}
