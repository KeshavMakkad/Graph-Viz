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
  
  countComponents() {
    const visited = new Set();
    let componentCount = 0;
    const componentSizes = [];
    const componentNodes = []; // Store nodes in each component
    
    // Iterate through all nodes
    this.nodes.forEach(node => {
      const nodeId = node.id;
      
      // If this node has not been visited yet, it's part of a new component
      if (!visited.has(nodeId)) {
        componentCount++;
        let componentSize = 0;
        const nodesInComponent = [];
        
        // Run BFS from this node
        const queue = [nodeId];
        visited.add(nodeId);
        
        while (queue.length > 0) {
          const current = queue.shift();
          componentSize++;
          nodesInComponent.push(current);
          
          // Check all neighbors
          this.adj[current].forEach(neighbor => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          });
        }
        
        componentSizes.push(componentSize);
        componentNodes.push(nodesInComponent);
      }
    });
    
    return {
      count: componentCount,
      sizes: componentSizes,
      nodes: componentNodes
    };
  }
}

/**
 * DFS with visualization steps for connected components
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @param {boolean} isDirected - Whether the graph is directed
 * @returns {Object} Object with steps and component info
 */
export function dfsComponentsWithVisualization(nodes, edges, isDirected) {
  // ...existing code...
}

/**
 * BFS with visualization steps for connected components
 * @returns {Object} Object with steps and component info
 */
BFS.prototype.bfsComponentsWithVisualization = function() {
  const visited = new Set();
  const components = [];
  const allSteps = [];
  let componentIndex = 0;
  
  // Initial state
  allSteps.push({
    type: 'init',
    visited: new Set(),
    component: null,
    componentIndex: -1,
    stack: [],
    queue: [],
    current: null,
    visitedInComponent: new Set()
  });
  
  for (const node of this.nodes) {
    const nodeId = node.id;
    
    if (!visited.has(nodeId)) {
      // Start a new component
      const component = [];
      
      // Add step to show new component start
      allSteps.push({
        type: 'start-component',
        visited: new Set([...visited]),
        component: componentIndex + 1,
        componentIndex: componentIndex,
        stack: [], // For compatibility with DFS
        queue: [nodeId],
        current: null,
        visitedInComponent: new Set()
      });
      
      // Initialize BFS for this component
      const queue = [nodeId];
      
      // Process this component with BFS
      while (queue.length > 0) {
        const current = queue.shift(); // Take from front of queue
        
        if (visited.has(current)) {
          // Skip already visited nodes
          continue;
        }
        
        // Visit this node
        visited.add(current);
        component.push(current);
        
        // Get all neighbors
        const neighbors = [];
        const nodeNeighbors = this.adj[current] || [];
        for (const neighbor of nodeNeighbors) {
          if (!visited.has(neighbor)) {
            neighbors.push(neighbor);
          }
        }
        
        // Add step to show node being processed
        allSteps.push({
          type: 'visit',
          visited: new Set([...visited]),
          component: componentIndex + 1,
          componentIndex: componentIndex,
          stack: [], // For compatibility with DFS
          queue: [...queue],
          current: current,
          children: [...neighbors],
          visitedInComponent: new Set([...component])
        });
        
        // Add unvisited neighbors to queue
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
        
        // If we have neighbors to process, show the updated queue
        if (neighbors.length > 0) {
          allSteps.push({
            type: 'queue-update',
            visited: new Set([...visited]),
            component: componentIndex + 1,
            componentIndex: componentIndex,
            stack: [], // For compatibility with DFS
            queue: [...queue],
            current: current,
            children: [...neighbors],
            newAdditions: [...neighbors],
            visitedInComponent: new Set([...component])
          });
        }
      }
      
      // Component complete
      allSteps.push({
        type: 'complete-component',
        visited: new Set([...visited]),
        component: componentIndex + 1,
        componentIndex: componentIndex,
        stack: [],
        queue: [],
        current: null,
        visitedInComponent: new Set([...component])
      });
      
      components.push(component);
      componentIndex++;
    }
  }
  
  return {
    steps: allSteps,
    components: components,
    count: components.length
  };
};