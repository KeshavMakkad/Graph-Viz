import React, { useState, useEffect } from "react";
import Node from "./../components/Node";
import { BFS } from "../algorithms/BFS";
import { DFS } from "../algorithms/DFS";
import { useLocation } from "react-router-dom";
import "./../styles/pages/GraphCanvas.css";
import { getTestGraph, getDirectedTestGraph } from "../utils/testGraph";

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
      { id: "bfs", label: "Breadth-First Search (BFS)" },
      { id: "dfs", label: "Depth-First Search (DFS)" }
    ]
  };

  // Function and algorithm state
  const [selectedFunction, setSelectedFunction] = useState("shortestPath");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bfs");
  const [result, setResult] = useState(null); // For storing results like component count

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Add the missing deleteMode state
  const [deleteMode, setDeleteMode] = useState(false);

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

  // Add state to track which sections are visible
  const [visibleSections, setVisibleSections] = useState({
    graphControls: true,
    algorithmControls: true,
    playbackControls: true,
    algorithmAnalysis: true
  });
  
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
  
  // Handler to load directed test graph
  const handleLoadDirectedTestGraph = () => {
    const { nodes: testNodes, edges: testEdges } = getDirectedTestGraph();
    setNodes(testNodes);
    setEdges(testEdges);
    // Set nextId to be one more than the highest node id
    const maxId = Math.max(...testNodes.map(node => node.id));
    setNextId(maxId + 1);
    
    // Make sure we're in directed mode
    const graphTypeParts = graphType.split("-");
    if (graphTypeParts[1] !== "directed") {
      // Update to appropriate directed mode
      setGraphType(`${graphTypeParts[0]}-directed`);
    }
  };
  
  const handleAddNode = () => {
    const x = 100 + Math.random() * 400;
    const y = 100 + Math.random() * 400;
    setNodes([...nodes, { id: nextId, x, y }]);
    setNextId(nextId + 1);
  };

  const handleNodeClick = (id) => {
    // If in delete mode, delete the node
    if (deleteMode) {
      // Remove the node
      setNodes(nodes.filter(node => node.id !== id));
      // Remove any edges connected to this node
      setEdges(edges.filter(edge => edge.a !== id && edge.b !== id));
      return;
    }
    
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

  const runComponentsFunction = (algorithm, graph) => {
    // Run the connected components algorithm
    setTimeout(() => {
      const componentsResult = graph.countComponents();
      setResult(componentsResult);
      
      // Get visualization steps based on selected algorithm
      let visualResult;
      if (algorithm === "dfs") {
        visualResult = graph.dfsComponentsWithVisualization();
      } else {
        visualResult = graph.bfsComponentsWithVisualization();
      }
      
      setSteps(visualResult.steps);
      setCurrentStepIdx(0);
      setShowChildren(true);
      setIsPaused(false);
    }, 100);
  };

  // Update the runGraphFunction to use the combined method
  const runGraphFunction = () => {
    // Reset previous results
    setSteps([]);
    setCurrentStepIdx(0);
    setShowChildren(false);
    setPath([]);
    setResult(null);
    setIsRunning(true);
    
    // Select the appropriate algorithm
    if (selectedAlgorithm === "bfs") {
      const bfs = new BFS(nodes, edges, isDirected);
      
      // Execute the appropriate function based on selection
      if (selectedFunction === "shortestPath") {
        runShortestPathFunction(bfs);
      } else if (selectedFunction === "countComponents") {
        runComponentsFunction("bfs", bfs);
      }
    } else if (selectedAlgorithm === "dfs") {
      const dfs = new DFS(nodes, edges, isDirected);
      
      // DFS can only do components visualization currently
      if (selectedFunction === "countComponents") {
        runComponentsFunction("dfs", dfs);
      } else {
        alert("DFS is not implemented for this function.");
        setIsRunning(false);
      }
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
  
  // Update runCountComponentsFunction to use BFS properly
  const runCountComponentsFunction = (bfs) => {
    // Run the connected components algorithm
    setTimeout(() => {
      const componentsResult = bfs.countComponents();
      setResult(componentsResult);
      
      // Get visualization steps for component discovery with BFS
      const visualResult = bfs.bfsComponentsWithVisualization();
      setSteps(visualResult.steps);
      setCurrentStepIdx(0);
      setShowChildren(true);
      setIsPaused(false);
    }, 100);
  };
  
  // Add this new function for DFS components visualization
  const runDFSComponentsFunction = (dfs) => {
    // Run the connected components algorithm
    setTimeout(() => {
      const componentsResult = dfs.countComponents();
      setResult(componentsResult);
      
      // Get visualization steps for component discovery
      const visualResult = dfs.dfsComponentsWithVisualization();
      
      // Keep all steps for proper visualization
      setSteps(visualResult.steps);
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
  
  // Toggle section visibility handler
  const toggleSectionVisibility = (section) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    // When enabling delete mode, deselect any selected node
    if (!deleteMode) {
      setSelectedNodeId(undefined);
    }
  };

  return (
    <div className={`graph-page-container ${deleteMode ? 'delete-mode' : ''}`}>
      {isDev && (
        <div className="dev-controls">
          <div className="dev-header">Test Controls</div>
          <div className="dev-buttons">
            <button onClick={handleLoadTestGraph} className="dev-btn load-btn">
              Load Undirected Graph
            </button>
            <button onClick={handleLoadDirectedTestGraph} className="dev-btn load-directed-btn">
              Load Directed Graph
            </button>
            <button onClick={handleClearGraph} className="dev-btn clear-btn">
              Delete Graph
            </button>
          </div>
        </div>
      )}
      
      <div className="graph-layout">
        {/* Main Graph Canvas */}
        <div className="graph-main-panel">
          <div className="graph-canvas">
            {edges.map((edge, i) => {
              const nodeA = getNodeById(edge.a);
              const nodeB = getNodeById(edge.b);
              if (!nodeA || !nodeB) return null;

              const x1 = nodeA.x;
              const y1 = nodeA.y;
              const x2 = nodeB.x;
              const y2 = nodeB.y;

              // Calculate the edge length and angle
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
              
              // Calculate indicator position with better centering
              const nodeRadius = 25; // Half of node width
              const indicatorOffset = nodeRadius + 5; // Add 5px extra space
              const totalLength = Math.hypot(x2 - x1, y2 - y1);
              const indicatorPosition = 1 - (indicatorOffset / totalLength);

              // Calculate exact position on the line
              const cosAngle = (x2 - x1) / totalLength;
              const sinAngle = (y2 - y1) / totalLength;
              const indicatorX = x1 + (totalLength - indicatorOffset) * cosAngle;
              const indicatorY = y1 + (totalLength - indicatorOffset) * sinAngle;
              
              return (
                <React.Fragment key={i}>
                  {/* Main edge line */}
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
                  
                  {/* Single direction indicator for directed graphs */}
                  {isDirected && (
                    <div 
                      className={`edge-arrow ${isPathEdge ? 'path-edge' : ''}`}
                      style={{
                        position: "absolute",
                        left: `${indicatorX}px`,
                        top: `${indicatorY}px`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`, // Center using translate
                      }}
                    />
                  )}
                  
                  {/* Weight label if needed */}
                  {isWeighted && edge.weight !== undefined && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${x1 + (x2 - x1) * 0.5}px`,
                        top: `${y1 + (y2 - y1) * 0.5}px`,
                        background: "white",
                        padding: "2px 5px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        zIndex: 1,
                      }}
                    >
                      {edge.weight}
                    </div>
                  )}
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
                  
                  // If current step shows this node as current
                  isCurrent = step?.current === node.id;
                  
                  // For DFS, highlight nodes in the stack as children
                  if (selectedAlgorithm === "dfs") {
                    isChild = step?.stack?.includes(node.id) || step?.children?.includes(node.id);
                  } else {
                    // For BFS, use the existing logic
                    isChild = step?.visitedInComponent?.has(node.id);
                  }
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
        
        {/* Control Panel & Algorithm Analysis */}
        <div className="control-panel">
          {/* Graph Controls Section */}
          <div className="panel-section">
            <div className="panel-header with-toggle">
              <h2>Graph Controls</h2>
              <button 
                className="toggle-button" 
                onClick={() => toggleSectionVisibility('graphControls')}
              >
                {visibleSections.graphControls ? '−' : '+'}
              </button>
            </div>
            
            {visibleSections.graphControls && (
              <div className="control-group">
                <button onClick={handleAddNode} disabled={isRunning || deleteMode} className="control-btn">
                  ➕ Add Node
                </button>
                <button 
                  onClick={toggleDeleteMode} 
                  disabled={isRunning} 
                  className={`control-btn ${deleteMode ? 'active-mode' : ''}`}
                >
                  {deleteMode ? '✓ Delete Mode' : '🗑️ Delete Node'}
                </button>
                <button onClick={handleClearGraph} disabled={isRunning} className="control-btn clear-btn">
                  🗑️ Clear Graph
                </button>
              </div>
            )}
          </div>
          
          {/* Algorithm Controls Section */}
          <div className="panel-section">
            <div className="panel-header with-toggle">
              <h2>Algorithm</h2>
              <button 
                className="toggle-button" 
                onClick={() => toggleSectionVisibility('algorithmControls')}
              >
                {visibleSections.algorithmControls ? '−' : '+'}
              </button>
            </div>
            
            {visibleSections.algorithmControls && (
              <div className="control-form">
                <div className="form-row">
                  <label>Function:</label>
                  <select 
                    value={selectedFunction} 
                    onChange={(e) => {
                      setSelectedFunction(e.target.value);
                      setSelectedAlgorithm(graphAlgorithms[e.target.value][0].id);
                    }}
                    disabled={isRunning}
                  >
                    {graphFunctions.map(func => (
                      <option key={func.id} value={func.id}>{func.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <label>Method:</label>
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
                  className="run-btn"
                >
                  ▶ Run Algorithm
                </button>
              </div>
            )}
          </div>
          
          {/* Visualization Controls */}
          {isRunning && (
            <div className="panel-section">
              <div className="panel-header with-toggle">
                <h2>Playback Controls</h2>
                <button 
                  className="toggle-button" 
                  onClick={() => toggleSectionVisibility('playbackControls')}
                >
                  {visibleSections.playbackControls ? '−' : '+'}
                </button>
              </div>
              
              {visibleSections.playbackControls && (
                <>
                  <div className="playback-controls">
                    <button 
                      onClick={() => setIsPaused(!isPaused)}
                      disabled={!isRunning || steps.length === 0}
                      className={`control-btn ${isPaused ? "resume-btn" : "pause-btn"}`}
                    >
                      {isPaused ? "▶ Resume" : "⏸️ Pause"}
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!isRunning || (!isPaused && steps.length > 0)}
                      className="control-btn next-btn"
                    >
                      ⏭️ Next Step
                    </button>
                  </div>
                  
                  {steps.length > 0 && currentStepIdx < steps.length && (
                    <div className="step-info">
                      <div className="step-counter">
                        Step: {currentStepIdx + 1}/{steps.length}
                      </div>
                      {selectedFunction === "shortestPath" && startNodeId && endNodeId && (
                        <div className="path-info">
                          Path: {startNodeId} → {endNodeId}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Algorithm Analysis Section */}
          <div className="panel-section algorithm-section">
            <div className="panel-header with-toggle">
              <h2>Algorithm Analysis</h2>
              <button 
                className="toggle-button" 
                onClick={() => toggleSectionVisibility('algorithmAnalysis')}
              >
                {visibleSections.algorithmAnalysis ? '−' : '+'}
              </button>
            </div>
            
            {visibleSections.algorithmAnalysis && (
              steps.length > 0 && currentStepIdx < steps.length ? (
                <>
                  <AlgorithmTrace 
                    currentStep={steps[currentStepIdx]}
                    startNode={startNodeId}
                    endNode={endNodeId}
                    path={path}
                    isCompleted={!isRunning && path.length > 0}
                    functionType={selectedFunction}
                    result={result}
                    algorithm={selectedAlgorithm}
                  />
                  
                  <QueueDisplay
                    queue={steps[currentStepIdx].queue || []}
                    newAdditions={steps[currentStepIdx].newAdditions}
                    functionType={selectedFunction}
                    currentStep={steps[currentStepIdx]}
                    result={result}
                    algorithm={selectedAlgorithm}
                  />
                </>
              ) : (
                <div className="no-algorithm-state">
                  <div className="empty-state-message">
                    <p>Select a function and algorithm, then click "Run" to visualize.</p>
                    <p>You can:</p>
                    <ul>
                      <li>Find shortest paths between nodes</li>
                      <li>Analyze connected components</li>
                    </ul>
                    <p>First, create a graph by adding nodes and connecting them.</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlgorithmTrace = ({ currentStep, startNode, endNode, path, isCompleted, functionType, result, algorithm }) => {
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
    const { current, component, componentIndex, type } = currentStep;
    
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
          <strong>Algorithm:</strong> {algorithm === "dfs" ? "Depth-First Search" : "Breadth-First Search"}
        </div>
        
        <div className="trace-step">
          <strong>Current Action:</strong> {
            type === 'start-component' ? 'Starting new component' :
            type === 'visit' ? `Visiting node ${current}` :
            type === 'stack-update' ? 'Adding neighbors to stack' :
            type === 'backtrack' ? 'Backtracking' :
            type === 'complete-component' ? 'Component complete' : 'Initializing'
          }
        </div>
        
        <div className="trace-step">
          <strong>Current Node:</strong> {current || 'None'}
        </div>
        
        <div className="trace-step">
          <strong>Component:</strong> {component || 'None'} 
          {result && result.count ? ` of ${result.count}` : ''}
        </div>
        
      </div>
    );
  }
  
  return null;
};

const QueueDisplay = ({ queue, newAdditions, functionType, currentStep, result, algorithm }) => {
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
    const { component, visitedInComponent, stack, current, children } = currentStep || {};
    
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
        
        {/* Stack display for DFS with animations */}
        {algorithm === "dfs" && (
          <div className="stack-display">
            <h4>DFS Stack</h4>
            <div className="stack-container">
              {(!stack || stack.length === 0) ? (
                <div className="stack-empty">Stack Empty</div>
              ) : (
                <div className="stack-items">
                  {stack.map((nodeId, index) => (
                    <div
                      key={`stack-${nodeId}-${index}`}
                      className={`stack-item ${index === stack.length - 1 ? 'top-of-stack' : ''}`}
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {nodeId}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Queue display for BFS with animations */}
        {algorithm === "bfs" && (
          <div className="queue-display">
            <h4>BFS Queue</h4>
            <div className="queue-container">
              {(!currentStep.queue || currentStep.queue.length === 0) ? (
                <div className="queue-empty">Queue Empty</div>
              ) : (
                <div className="queue-items">
                  {currentStep.queue.map((nodeId, index) => {
                    // Determine appropriate class names
                    const isFirst = index === 0;
                    const isNewlyAdded = currentStep.newAdditions?.includes(nodeId);
                    
                    return (
                      <div
                        key={`queue-${nodeId}-${index}-${currentStep.component}`}
                        className={`queue-item ${isFirst ? 'front-of-queue' : ''} ${isNewlyAdded ? 'newly-added' : ''}`}
                      >
                        {nodeId}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Always show the children display container, with placeholder when empty */}
        <div className="children-display">
          <h4>Unvisited Neighbors Added</h4>
          <div className="children-container">
            {!children || children.length === 0 ? (
              <div className="children-empty">No neighbors being added in this step</div>
            ) : (
              children.map((nodeId, index) => (
                <div
                  key={`child-${nodeId}-${index}`}
                  className="child-item animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.15}s`
                  }}
                >
                  {nodeId}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="component-nodes">
          {result?.nodes && component && (
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

export default GraphCanvas;