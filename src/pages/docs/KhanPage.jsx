import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/docs/AlgorithmPage.css";
import DocsNavigation from "../../components/docs/DocsNavigation";
import DocsHeader from "../../components/docs/DocsHeader";
import InteractiveGraph from "../../components/docs/InteractiveGraph";

const KhanPage = () => {
  // Sample directed acyclic graph for Khan's algorithm with fixed positions
  const [graph, setGraph] = useState({
    nodes: [
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 250, y: 100 },
      { id: 3, x: 100, y: 200 },
      { id: 4, x: 400, y: 100 },
      { id: 5, x: 250, y: 200 }
    ],
    edges: [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 4 },
      { a: 2, b: 5 },
      { a: 3, b: 5 }
    ]
  });

  // Khan's algorithm steps for visualization
  const khanSteps = [
    {
      description: "Initialize in-degree for all nodes: Node 1: 0, Node 2: 1, Node 3: 1, Node 4: 1, Node 5: 2",
      inDegree: new Map([
        [1, 0],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 2]
      ]),
      queue: [1],
      topoOrder: [],
      current: null
    },
    {
      description: "Dequeue Node 1 (in-degree = 0). Add Node 1 to topological order.",
      inDegree: new Map([
        [1, 0],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 2]
      ]),
      queue: [],
      topoOrder: [1],
      current: 1,
      processing: 1
    },
    {
      description: "Reduce in-degree of Node 1's neighbors (Nodes 2 and 3). Both now have in-degree 0.",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 1],
        [5, 2]
      ]),
      queue: [2, 3],
      topoOrder: [1],
      current: 1,
      updated: [2, 3]
    },
    {
      description: "Dequeue Node 2 (in-degree = 0). Add Node 2 to topological order.",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 1],
        [5, 2]
      ]),
      queue: [3],
      topoOrder: [1, 2],
      current: 2,
      processing: 2
    },
    {
      description: "Reduce in-degree of Node 2's neighbors (Nodes 4 and 5).",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 1]
      ]),
      queue: [3, 4],
      topoOrder: [1, 2],
      current: 2,
      updated: [4, 5]
    },
    {
      description: "Dequeue Node 3 (in-degree = 0). Add Node 3 to topological order.",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 1]
      ]),
      queue: [4],
      topoOrder: [1, 2, 3],
      current: 3,
      processing: 3
    },
    {
      description: "Reduce in-degree of Node 3's neighbors (Node 5).",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0]
      ]),
      queue: [4, 5],
      topoOrder: [1, 2, 3],
      current: 3,
      updated: [5]
    },
    {
      description: "Dequeue Node 4 (in-degree = 0). Add Node 4 to topological order.",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0]
      ]),
      queue: [5],
      topoOrder: [1, 2, 3, 4],
      current: 4,
      processing: 4
    },
    {
      description: "Node 4 has no neighbors, so no in-degrees to update.",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0]
      ]),
      queue: [5],
      topoOrder: [1, 2, 3, 4],
      current: 4
    },
    {
      description: "Dequeue Node 5 (in-degree = 0). Add Node 5 to topological order.",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0]
      ]),
      queue: [],
      topoOrder: [1, 2, 3, 4, 5],
      current: 5,
      processing: 5
    },
    {
      description: "Node 5 has no neighbors. Queue is empty. Topological sort complete!",
      inDegree: new Map([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0]
      ]),
      queue: [],
      topoOrder: [1, 2, 3, 4, 5],
      complete: true
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < khanSteps.length - 1) {
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
      <DocsHeader title="Khan's Algorithm" />
      
      <div className="algorithm-page-content">
        <DocsNavigation />
        
        <main className="algorithm-main">
          <section className="algorithm-intro">
            <h2>What is Khan's Algorithm?</h2>
            <p>
              Khan's Algorithm is a method for performing a topological sort on a directed acyclic graph (DAG).
              A topological sort is a linear ordering of vertices such that for every directed edge (u, v), 
              vertex u comes before vertex v in the ordering.
            </p>
            <p>
              This algorithm is particularly useful for scheduling tasks with dependencies or determining 
              the order of courses with prerequisites.
            </p>
          </section>
          
          <section className="algorithm-properties">
            <h2>Key Properties</h2>
            <div className="properties-list">
              <div className="property-item">
                <div className="property-icon">🔍</div>
                <h3>Only for DAGs</h3>
                <p>Only applicable to directed acyclic graphs (graphs with no cycles).</p>
              </div>
              <div className="property-item">
                <div className="property-icon">🔄</div>
                <h3>Cycle Detection</h3>
                <p>Can detect if a graph has cycles (not a valid DAG).</p>
              </div>
              <div className="property-item">
                <div className="property-icon">⏱️</div>
                <h3>Time Complexity</h3>
                <p>O(V + E) where V is the number of vertices and E is the number of edges.</p>
              </div>
              <div className="property-item">
                <div className="property-icon">💾</div>
                <h3>Space Complexity</h3>
                <p>O(V) to store the in-degree, queue, and result.</p>
              </div>
            </div>
          </section>
          
          <section className="algorithm-pseudocode">
            <h2>Pseudocode</h2>
            <div className="code-container">
              <pre>
{`function KahnTopologicalSort(graph):
    calculate in-degree for each vertex
    initialize empty result list
    initialize queue with all vertices that have in-degree 0
    
    while queue is not empty:
        vertex = dequeue from queue
        add vertex to result list
        
        for each neighbor of vertex:
            reduce in-degree of neighbor by 1
            if in-degree of neighbor becomes 0:
                enqueue neighbor
    
    if length of result list equals number of vertices:
        return result list (valid topological sort)
    else:
        return error (graph has a cycle)`}
              </pre>
            </div>
          </section>
          
          <section className="algorithm-visualization">
            <h2>Interactive Visualization</h2>
            <p>Follow Khan's algorithm step-by-step on this course prerequisite graph.</p>
            
            <div className="visualization-container">
              <InteractiveGraph 
                nodes={graph.nodes} 
                edges={graph.edges}
                currentStep={khanSteps[currentStep]}
                directed={true}
              />
              
              <div className="visualization-controls">
                <button onClick={prevStep} disabled={currentStep === 0}>
                  ⬅️ Previous
                </button>
                <button onClick={nextStep} disabled={currentStep === khanSteps.length - 1}>
                  Next ➡️
                </button>
                <button onClick={resetDemo}>
                  🔄 Reset
                </button>
              </div>
              
              <div className="step-description">
                <h3>Step {currentStep + 1} of {khanSteps.length}</h3>
                <p>{khanSteps[currentStep].description}</p>
                
                <div className="data-structures">
                  <div className="data-structure">
                    <h4>Queue (In-degree = 0)</h4>
                    <div className="queue-display">
                      {khanSteps[currentStep].queue?.length > 0 ? 
                        khanSteps[currentStep].queue.map((node, idx) => (
                          <div key={idx} className={`queue-item`}>{node}</div>
                        )) : 
                        <div className="empty-message">Empty</div>
                      }
                    </div>
                  </div>
                  
                  <div className="data-structure">
                    <h4>Topological Order</h4>
                    <div className="topo-order-display">
                      {khanSteps[currentStep].topoOrder?.length > 0 ? 
                        khanSteps[currentStep].topoOrder.map((node, idx) => (
                          <div 
                            key={idx} 
                            className={`topo-item ${node === khanSteps[currentStep].processing ? 'just-added' : ''}`}
                          >
                            {node}
                          </div>
                        )) : 
                        <div className="empty-message">No nodes processed yet</div>
                      }
                    </div>
                  </div>
                </div>
                
                <div className="in-degree-table">
                  <h4>In-degree Values</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Node</th>
                        <th>In-degree</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(khanSteps[currentStep].inDegree).map(([node, degree]) => (
                        <tr key={node} className={khanSteps[currentStep].updated?.includes(Number(node)) ? 'updated-row' : ''}>
                          <td>Node {node}</td>
                          <td>{degree}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          
          <section className="algorithm-applications">
            <h2>Applications</h2>
            <ul className="applications-list">
              <li>
                <strong>Course Scheduling</strong>: Determining the order of courses with prerequisites.
              </li>
              <li>
                <strong>Dependency Resolution</strong>: Resolution of dependencies in build systems, package managers.
              </li>
              <li>
                <strong>Task Scheduling</strong>: Scheduling tasks with dependencies in project management.
              </li>
              <li>
                <strong>Circuit Evaluation</strong>: Determining the order of evaluation in electronic circuits.
              </li>
              <li>
                <strong>Symbol Dependencies</strong>: Resolving symbol dependencies in compilers.
              </li>
            </ul>
          </section>
          
          <div className="page-navigation">
            <Link to="/docs/dfs" className="page-nav-btn">← Previous: Depth-First Search</Link>
            <Link to="/docs" className="page-nav-btn">Back to Algorithms</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KhanPage;
