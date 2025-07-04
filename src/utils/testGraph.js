// Simple test graph data
export const getTestGraph = () => {
  return {
    nodes: [
      { id: 1, x: 150, y: 100 },
      { id: 2, x: 270, y: 80 },
      { id: 3, x: 390, y: 100 },
      { id: 4, x: 180, y: 220 },
      { id: 5, x: 300, y: 220 },
      { id: 6, x: 420, y: 220 },
      { id: 7, x: 240, y: 340 },
      { id: 8, x: 360, y: 340 },
      { id: 9, x: 620, y: 100 },
      { id: 10, x: 550, y: 200 },
      { id: 11, x: 690, y: 200 },
      { id: 12, x: 620, y: 340 },
      { id: 13, x: 100, y: 450 },
      { id: 14, x: 200, y: 450 },
    ],
    edges: [
      { a: 1, b: 2, weight: 4 },
      { a: 1, b: 4, weight: 3 },
      { a: 2, b: 3, weight: 2 },
      { a: 2, b: 5, weight: 5 },
      { a: 3, b: 6, weight: 1 },
      { a: 4, b: 5, weight: 2 },
      { a: 4, b: 7, weight: 6 },
      { a: 5, b: 6, weight: 4 },
      { a: 5, b: 8, weight: 3 },
      { a: 6, b: 8, weight: 2 },
      { a: 7, b: 8, weight: 4 },
      { a: 9, b: 10, weight: 2 },
      { a: 10, b: 11, weight: 3 },
      { a: 11, b: 9, weight: 4 },
      { a: 13, b: 14, weight: 5 },
    ]
  };
};

/**
 * Returns an array of the connected components in the test graph
 * Useful for visualizing and testing component detection algorithms
 */
export function getTestGraphComponents() {
  return [
    // Component IDs grouped by connected component
    [1, 2, 3, 4, 5, 6, 7, 8], // Main component
    [9, 10, 11],              // Triangle
    [12],                     // Isolated node
    [13, 14]                  // Line
  ];
}

/**
 * Returns a directed test graph
 * Useful for testing directed graph algorithms
 */
export const getDirectedTestGraph = () => {
  return {
    nodes: [
      { id: 1, x: 150, y: 100 },
      { id: 2, x: 250, y: 100 },
      { id: 3, x: 350, y: 100 },
      { id: 4, x: 150, y: 200 },
      { id: 5, x: 250, y: 200 },
      { id: 6, x: 350, y: 200 },
      { id: 7, x: 150, y: 300 },
      { id: 8, x: 250, y: 300 },
      { id: 9, x: 350, y: 300 },
      { id: 10, x: 500, y: 150 },
      { id: 11, x: 600, y: 150 },
      { id: 12, x: 500, y: 250 },
    ],
    edges: [
      { a: 1, b: 2, weight: 3 },
      { a: 2, b: 3, weight: 2 },
      { a: 1, b: 4, weight: 4 },
      { a: 2, b: 5, weight: 1 },
      { a: 3, b: 6, weight: 5 },
      { a: 4, b: 5, weight: 2 },
      { a: 5, b: 6, weight: 3 },
      { a: 4, b: 7, weight: 4 },
      { a: 5, b: 8, weight: 5 },
      { a: 6, b: 9, weight: 2 },
      { a: 7, b: 8, weight: 3 },
      { a: 8, b: 9, weight: 4 },
      // Cycle
      { a: 10, b: 11, weight: 2 },
      { a: 11, b: 12, weight: 3 },
      { a: 12, b: 10, weight: 1 },
    ]
  };
};

/**
 * Returns a directed acyclic graph (DAG) for testing topological sort
 */
export const getTopoSortTestGraph = () => {
  return {
    nodes: [
      { id: 1, x: 100, y: 150 },
      { id: 2, x: 250, y: 100 },
      { id: 3, x: 250, y: 200 },
      { id: 4, x: 400, y: 100 },
      { id: 5, x: 400, y: 200 },
      { id: 6, x: 550, y: 150 },
    ],
    edges: [
      { a: 1, b: 2, weight: 1 },
      { a: 1, b: 3, weight: 1 },
      { a: 2, b: 4, weight: 1 },
      { a: 3, b: 4, weight: 1 },
      { a: 3, b: 5, weight: 1 },
      { a: 4, b: 6, weight: 1 },
      { a: 5, b: 6, weight: 1 },
    ]
  };
};

/**
 * Returns a directed graph with cycles for testing topological sort
 */
export const getTopoSortCyclicTestGraph = () => {
  return {
    nodes: [
      { id: 1, x: 100, y: 150 },
      { id: 2, x: 250, y: 100 },
      { id: 3, x: 250, y: 200 },
      { id: 4, x: 400, y: 100 },
      { id: 5, x: 400, y: 200 },
      { id: 6, x: 550, y: 150 },
    ],
    edges: [
      { a: 1, b: 2, weight: 1 },
      { a: 1, b: 3, weight: 1 },
      { a: 2, b: 4, weight: 1 },
      { a: 3, b: 4, weight: 1 },
      { a: 4, b: 2, weight: 1 }, // Creates a cycle 2->4->2
      { a: 3, b: 5, weight: 1 },
      { a: 4, b: 6, weight: 1 },
      { a: 5, b: 6, weight: 1 },
    ]
  };
};

// Add default export for compatibility
export default { 
  getTestGraph, 
  getTestGraphComponents, 
  getDirectedTestGraph,
  getTopoSortTestGraph,
  getTopoSortCyclicTestGraph 
};
