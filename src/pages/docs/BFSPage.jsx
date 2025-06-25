import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/docs/AlgorithmPage.css";
import DocsNavigation from "../../components/docs/DocsNavigation";
import DocsHeader from "../../components/docs/DocsHeader";
import InteractiveGraph from "../../components/docs/InteractiveGraph";

const BFSPage = () => {
  // Sample graph for BFS example
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

  // BFS steps for visualization
  const bfsSteps = [
    {
      description: "Start at node 1, mark as visited, add to queue.",
      visited: [1],
      queue: [1],
      current: 1
    },
    {
      description: "Dequeue 1, visit its neighbors 2 and 3.",
      visited: [1, 2, 3],
      queue: [2, 3],
      current: 1,
      newlyVisited: [2, 3]
    },
    {
      description: "Dequeue 2, visit its unvisited neighbors 4 and 5.",
      visited: [1, 2, 3, 4, 5],
      queue: [3, 4, 5],
      current: 2,
      newlyVisited: [4, 5]
    },
    {
      description: "Dequeue 3, but all its neighbors are already visited.",
      visited: [1, 2, 3, 4, 5],
      queue: [4, 5],
      current: 3,
      newlyVisited: []
    },
    {
      description: "Dequeue 4, visit its unvisited neighbor 6.",
      visited: [1, 2, 3, 4, 5, 6],
      queue: [5, 6],
      current: 4,
      newlyVisited: [6]
    },
    {
      description: "Dequeue 5, but all its neighbors are already visited.",
      visited: [1, 2, 3, 4, 5, 6],
      queue: [6],
      current: 5,
      newlyVisited: []
    },
    {
      description: "Dequeue 6, but all its neighbors are already visited.",
      visited: [1, 2, 3, 4, 5, 6],
      queue: [],
      current: 6,
      newlyVisited: []
    },
    {
      description: "BFS traversal complete! Final order: 1, 2, 3, 4, 5, 6",
      visited: [1, 2, 3, 4, 5, 6],
      queue: [],
      complete: true
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < bfsSteps.length - 1) {
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
      <DocsHeader title="Breadth-First Search (BFS)" />
      
      <div className="algorithm-page-content">
        <DocsNavigation />
        
        <main className="algorithm-main">
          <section className="algorithm-intro">
            <h2>What is Breadth-First Search?</h2>
            <p>
              Breadth-First Search (BFS) is a graph traversal algorithm that explores all vertices 
              at the current depth level before moving on to vertices at the next depth level.
            </p>
            <p>
              BFS traverses a graph in a layered manner, beginning at the source node and exploring all its neighbors 
              before moving to the next level of nodes.
            </p>
          </section>
          
          <section className="algorithm-properties">
            <h2>Key Properties</h2>
            <div className="properties-list">
              <div className="property-item">
                <div className="property-icon">🔍</div>
                <h3>Complete</h3>
                <p>If the graph is finite, BFS will find a path to any reachable node.</p>
              </div>
              <div className="property-item">
                <div className="property-icon">🎯</div>
                <h3>Optimal</h3>
                <p>For unweighted graphs, BFS finds the shortest path in terms of the number of edges.</p>
              </div>
              <div className="property-item">
                <div className="property-icon">⏱️</div>
                <h3>Time Complexity</h3>
                <p>O(V + E) where V is the number of vertices and E is the number of edges.</p>
              </div>
              <div className="property-item">
                <div className="property-icon">💾</div>
                <h3>Space Complexity</h3>
                <p>O(V) as it needs to store vertices in the queue and track visited vertices.</p>
              </div>
            </div>
          </section>
          
          <section className="algorithm-pseudocode">
            <h2>Pseudocode</h2>
            <div className="code-container">
              <pre>
{`function BFS(graph, startNode):
    create empty queue Q
    mark startNode as visited
    enqueue startNode into Q
    
    while Q is not empty:
        currentNode = dequeue from Q
        process currentNode
        
        for each neighbor of currentNode:
            if neighbor is not visited:
                mark neighbor as visited
                enqueue neighbor into Q`}
              </pre>
            </div>
          </section>
          
          <section className="algorithm-visualization">
            <h2>Interactive Visualization</h2>
            <p>Follow the BFS traversal step-by-step on this example graph.</p>
            
            <div className="visualization-container">
              <InteractiveGraph 
                nodes={graph.nodes} 
                edges={graph.edges}
                currentStep={bfsSteps[currentStep]}
              />
              
              <div className="visualization-controls">
                <button onClick={prevStep} disabled={currentStep === 0}>
                  ⬅️ Previous
                </button>
                <button onClick={nextStep} disabled={currentStep === bfsSteps.length - 1}>
                  Next ➡️
                </button>
                <button onClick={resetDemo}>
                  🔄 Reset
                </button>
              </div>
              
              <div className="step-description">
                <h3>Step {currentStep + 1} of {bfsSteps.length}</h3>
                <p>{bfsSteps[currentStep].description}</p>
                
                <div className="data-structures">
                  <div className="data-structure">
                    <h4>Queue</h4>
                    <div className="queue-display">
                      {bfsSteps[currentStep].queue.length > 0 ? 
                        bfsSteps[currentStep].queue.map((node, idx) => (
                          <div key={idx} className="queue-item">{node}</div>
                        )) : 
                        <div className="empty-message">Empty</div>
                      }
                    </div>
                  </div>
                  
                  <div className="data-structure">
                    <h4>Visited Nodes</h4>
                    <div className="visited-display">
                      {bfsSteps[currentStep].visited.map((node, idx) => (
                        <div 
                          key={idx} 
                          className={`visited-item ${bfsSteps[currentStep].newlyVisited?.includes(node) ? 'newly-visited' : ''}`}
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
                <strong>Shortest Path Finding</strong>: In unweighted graphs, BFS finds the shortest path.
              </li>
              <li>
                <strong>Network Broadcasting</strong>: Used to determine the sequence for broadcasting information.
              </li>
              <li>
                <strong>Web Crawling</strong>: Search engines use BFS to traverse web pages.
              </li>
              <li>
                <strong>Social Networks</strong>: Finding people within a certain degree of connection.
              </li>
              <li>
                <strong>GPS Navigation</strong>: Finding nearby locations (when distances are similar).
              </li>
            </ul>
          </section>
          
          <div className="page-navigation">
            <Link to="/docs" className="page-nav-btn">← Back to Algorithms</Link>
            <Link to="/docs/dfs" className="page-nav-btn">Next: Depth-First Search →</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BFSPage;
