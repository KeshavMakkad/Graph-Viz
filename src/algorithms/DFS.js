export class DFS {
  constructor(nodes, edges, isDirected = false) {
    this.nodes = nodes; // Store nodes for component analysis
    this.edges = edges; // Store edges for component analysis
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

  /**
   * DFS with visualization steps for connected components
   * @returns {Object} Object with steps and component info
   */
  dfsComponentsWithVisualization() {
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
          component: [],
          componentIndex: componentIndex,
          component: componentIndex + 1, // Fix: Use 1-based indexing for display
          stack: [nodeId],
          current: null,
          visitedInComponent: new Set()
        });

        // Initialize DFS for this component
        const stack = [nodeId];

        // Process this component with DFS
        while (stack.length > 0) {
          const current = stack.pop(); // Take from top of stack

          if (visited.has(current)) {
            // Skip already visited nodes
            continue;
          }

          // Visit this node
          visited.add(current);
          component.push(current);

          // Add step to show node being processed
          allSteps.push({
            type: 'visit',
            visited: new Set([...visited]),
            component: [...component],
            componentIndex: componentIndex,
            component: componentIndex + 1, // Fix: Use 1-based indexing for display
            stack: [...stack],
            current: current,
            visitedInComponent: new Set([...component])
          });

          // Get all neighbors
          const neighbors = [];
          this.adj.get(current)?.forEach(neighbor => {
            if (!visited.has(neighbor.node)) {
              neighbors.push(neighbor.node);
            }
          });

          // Add unvisited neighbors to stack in reverse (so we process in the right order)
          const newStack = [...stack];
          for (let i = neighbors.length - 1; i >= 0; i--) {
            newStack.push(neighbors[i]);
          }

          // If we have neighbors to process
          if (neighbors.length > 0) {
            allSteps.push({
              type: 'stack-update',
              visited: new Set([...visited]),
              component: [...component],
              componentIndex: componentIndex,
              component: componentIndex + 1, // Fix: Use 1-based indexing for display
              stack: [...newStack],
              current: current,
              children: [...neighbors],
              visitedInComponent: new Set([...component])
            });
          }

          // Update stack with new nodes
          stack.length = 0;
          newStack.forEach(n => stack.push(n));
        }

        // Component complete
        allSteps.push({
          type: 'complete-component',
          visited: new Set([...visited]),
          component: [...component],
          componentIndex: componentIndex,
          component: componentIndex + 1, // Fix: Use 1-based indexing for display
          stack: [],
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
  }

  /**
   * Count connected components using DFS
   * @returns {Object} Object with component count, sizes and nodes
   */
  countComponents() {
    const visited = new Set();
    let componentCount = 0;
    const componentSizes = [];
    const componentNodes = [];

    // Process each unvisited node
    for (const node of this.nodes) {
      const nodeId = node.id;

      if (!visited.has(nodeId)) {
        componentCount++;
        const nodesInComponent = [];
        const stack = [nodeId];

        while (stack.length > 0) {
          const current = stack.pop();

          if (!visited.has(current)) {
            visited.add(current);
            nodesInComponent.push(current);

            // Add unvisited neighbors to stack
            this.adj.get(current)?.forEach(neighbor => {
              if (!visited.has(neighbor.node)) {
                stack.push(neighbor.node);
              }
            });
          }
        }

        componentSizes.push(nodesInComponent.length);
        componentNodes.push(nodesInComponent);
      }
    }

    return {
      count: componentCount,
      sizes: componentSizes,
      nodes: componentNodes
    };
  }
}