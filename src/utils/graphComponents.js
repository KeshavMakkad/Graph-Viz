/**
 * Graph component detection algorithms
 * Data Structures From Scratch (DSFS) implementation
 */

/**
 * Counts connected components using DFS algorithm
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @param {boolean} isDirected - Whether the graph is directed
 * @returns {number} Number of connected components
 */
export function countConnectedComponentsDFS(nodes, edges, isDirected) {
  // Create adjacency list
  const adj = new Map();
  nodes.forEach(node => adj.set(node.id, []));
  
  // Fill adjacency list
  edges.forEach(edge => {
    if (!adj.has(edge.a)) adj.set(edge.a, []);
    if (!adj.has(edge.b)) adj.set(edge.b, []);
    
    adj.get(edge.a).push(edge.b);
    if (!isDirected) {
      adj.get(edge.b).push(edge.a);
    }
  });
  
  const visited = new Set();
  let count = 0;
  
  // DFS function to visit all nodes in a component
  function dfs(nodeId) {
    visited.add(nodeId);
    
    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }
  
  // Count all connected components
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      count++;
      dfs(node.id);
    }
  }
  
  return count;
}

/**
 * Finds connected components using DFS algorithm
 */
export function findConnectedComponentsDFS(nodes, edges, isDirected) {
  // Create adjacency list
  const adj = new Map();
  nodes.forEach(node => adj.set(node.id, []));
  
  // Fill adjacency list
  edges.forEach(edge => {
    if (!adj.has(edge.a)) adj.set(edge.a, []);
    if (!adj.has(edge.b)) adj.set(edge.b, []);
    
    adj.get(edge.a).push(edge.b);
    if (!isDirected) {
      adj.get(edge.b).push(edge.a);
    }
  });
  
  const visited = new Set();
  const components = [];
  
  // Helper function to perform DFS on a component
  function dfsVisit(nodeId, component) {
    visited.add(nodeId);
    component.push(nodeId);
    
    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsVisit(neighbor, component);
      }
    }
  }
  
  // Find all connected components
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const component = [];
      dfsVisit(node.id, component);
      components.push(component);
    }
  }
  
  return components;
}

/**
 * DFS with visualization steps for connected components
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @param {boolean} isDirected - Whether the graph is directed
 * @returns {Object} Object with steps and component info
 */
export function dfsComponentsWithVisualization(nodes, edges, isDirected) {
  // Create adjacency list
  const adj = new Map();
  nodes.forEach(node => adj.set(node.id, []));
  
  edges.forEach(edge => {
    if (!adj.has(edge.a)) adj.set(edge.a, []);
    if (!adj.has(edge.b)) adj.set(edge.b, []);
    
    adj.get(edge.a).push(edge.b);
    if (!isDirected) {
      adj.get(edge.b).push(edge.a);
    }
  });
  
  const visited = new Set();
  const components = [];
  const allSteps = [];
  
  // Add initial state
  allSteps.push({
    type: 'init',
    visited: new Set(),
    component: null,
    componentIndex: -1,
    stack: [],
    current: null
  });
  
  let componentIndex = 0;
  
  // Process each unvisited node
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      // Start a new component
      const component = [];
      const stack = [node.id];
      
      allSteps.push({
        type: 'start-component',
        visited: new Set([...visited]),
        component: [...component],
        componentIndex: componentIndex,
        stack: [...stack],
        current: node.id
      });
      
      // DFS for this component
      while (stack.length > 0) {
        const current = stack.pop();
        
        if (!visited.has(current)) {
          visited.add(current);
          component.push(current);
          
          allSteps.push({
            type: 'visit',
            visited: new Set([...visited]),
            component: [...component],
            componentIndex: componentIndex,
            stack: [...stack],
            current: current
          });
          
          // Add unvisited neighbors to stack
          const neighbors = [...(adj.get(current) || [])].reverse();
          
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              stack.push(neighbor);
              
              allSteps.push({
                type: 'stack-push',
                visited: new Set([...visited]),
                component: [...component],
                componentIndex: componentIndex,
                stack: [...stack],
                current: current,
                pushed: neighbor
              });
            }
          }
        }
      }
      
      // Component complete
      allSteps.push({
        type: 'complete-component',
        visited: new Set([...visited]),
        component: [...component],
        componentIndex: componentIndex,
        stack: [],
        current: null
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
}
