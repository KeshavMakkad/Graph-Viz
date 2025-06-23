/**
 * Collection of sample graphs for the Graph Visualizer
 * Contains both undirected and directed graph examples
 */

// Sample undirected graphs collection
const undirectedGraphs = [
  // Grid graph
  {
    name: "Grid Network",
    nodes: [
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 250, y: 100 },
      { id: 3, x: 400, y: 100 },
      { id: 4, x: 100, y: 250 },
      { id: 5, x: 250, y: 250 },
      { id: 6, x: 400, y: 250 },
      { id: 7, x: 100, y: 400 },
      { id: 8, x: 250, y: 400 },
      { id: 9, x: 400, y: 400 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 4, b: 5 },
      { a: 5, b: 6 },
      { a: 7, b: 8 },
      { a: 8, b: 9 },
      { a: 1, b: 4 },
      { a: 2, b: 5 },
      { a: 3, b: 6 },
      { a: 4, b: 7 },
      { a: 5, b: 8 },
      { a: 6, b: 9 },
    ]
  },
  
  // Star graph
  {
    name: "Star Network",
    nodes: [
      { id: 1, x: 250, y: 250 },  // Center
      { id: 2, x: 150, y: 100 },
      { id: 3, x: 350, y: 100 },
      { id: 4, x: 400, y: 250 },
      { id: 5, x: 350, y: 400 },
      { id: 6, x: 150, y: 400 },
      { id: 7, x: 100, y: 250 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 1, b: 4 },
      { a: 1, b: 5 },
      { a: 1, b: 6 },
      { a: 1, b: 7 },
    ]
  },
  
  // Cycle graph
  {
    name: "Cycle Network",
    nodes: [
      { id: 1, x: 250, y: 100 },
      { id: 2, x: 400, y: 175 },
      { id: 3, x: 350, y: 350 },
      { id: 4, x: 150, y: 350 },
      { id: 5, x: 100, y: 175 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 5, b: 1 },
    ]
  },
  
  // Multiple components graph
  {
    name: "Disconnected Components",
    nodes: [
      // Component 1
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 200, y: 100 },
      { id: 3, x: 150, y: 200 },
      // Component 2
      { id: 4, x: 400, y: 150 },
      { id: 5, x: 500, y: 150 },
      // Component 3
      { id: 6, x: 300, y: 350 },
      { id: 7, x: 400, y: 350 },
      { id: 8, x: 350, y: 450 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 1 },
      { a: 4, b: 5 },
      { a: 6, b: 7 },
      { a: 7, b: 8 },
      { a: 8, b: 6 },
    ]
  },
  
  // Complete graph (K5)
  {
    name: "Complete Graph (K5)",
    nodes: [
      { id: 1, x: 250, y: 100 },
      { id: 2, x: 400, y: 200 },
      { id: 3, x: 350, y: 350 },
      { id: 4, x: 150, y: 350 },
      { id: 5, x: 100, y: 200 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 1, b: 4 },
      { a: 1, b: 5 },
      { a: 2, b: 3 },
      { a: 2, b: 4 },
      { a: 2, b: 5 },
      { a: 3, b: 4 },
      { a: 3, b: 5 },
      { a: 4, b: 5 },
    ]
  },
  
  // Bipartite graph
  {
    name: "Bipartite Graph",
    nodes: [
      // Left set
      { id: 101, x: 100, y: 100 },
      { id: 102, x: 100, y: 200 },
      { id: 103, x: 100, y: 300 },
      { id: 104, x: 100, y: 400 },
      // Right set
      { id: 201, x: 400, y: 100 },
      { id: 202, x: 400, y: 200 },
      { id: 203, x: 400, y: 300 },
      { id: 204, x: 400, y: 400 },
    ],
    edges: [
      { a: 101, b: 201 },
      { a: 101, b: 202 },
      { a: 102, b: 202 },
      { a: 102, b: 203 },
      { a: 103, b: 201 },
      { a: 103, b: 204 },
      { a: 104, b: 203 },
    ]
  },
  
  // Wheel graph
  {
    name: "Wheel Graph",
    nodes: [
      { id: 1, x: 250, y: 250 }, // Hub
      { id: 2, x: 250, y: 100 }, // Points on the wheel
      { id: 3, x: 400, y: 250 },
      { id: 4, x: 250, y: 400 },
      { id: 5, x: 100, y: 250 },
      { id: 6, x: 175, y: 175 },
      { id: 7, x: 325, y: 175 },
      { id: 8, x: 325, y: 325 },
      { id: 9, x: 175, y: 325 },
    ],
    edges: [
      // Spokes
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 1, b: 4 },
      { a: 1, b: 5 },
      { a: 1, b: 6 },
      { a: 1, b: 7 },
      { a: 1, b: 8 },
      { a: 1, b: 9 },
      // Rim
      { a: 2, b: 6 },
      { a: 6, b: 5 },
      { a: 5, b: 9 },
      { a: 9, b: 4 },
      { a: 4, b: 8 },
      { a: 8, b: 3 },
      { a: 3, b: 7 },
      { a: 7, b: 2 },
    ]
  },
  
  // Petersen graph (famous in graph theory)
  {
    name: "Petersen Graph",
    nodes: [
      // Outer pentagon
      { id: 1, x: 250, y: 100 },
      { id: 2, x: 400, y: 175 },
      { id: 3, x: 350, y: 350 },
      { id: 4, x: 150, y: 350 },
      { id: 5, x: 100, y: 175 },
      // Inner pentagram
      { id: 6, x: 250, y: 175 },
      { id: 7, x: 325, y: 200 },
      { id: 8, x: 300, y: 275 },
      { id: 9, x: 200, y: 275 },
      { id: 10, x: 175, y: 200 },
    ],
    edges: [
      // Outer pentagon
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 5, b: 1 },
      // Spokes
      { a: 1, b: 6 },
      { a: 2, b: 7 },
      { a: 3, b: 8 },
      { a: 4, b: 9 },
      { a: 5, b: 10 },
      // Inner pentagram
      { a: 6, b: 8 },
      { a: 8, b: 10 },
      { a: 10, b: 7 },
      { a: 7, b: 9 },
      { a: 9, b: 6 },
    ]
  },
];

// Sample directed graphs collection
const directedGraphs = [
  // Simple DAG
  {
    name: "Simple DAG",
    nodes: [
      { id: 1, x: 100, y: 150 },
      { id: 2, x: 250, y: 100 },
      { id: 3, x: 250, y: 200 },
      { id: 4, x: 400, y: 150 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 4 },
      { a: 3, b: 4 },
    ]
  },
  
  // Binary Tree
  {
    name: "Binary Tree",
    nodes: [
      { id: 1, x: 250, y: 100 },  // Root
      { id: 2, x: 150, y: 200 },  // Left child
      { id: 3, x: 350, y: 200 },  // Right child
      { id: 4, x: 100, y: 300 },  // Left-left
      { id: 5, x: 200, y: 300 },  // Left-right
      { id: 6, x: 300, y: 300 },  // Right-left
      { id: 7, x: 400, y: 300 },  // Right-right
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 4 },
      { a: 2, b: 5 },
      { a: 3, b: 6 },
      { a: 3, b: 7 },
    ]
  },
  
  // Cyclic directed graph
  {
    name: "Cyclic Directed Graph",
    nodes: [
      { id: 1, x: 150, y: 150 },
      { id: 2, x: 300, y: 150 },
      { id: 3, x: 300, y: 300 },
      { id: 4, x: 150, y: 300 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 1 },  // Creates a cycle
    ]
  },
  
  // Dependency graph
  {
    name: "Dependency Graph",
    nodes: [
      { id: 1, x: 250, y: 100 },  // Main
      { id: 2, x: 100, y: 200 },  // Config
      { id: 3, x: 250, y: 200 },  // Utils
      { id: 4, x: 400, y: 200 },  // UI
      { id: 5, x: 100, y: 300 },  // Logger
      { id: 6, x: 250, y: 300 },  // Database
      { id: 7, x: 400, y: 300 },  // Components
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 1, b: 4 },
      { a: 2, b: 5 },
      { a: 3, b: 5 },
      { a: 3, b: 6 },
      { a: 4, b: 7 },
      { a: 4, b: 3 },
    ]
  },
  
  // Two-way connections
  {
    name: "Two-way Connections",
    nodes: [
      { id: 1, x: 150, y: 150 },
      { id: 2, x: 350, y: 150 },
      { id: 3, x: 150, y: 350 },
      { id: 4, x: 350, y: 350 },
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 2, b: 4 },
      { a: 4, b: 2 },
      { a: 4, b: 3 },
      { a: 3, b: 4 },
      { a: 3, b: 1 },
      { a: 1, b: 3 },
    ]
  },
  
  // Lattice network
  {
    name: "Lattice Network",
    nodes: [
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 250, y: 100 },
      { id: 3, x: 400, y: 100 },
      { id: 4, x: 100, y: 250 },
      { id: 5, x: 250, y: 250 },
      { id: 6, x: 400, y: 250 },
      { id: 7, x: 100, y: 400 },
      { id: 8, x: 250, y: 400 },
      { id: 9, x: 400, y: 400 },
    ],
    edges: [
      // Left to right
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 4, b: 5 },
      { a: 5, b: 6 },
      { a: 7, b: 8 },
      { a: 8, b: 9 },
      // Top to bottom
      { a: 1, b: 4 },
      { a: 4, b: 7 },
      { a: 2, b: 5 },
      { a: 5, b: 8 },
      { a: 3, b: 6 },
      { a: 6, b: 9 },
    ]
  },
  
  // Multi-level hierarchy
  {
    name: "Multi-level Hierarchy",
    nodes: [
      // Top level
      { id: 1, x: 250, y: 50 },
      // Middle level
      { id: 2, x: 150, y: 150 },
      { id: 3, x: 350, y: 150 },
      // Bottom level
      { id: 4, x: 100, y: 250 },
      { id: 5, x: 200, y: 250 },
      { id: 6, x: 300, y: 250 },
      { id: 7, x: 400, y: 250 },
      // Leaf level
      { id: 8, x: 100, y: 350 },
      { id: 9, x: 175, y: 350 },
      { id: 10, x: 250, y: 350 },
      { id: 11, x: 325, y: 350 },
      { id: 12, x: 400, y: 350 },
    ],
    edges: [
      // Top to middle
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      // Middle to bottom
      { a: 2, b: 4 },
      { a: 2, b: 5 },
      { a: 3, b: 6 },
      { a: 3, b: 7 },
      // Bottom to leaf
      { a: 4, b: 8 },
      { a: 4, b: 9 },
      { a: 5, b: 10 },
      { a: 6, b: 11 },
      { a: 7, b: 12 },
    ]
  },
  
  // State machine
  {
    name: "State Machine",
    nodes: [
      { id: 1, x: 150, y: 200 }, // Start
      { id: 2, x: 300, y: 100 }, // Processing
      { id: 3, x: 450, y: 200 }, // Validated
      { id: 4, x: 300, y: 300 }, // Error
      { id: 5, x: 600, y: 200 }, // Complete
    ],
    edges: [
      { a: 1, b: 2 }, // Start -> Processing
      { a: 2, b: 3 }, // Processing -> Validated
      { a: 2, b: 4 }, // Processing -> Error
      { a: 3, b: 5 }, // Validated -> Complete
      { a: 3, b: 2 }, // Validated -> Processing (retry)
      { a: 4, b: 1 }, // Error -> Start (restart)
      { a: 4, b: 2 }, // Error -> Processing (retry)
      { a: 5, b: 1 }, // Complete -> Start (new task)
    ]
  },
];

/**
 * Gets a random graph from the undirected collection
 * @returns {Object} A randomly selected undirected graph
 */
export const getRandomUndirectedGraph = () => {
  const randomIndex = Math.floor(Math.random() * undirectedGraphs.length);
  return {
    ...undirectedGraphs[randomIndex],
    type: 'unweighted-undirected'
  };
};

/**
 * Gets a random graph from the directed collection
 * @returns {Object} A randomly selected directed graph
 */
export const getRandomDirectedGraph = () => {
  const randomIndex = Math.floor(Math.random() * directedGraphs.length);
  return {
    ...directedGraphs[randomIndex],
    type: 'unweighted-directed'
  };
};

/**
 * Gets a random graph based on the specified direction type
 * @param {string} directionType - 'directed' or 'undirected'
 * @returns {Object} A randomly selected graph of the specified type
 */
export const getRandomGraph = (directionType) => {
  if (directionType === 'directed') {
    return getRandomDirectedGraph();
  }
  return getRandomUndirectedGraph();
};
