import React, { useState, useEffect } from "react";
import Node from "./../components/Node";
import { BFS } from "../algorithms/BFS";
import { useLocation } from "react-router-dom";
import "./../styles/pages/GraphCanvas.css";
import { getTestGraph } from "../utils/testGraph";

const AlgorithmTrace = ({ currentStep, startNode, endNode, path, isCompleted, functionType, result }) => {
  if (!currentStep) return null;

  // Render different trace UI based on function type
  if (functionType === "shortestPath") {
    const { current, children, queue, isEnd } = currentStep;

    return (
      <div className="algorithm-trace">
        <h3>Shortest Path Algorithm Steps</h3>
        {isCompleted && path.length > 0 && (
          <div className="trace-path">
            <strong>Shortest Path Found:</strong>{" "}
            {path.join(" → ")}
            <div className="trace-path-length">
              <strong>Path Length:</strong> {path.length - 1} edge(s)
            </div>
          </div>
        )}
        <div className="trace-step">
          <strong>Start Node:</strong> {startNode}
        </div>
        <div className="trace-step">
          <strong>End Node:</strong> {endNode}
        </div>
        <div className="trace-step">
          <strong>Current Node:</strong> {current} {isEnd ? "(Destination Reached!)" : ""}
        </div>
        <div className="trace-step">
          <strong>Finding Neighbors:</strong>{" "}
          {children?.length > 0 ? children.join(", ") : "None"}
        </div>
        <div className="trace-step">
          <strong>Queue Status:</strong>{" "}
          {queue?.length > 0 ? queue.join(" → ") : "Empty"}
        </div>
      </div>
    );
  } 
  else if (functionType === "countComponents") {
    const { current, component, componentSize, totalComponents } = currentStep;
    
    return (
      <div className="algorithm-trace">
        <h3>Connected Components Analysis</h3>
        {result && (
          <div className="trace-result">
            <div className="component-count">
              <strong>Total Components:</strong> {result.count}
            </div>
            <div className="component-sizes">
              <strong>Component Sizes:</strong>{" "}
              {result.sizes.map((size, i) => `Component ${i+1}: ${size} node(s)`).join(", ")}
            </div>
          </div>
        )}
        <div className="trace-step">
          <strong>Current Node:</strong> {current}
        </div>
        <div className="trace-step">
          <strong>Component:</strong> {component} of {totalComponents}
        </div>
        <div className="trace-step">
          <strong>Component Size:</strong> {componentSize} node(s)
        </div>
      </div>
    );
  }
  
  return null;
};

const QueueDisplay = ({ queue, newAdditions, functionType, currentStep, result }) => {
  if (functionType === "shortestPath") {
    return (
      <div className="queue-display">
        <h3>BFS Queue</h3>
        <div className="queue-container">
          {!queue || queue.length === 0 ? (
            <div className="queue-empty">Queue Empty</div>
          ) : (
            queue.map((nodeId, index) => (
              <div
                key={index}
                className={`queue-item ${
                  newAdditions?.includes(nodeId) ? "newly-added" : ""
                }`}
              >
                {nodeId}
              </div>
            ))
          )}
        </div>
      </div>
    );
  } 
  else if (functionType === "countComponents") {
    const { component, visitedInComponent } = currentStep || {};
    const visitedNodes = Array.from(visitedInComponent || []);
    
    return (
      <div className="queue-display">
        <h3>Component Visualization</h3>
        <div className="component-indicator">
          {result && component && (
            <div className="current-component">
              <strong>Current Component:</strong> {component} of {result.count}
            </div>
          )}
        </div>
        <div className="component-nodes">
          {visitedNodes?.length > 0 && (
            <div className="nodes-in-component">
              <strong>Nodes in Component {component}:</strong>{" "}
              {result?.nodes[component - 1]?.join(", ")}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return null;
};

const GraphCanvas = () => {
  const location = useLocation();
  const name = location.state?.name || "Untitled";
  const graphType = location.state?.type || "unweighted-undirected";
  const [weightType, directionType] = graphType.split("-");
  const isWeighted = weightType === "weighted";
  const isDirected = directionType === "directed";

  // Available function types
  const graphFunctions = [
    { id: "shortestPath", label: "Find Shortest Path" },
    { id: "countComponents", label: "Count Connected Components" }
  ];
  
  // Available algorithm types
  const graphAlgorithms = {
    "shortestPath": [
      { id: "bfs", label: "Breadth-First Search (BFS)" }
    ],
    "countComponents": [
      { id: "bfs", label: "Breadth-First Search (BFS)" }
    ]
  };

  // Function and algorithm state
  const [selectedFunction, setSelectedFunction] = useState("shortestPath");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bfs");
  const [result, setResult] = useState(null); // For storing results like component count

  const [nodes, setNodes] = useState([]);

  const [edges, setEdges] = useState([]);

  const [nextId, setNextId] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState(undefined);
  const [steps, setSteps] = useState([]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showChildren, setShowChildren] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [startNodeId, setStartNodeId] = useState(null);
  const [endNodeId, setEndNodeId] = useState(null);
  const [path, setPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const [visualFunction, setVisualFunction] = useState("traversal");

  useEffect(() => {
    // Check if we're in dev mode
    const mode = import.meta.env.VITE_MODE || 'production';
    setIsDev(mode === 'dev');
    
    // Load test graph if in dev mode
    if (mode === 'dev') {
      handleLoadTestGraph();
    }
  }, []);

  // Handler to load test graph
  const handleLoadTestGraph = () => {
    const { nodes: testNodes, edges: testEdges } = getTestGraph();
    setNodes(testNodes);
    setEdges(testEdges);
    // Set nextId to be one more than the highest node id
    const maxId = Math.max(...testNodes.map(node => node.id));
    setNextId(maxId + 1);
  };
  
  const handleAddNode = () => {
    const x = 100 + Math.random() * 400;
    const y = 100 + Math.random() * 400;
    setNodes([...nodes, { id: nextId, x, y }]);
    setNextId(nextId + 1);
  };

  const handleNodeClick = (id) => {
    // If we're selecting nodes for BFS, skip edge creation mode
    if (isRunning) {
      return;
    }
    
    // If path visualization is shown, clear it when interacting with nodes
    if (path.length > 0) {
      setPath([]);
      setSteps([]);
    }
    
    if (selectedNodeId !== undefined && selectedNodeId !== id) {
      const a = selectedNodeId;
      const b = id;

      const exists = edges.some(
        (edge) =>
          (edge.a === a && edge.b === b) ||
          (!isDirected && edge.a === b && edge.b === a)
      );

      if (!exists) {
        let weight = null;
        if (isWeighted) {
          weight = prompt("Enter edge weight:", "1");
          if (weight === null || isNaN(weight)) return;
          weight = Number(weight);
        }
        setEdges([...edges, { a, b, weight }]);
      }
      setSelectedNodeId(undefined);
    } else {
      setSelectedNodeId(id);
    }
  };

  const handleNodeDrag = (id, newX, newY) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, x: newX, y: newY } : node
      )
    );
  };

  // This is now handled by runGraphFunction

  const runGraphFunction = () => {
    // Reset previous results
    setSteps([]);
    setCurrentStepIdx(0);
    setShowChildren(false);
    setPath([]);
    setResult(null);
    setIsRunning(true);
    
    const bfs = new BFS(nodes, edges, isDirected);
    
    // Execute the appropriate function based on selection
    if (selectedFunction === "shortestPath") {
      runShortestPathFunction(bfs);
    } else if (selectedFunction === "countComponents") {
      runCountComponentsFunction(bfs);
    }
  };
  
  const runShortestPathFunction = (bfs) => {
    // Prompt for start node
    let startNode = prompt("Enter start node ID:", selectedNodeId || "");
    if (!startNode || isNaN(startNode)) {
      alert("Please enter a valid start node ID.");
      setIsRunning(false);
      return;
    }
    startNode = Number(startNode);
    
    // Check if the start node exists
    if (!nodes.some(node => node.id === startNode)) {
      alert(`Node ${startNode} does not exist.`);
      setIsRunning(false);
      return;
    }
    
    // Prompt for end node
    let endNode = prompt("Enter end node ID:", "");
    if (!endNode || isNaN(endNode)) {
      alert("Please enter a valid end node ID.");
      setIsRunning(false);
      return;
    }
    endNode = Number(endNode);
    
    // Check if the end node exists and is different from the start
    if (!nodes.some(node => node.id === endNode)) {
      alert(`Node ${endNode} does not exist.`);
      setIsRunning(false);
      return;
    }
    
    if (startNode === endNode) {
      alert("Start and end nodes must be different.");
      setIsRunning(false);
      return;
    }
    
    // Set start and end nodes
    setStartNodeId(startNode);
    setEndNodeId(endNode);
    
    // Run BFS for shortest path
    setTimeout(() => {
      const result = bfs.shortestPathBFS(startNode, endNode);
      
      if (result.pathFound) {
        setSteps(result.steps);
        setPath(result.path);
        setCurrentStepIdx(0);
        setShowChildren(true);
        setIsPaused(false);
      } else {
        alert(`No path exists from node ${startNode} to node ${endNode}.`);
        setIsRunning(false);
      }
    }, 100);
  };
  
  const runCountComponentsFunction = (bfs) => {
    // Run the connected components algorithm
    setTimeout(() => {
      const componentsResult = bfs.countComponents();
      setResult(componentsResult);
      
      // Create visual steps for component discovery
      const visualSteps = [];
      let allVisitedNodes = new Set();
      
      componentsResult.nodes.forEach((componentNodes, index) => {
        componentNodes.forEach(nodeId => {
          // Create a step showing this node as part of the current component
          visualSteps.push({
            current: nodeId,
            children: [],
            component: index + 1,
            componentSize: componentNodes.length,
            visitedInComponent: new Set([...allVisitedNodes, nodeId]),
            totalComponents: componentsResult.count
          });
          allVisitedNodes.add(nodeId);
        });
      });
      
      setSteps(visualSteps);
      setCurrentStepIdx(0);
      setShowChildren(true);
      setIsPaused(false);
    }, 100);
  };

  const handleNextStep = () => {
    if (steps.length <= currentStepIdx) {
      // If we've reached the end of the steps
      if (isRunning) {
        setIsRunning(false);
      }
      return;
    }

    if (showChildren) {
      // first show children, then move forward on subsequent click
      setShowChildren(false);
    } else {
      // move forward to next step
      setCurrentStepIdx((prev) => {
        // Check if we're moving to the last step
        if (prev + 1 >= steps.length) {
          // Finish the animation
          setTimeout(() => {
            setIsRunning(false);
          }, 1000);
        }
        return prev + 1;
      });
      setShowChildren(true);
    }
  };

  // Add an effect to automatically move to the next step
  useEffect(() => {
    if (steps.length === 0 || isPaused) return;
    
    // If we're not running, don't proceed
    if (!isRunning) return;

    // If we're at the end, finish the animation
    if (currentStepIdx >= steps.length) {
      setIsRunning(false);
      return;
    }

    // Set a timeout to move to the next step
    const timer = setTimeout(() => {
      if (showChildren) {
        // After showing children, hide them and prepare for next node
        setShowChildren(false);

        // Set another timeout to move to the next node
        const nextNodeTimer = setTimeout(() => {
          setCurrentStepIdx(prev => {
            // Check if we're at the end
            const isLastStep = prev + 1 >= steps.length;
            
            if (isLastStep) {
              // Finish the animation after a delay
              setTimeout(() => {
                setIsRunning(false);
              }, 1000);
              return prev;
            }
            return prev + 1;
          });
          setShowChildren(true);
        }, 1000); // Delay before moving to next node

        return () => clearTimeout(nextNodeTimer);
      }
    }, 1500); // Delay after showing children

    return () => clearTimeout(timer);
  }, [currentStepIdx, showChildren, steps, isPaused, isRunning]);

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  const handleClearGraph = () => {
    setNodes([]);
    setEdges([]);
    setNextId(1);
    setSteps([]);
    setCurrentStepIdx(0);
    setSelectedNodeId(undefined);
    if (typeof setSecondNodeId === 'function') {
      setSecondNodeId(null);
    }
    if (typeof setPathResults === 'function') {
      setPathResults(null);
    }
    if (typeof setShowComponents === 'function') {
      setShowComponents(false);
    }
    if (typeof setComponentSteps === 'function') {
      setComponentSteps([]);
    }
  };
  
  return (
    <div>
      {isDev && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '8px',
          marginBottom: '10px',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Test Controls</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleLoadTestGraph}
              style={{ 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Load Test Graph
            </button>
            <button 
              onClick={handleClearGraph}
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete Graph
            </button>
          </div>
        </div>
      )}
      
      {/* Graph creation controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "10px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "10px"
        }}
      >
        <button onClick={handleAddNode} disabled={isRunning}>
          ➕ Add Node
        </button>
      </div>
      
      {/* Function selection and execution */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "10px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <label style={{ marginRight: "5px", fontWeight: "bold" }}>Function:</label>
          <select 
            value={selectedFunction} 
            onChange={(e) => {
              setSelectedFunction(e.target.value);
              // Reset to first algorithm of the selected function
              setSelectedAlgorithm(graphAlgorithms[e.target.value][0].id);
            }}
            disabled={isRunning}
          >
            {graphFunctions.map(func => (
              <option key={func.id} value={func.id}>{func.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ marginRight: "5px", fontWeight: "bold" }}>Algorithm:</label>
          <select 
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isRunning}
          >
            {graphAlgorithms[selectedFunction].map(algo => (
              <option key={algo.id} value={algo.id}>{algo.label}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={runGraphFunction} 
          disabled={isRunning || nodes.length < 2}
          style={{ backgroundColor: "#3b82f6", color: "white", padding: "5px 10px", borderRadius: "4px" }}
        >
          ▶ Run
        </button>
      </div>
      
      {/* Visualization controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "10px",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "10px"
        }}
      >
        <button 
          onClick={() => setIsPaused(!isPaused)}
          disabled={!isRunning || steps.length === 0}
        >
          {isPaused ? "▶ Resume" : "⏸️ Pause"}
        </button>
        <button
          onClick={handleNextStep}
          disabled={!isRunning || (!isPaused && steps.length > 0)}
        >
          ⏭️ Next Step
        </button>
        {steps.length > 0 && currentStepIdx < steps.length && (
          <span style={{ marginLeft: "10px" }}>
            Step: {currentStepIdx + 1}/{steps.length}
          </span>
        )}
        {selectedFunction === "shortestPath" && startNodeId && endNodeId && (
          <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
            Path: {startNodeId} → {endNodeId}
          </span>
        )}
      </div>

      {/* Algorithm visualization displays */}
      {steps.length > 0 && currentStepIdx < steps.length && (
        <div className="algorithm-visualization">
          <AlgorithmTrace 
            currentStep={steps[currentStepIdx]}
            startNode={startNodeId}
            endNode={endNodeId}
            path={path}
            isCompleted={!isRunning && path.length > 0}
            functionType={selectedFunction}
            result={result}
          />
          <QueueDisplay
            queue={steps[currentStepIdx].queue || []}
            newAdditions={steps[currentStepIdx].newAdditions}
            functionType={selectedFunction}
            currentStep={steps[currentStepIdx]}
            result={result}
          />
        </div>
      )}

      <div className="graph-canvas">
        {edges.map((edge, i) => {
          const nodeA = getNodeById(edge.a);
          const nodeB = getNodeById(edge.b);
          if (!nodeA || !nodeB) return null;

          const x1 = nodeA.x;
          const y1 = nodeA.y;
          const x2 = nodeB.x;
          const y2 = nodeB.y;

          const length = Math.hypot(x2 - x1, y2 - y1);
          const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

          // Check if this edge is part of the shortest path
          const isPathEdge = path.length > 1 && path.some((nodeId, index) => {
            if (index === path.length - 1) return false;
            const currentId = path[index];
            const nextId = path[index + 1];
            return (edge.a === currentId && edge.b === nextId) || 
                   (!isDirected && edge.a === nextId && edge.b === currentId);
          });
          
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: `${x1}px`,
                  top: `${y1}px`,
                  width: `${length}px`,
                  height: isPathEdge ? "4px" : "2px",
                  background: isPathEdge ? "#22c55e" : "#9ca3af",
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 0",
                  zIndex: 0,
                  boxShadow: isPathEdge ? "0 0 10px rgba(34, 197, 94, 0.6)" : "none",
                }}
              />
            </React.Fragment>
          );
        })}

        {nodes.map((node) => {
          let isCurrent = false;
          let isChild = false;
          let isStart = node.id === startNodeId;
          let isEnd = node.id === endNodeId;
          let isPathNode = path.includes(node.id);
          let componentIndex = -1;

          if (steps.length > 0 && currentStepIdx < steps.length) {
            const step = steps[currentStepIdx];
            
            if (selectedFunction === "shortestPath") {
              isCurrent = step?.current === node.id;
              isChild = showChildren && step?.children?.includes?.(node.id);
            } 
            else if (selectedFunction === "countComponents") {
              // For component visualization, check which component this node belongs to
              if (result && result.nodes) {
                for (let i = 0; i < result.nodes.length; i++) {
                  if (result.nodes[i].includes(node.id)) {
                    componentIndex = i;
                    break;
                  }
                }
              }
              
              // If current step shows this node as visited
              isCurrent = step?.current === node.id;
              isChild = step?.visitedInComponent?.has(node.id);
            }
          }

          // Determine node type
          let nodeType = null;
          
          if (selectedFunction === "shortestPath") {
            if (isStart) nodeType = "start-node";
            else if (isEnd) nodeType = "end-node";
            else if (isCurrent) nodeType = "current-node";
            else if (isChild) nodeType = "child-node";
            else if (isPathNode) nodeType = "path-node";
          } 
          else if (selectedFunction === "countComponents") {
            if (isCurrent) nodeType = "current-node";
            else if (componentIndex >= 0) nodeType = `component-${componentIndex % 5}`; // Cycle through 5 colors
          }

          return (
            <Node
              key={node.id}
              id={node.id}
              x={node.x}
              y={node.y}
              onClick={handleNodeClick}
              onDrag={handleNodeDrag}
              isSelected={node.id === selectedNodeId}
              isHighlighted={(isCurrent || isChild) && isRunning}
              nodeType={nodeType}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GraphCanvas;
