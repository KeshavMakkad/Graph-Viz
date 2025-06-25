import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/docs/AlgorithmPage.css";
import DocsNavigation from "../../components/docs/DocsNavigation";
import DocsHeader from "../../components/docs/DocsHeader";
import InteractiveGraph from "../../components/docs/InteractiveGraph";

const DFSPage = () => {
  // Sample graph for DFS example
  const [graph, setGraph] = useState({
    nodes: [
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 220, y: 100 },
      { id: 3, x: 100, y: 220 },
      { id: 4, x: 220, y: 220 },
      { id: 5, x: 340, y: 100 },
      { id: 6, x: 340, y: 220 }
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 4 },
      { a: 2, b: 5 },
      { a: 3, b: 4 },
      { a: 4, b: 6 }
    ]
  });

  // DFS steps for visualization
  const dfsSteps = [
    {
      description: "Start at node 1, mark as visited, add to stack.",
      visited: [1],
      stack: [1],
      current: 1
    },
    {
      description: "Explore neighbor 2 of node 1.",
      visited: [1, 2],
      stack: [1, 2],
      current: 2,
      newlyVisited: [2]
    },
    {
      description: "Explore neighbor 4 of node 2.",
      visited: [1, 2, 4],
      stack: [1, 2, 4],
      current: 4,
      newlyVisited: [4]
    },
    {
      description: "Explore neighbor 6 of node 4.",
      visited: [1, 2, 4, 6],
      stack: [1, 2, 4, 6],
      current: 6,
      newlyVisited: [6]
    },
    {
      description: "Node 6 has no unvisited neighbors. Backtrack to node 4.",
      visited: [1, 2, 4, 6],
      stack: [1, 2, 4],
      current: 4,
      backtrack: true
    },
    {
      description: "Node 4 has no more unvisited neighbors. Backtrack to node 2.",
      visited: [1, 2, 4, 6],
      stack: [1, 2],
      current: 2,
      backtrack: true
    },
    {
      description: "Explore neighbor 5 of node 2.",
      visited: [1, 2, 4, 6, 5],
      stack: [1, 2, 5],
      current: 5,
      newlyVisited: [5]
    },
    {
      description: "Node 5 has no unvisited neighbors. Backtrack to node 2.",
      visited: [1, 2, 4, 6, 5],
      stack: [1, 2],
      current: 2,
      backtrack: true
    },
    {
      description: "Node 2 has no more unvisited neighbors. Backtrack to node 1.",
      visited: [1, 2, 4, 6, 5],
      stack: [1],
      current: 1,
      backtrack: true
    },
    {
      description: "Explore neighbor 3 of node 1.",
      visited: [1, 2, 4, 6, 5, 3],
      stack: [1, 3],
      current: 3,
      newlyVisited: [3]
    },
    {
      description: "Node 3 has no unvisited neighbors (node 4 was already visited). Backtrack to node 1.",
      visited: [1, 2, 4, 6, 5, 3],
      stack: [1],
      current: 1,
      backtrack: true
    },
    {
      description: "Node 1 has no more unvisited neighbors. DFS traversal is complete!",
      visited: [1, 2, 4, 6, 5, 3],
      stack: [],
      complete: true
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < dfsSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
  };

  return (
    <div className="algorithm-page">
      <DocsHeader title="Depth-First Search (DFS)" />
      
      <div className="algorithm-page-content">
        <DocsNavigation />
        
        <main className="algorithm-main">
          <section className="algorithm-intro">
            <h2>What is Depth-First Search?</h2>
            <p>
              Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible 
              along each branch before backtracking.
            </p>
            <p>
              DFS goes deep into the graph structure, following a single path until it cannot go further, 
              then backs up and tries alternative paths.
            </p>
          </section>
          
          <section className="algorithm-properties">
            <h2>Key Properties</h2>
            <div className="properties-list">
              <div className="property-item">
                <div className="property-icon">🔍</div>
                <h3>Complete</h3>
                <p>DFS will find all reachable nodes in a finite graph.</p>
              </div>
              <div className="property-item">
                <div className="property-icon">🎯</div>
                <h3>Non-optimal</h3>
                <p>Does not guarantee the shortest path in unweighted graphs.</p>
              </div>
              <div className="property-item">
                <div className="property-icon">⏱️</div>
                <h3>Time Complexity</h3>
                <p>O(V + E) where V is the number of vertices and E is the number of edges.</p>
              </div>
              <div className="property-item">
                <div className="property-icon">💾</div>
                <h3>Space Complexity</h3>
                <p>O(V) to store the visited vertices and the recursion stack.</p>
              </div>
            </div>
          </section>
          
          <section className="algorithm-pseudocode">
            <h2>Pseudocode</h2>
            <div className="code-container">
              <pre>
{`function DFS(graph, node):
    mark node as visited
    process node
    
    for each neighbor of node:
        if neighbor is not visited:
            DFS(graph, neighbor)
            
// Iterative version with explicit stack
function DFS_iterative(graph, startNode):
    create empty stack S
    push startNode onto S
    mark startNode as visited
    
    while S is not empty:
        current = pop from S
        process current
        
        for each neighbor of current:
            if neighbor is not visited:
                mark neighbor as visited
                push neighbor onto S`}
              </pre>
            </div>
          </section>
          
          <section className="algorithm-visualization">
            <h2>Interactive Visualization</h2>
            <p>Follow the DFS traversal step-by-step on this example graph.</p>
            
            <div className="visualization-container">
              <InteractiveGraph 
                nodes={graph.nodes} 
                edges={graph.edges}
                currentStep={dfsSteps[currentStep]}
              />
              
              <div className="visualization-controls">
                <button onClick={prevStep} disabled={currentStep === 0}>
                  ⬅️ Previous
                </button>
                <button onClick={nextStep} disabled={currentStep === dfsSteps.length - 1}>
                  Next ➡️
                </button>
                <button onClick={resetDemo}>
                  🔄 Reset
                </button>
              </div>
              
              <div className="step-description">
                <h3>Step {currentStep + 1} of {dfsSteps.length}</h3>
                <p>{dfsSteps[currentStep].description}</p>
                
                <div className="data-structures">
                  <div className="data-structure">
                    <h4>Stack</h4>
                    <div className="stack-display">
                      {dfsSteps[currentStep].stack?.length > 0 ? 
                        [...dfsSteps[currentStep].stack].reverse().map((node, idx) => (
                          <div key={idx} className={`stack-item ${idx === 0 ? 'top-of-stack' : ''}`}>{node}</div>
                        )) : 
                        <div className="empty-message">Empty</div>
                      }
                    </div>
                  </div>
                  
                  <div className="data-structure">
                    <h4>Visited Nodes</h4>
                    <div className="visited-display">
                      {dfsSteps[currentStep].visited.map((node, idx) => (
                        <div 
                          key={idx} 
                          className={`visited-item ${dfsSteps[currentStep].newlyVisited?.includes(node) ? 'newly-visited' : ''}`}
                        >
                          {node}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="algorithm-applications">
            <h2>Applications</h2>
            <ul className="applications-list">
              <li>
                <strong>Cycle Detection</strong>: DFS can efficiently detect cycles in a graph.
              </li>
              <li>
                <strong>Topological Sorting</strong>: For DAGs, DFS can find a valid topological order.
              </li>
              <li>
                <strong>Connected Components</strong>: DFS can find strongly connected components in a graph.
              </li>
              <li>
                <strong>Maze Solving</strong>: DFS can be used to find paths through mazes.
              </li>
              <li>
                <strong>Game Simulations</strong>: Used for exploring game states in games like chess.
              </li>
            </ul>
          </section>
          
          <div className="page-navigation">
            <Link to="/docs/bfs" className="page-nav-btn">← Previous: Breadth-First Search</Link>
            <Link to="/docs/khan" className="page-nav-btn">Next: Khan's Algorithm →</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DFSPage;
