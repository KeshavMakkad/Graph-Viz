export class TopoSort {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    
    // Build adjacency list
    this.adj = new Map();
    nodes.forEach(node => this.adj.set(node.id, []));
    
    edges.forEach(edge => {
      if (!this.adj.has(edge.a)) this.adj.set(edge.a, []);
      this.adj.get(edge.a).push(edge.b);
    });
  }

  /**
   * Detect cycles in the graph using DFS
   * @returns {Object} Information about cycles in the graph
   */
  detectCycles() {
    const visited = new Set();
    const recStack = new Set(); // For recursion stack
    const cycles = [];
    let hasCycle = false;
    
    // DFS to detect cycles
    const dfs = (node, path = []) => {
      visited.add(node);
      recStack.add(node);
      path.push(node);
      
      for (const neighbor of this.adj.get(node) || []) {
        // If neighbor hasn't been visited, visit it
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, [...path])) {
            return true;
          }
        }
        // If neighbor is in recursion stack, we found a cycle
        else if (recStack.has(neighbor)) {
          // Extract the cycle
          const cycleStart = path.indexOf(neighbor);
          const cycle = path.slice(cycleStart);
          cycle.push(neighbor); // Close the cycle
          cycles.push(cycle);
          hasCycle = true;
          return true;
        }
      }
      
      // Remove from recursion stack
      recStack.delete(node);
      return false;
    };
    
    // Check all nodes
    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }
    
    return {
      hasCycle,
      cycles
    };
  }

  /**
   * Run topological sort with Khan's Algorithm visualization
   * @returns {Object} Result with steps and order
   */
  topoSortWithVisualization() {
    const steps = [];
    const order = [];
    const cycleNodes = new Set(); // Nodes that are part of cycles
    
    // First detect cycles with DFS
    const { hasCycle, cycles } = this.detectCycles();
    
    if (cycles.length > 0) {
      cycles.forEach(cycle => {
        cycle.forEach(node => cycleNodes.add(node));
      });
    }
    
    // Build in-degree map for all nodes
    const inDegree = new Map();
    this.nodes.forEach(node => inDegree.set(node.id, 0));
    
    // Calculate in-degree for each node
    this.edges.forEach(edge => {
      inDegree.set(edge.b, (inDegree.get(edge.b) || 0) + 1);
    });
    
    // Queue for nodes with in-degree 0
    const queue = [];
    
    // Add all nodes with in-degree 0 to the queue
    this.nodes.forEach(node => {
      if (inDegree.get(node.id) === 0) {
        queue.push(node.id);
      }
    });
    
    // Add initial state
    steps.push({
      type: 'init',
      queue: [...queue],
      order: [],
      inDegree: new Map(inDegree),
      current: null,
      hasCycle,
      cycles,
      cycleNodes: new Set([...cycleNodes])
    });
    
    // Process nodes in queue
    while (queue.length > 0) {
      // Take next node with 0 in-degree
      const current = queue.shift();
      
      // Add to topological order
      order.push(current);
      
      // Show the node being processed
      steps.push({
        type: 'process',
        queue: [...queue],
        order: [...order],
        inDegree: new Map(inDegree),
        current,
        neighbors: [...(this.adj.get(current) || [])],
        hasCycle,
        cycles,
        cycleNodes: new Set([...cycleNodes])
      });
      
      // Process neighbors - reduce their in-degree
      const neighbors = this.adj.get(current) || [];
      const newQueueAdditions = [];
      
      // For each neighbor, reduce in-degree by 1
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        
        // If in-degree becomes 0, add to queue
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
          newQueueAdditions.push(neighbor);
        }
      }
      
      // Show the in-degree updates and queue changes
      if (neighbors.length > 0) {
        steps.push({
          type: 'update-degrees',
          queue: [...queue],
          order: [...order],
          inDegree: new Map(inDegree),
          current,
          newQueueAdditions,
          neighbors,
          hasCycle,
          cycles,
          cycleNodes: new Set([...cycleNodes])
        });
      }
    }
    
    // Add completion state
    steps.push({
      type: 'complete',
      queue: [],
      order: [...order],
      inDegree: new Map(inDegree),
      current: null,
      hasCycle,
      cycles,
      cycleNodes: new Set([...cycleNodes]),
      // If we processed fewer nodes than total, there's a cycle
      isPartial: order.length < this.nodes.length
    });
    
    return {
      steps,
      order,
      hasCycle,
      cycles,
      cycleNodes,
      isPartial: order.length < this.nodes.length
    };
  }
  
  /**
   * Run standard topological sort with Khan's Algorithm (no visualization)
   * @returns {Object} The topological order and cycle information
   */
  topoSort() {
    const { hasCycle, cycles } = this.detectCycles();
    const order = [];
    
    // Build in-degree map
    const inDegree = new Map();
    this.nodes.forEach(node => inDegree.set(node.id, 0));
    
    // Calculate in-degrees
    this.edges.forEach(edge => {
      inDegree.set(edge.b, (inDegree.get(edge.b) || 0) + 1);
    });
    
    // Queue for nodes with in-degree 0
    const queue = [];
    
    // Add all nodes with in-degree 0 to queue
    this.nodes.forEach(node => {
      if (inDegree.get(node.id) === 0) {
        queue.push(node.id);
      }
    });
    
    // Process nodes
    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);
      
      // Reduce in-degree of neighbors
      for (const neighbor of (this.adj.get(current) || [])) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    return {
      order,
      hasCycle,
      cycles,
      isPartial: order.length < this.nodes.length
    };
  }
}
