import React, { useState, useEffect } from "react";
import Node from "./../components/Node";
import { BFS } from "../algorithms/BFS";
import { DFS } from "../algorithms/DFS";
import { TopoSort } from "../algorithms/TopoSort"; // Add this import
import { useLocation, Link } from "react-router-dom";
import "./../styles/pages/GraphCanvas.css";
import { getTestGraph, getDirectedTestGraph, getTopoSortTestGraph, getTopoSortCyclicTestGraph } from "../utils/testGraph";
import { getRandomGraph } from "../utils/loadGraph";

const GraphCanvas = () => {
  const location = useLocation();
  const name = location.state?.name || "Untitled";
  const graphType = location.state?.type || "unweighted-undirected";
  const [weightType, directionType] = graphType.split("-");
  const isWeighted = weightType === "weighted";
  const isDirected = directionType === "directed";

  // Update available function types - will filter based on graph type
  const getAvailableFunctions = (isDirected) => {
    const functions = [
      { id: "shortestPath", label: "Find Shortest Path" },
      { id: "countComponents", label: "Count Connected Components" }
    ];
    
    // Only add topological sort for directed graphs
    if (isDirected) {
      functions.push({ id: "topoSort", label: "Topological Sort" });
    }
    
    return functions;
  };

  // Use dynamic functions based on graph type
  const graphFunctions = getAvailableFunctions(isDirected);
  
  // Update function when graph type changes
  useEffect(() => {
    const availableFunctions = getAvailableFunctions(isDirected);
    
    // If current function is topoSort but graph is now undirected, reset to a valid function
    if (selectedFunction === "topoSort" && !isDirected) {
      setSelectedFunction("shortestPath");
      setSelectedAlgorithm("bfs");
    }
  }, [isDirected]);

  // Update available algorithm types
  const graphAlgorithms = {
    "shortestPath": [
      { id: "bfs", label: "Breadth-First Search (BFS)" }
    ],
    "countComponents": [
      { id: "bfs", label: "Breadth-First Search (BFS)" },
      { id: "dfs", label: "Depth-First Search (DFS)" }
    ],
    "topoSort": [
      { id: "khan", label: "Khan's Algorithm" }  // Changed from DFS to Khan's Algorithm
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
  
  // Add state for cycle detection
  const [hasCycle, setHasCycle] = useState(false);
  const [cycles, setCycles] = useState([]);
  const [topoOrder, setTopoOrder] = useState([]);

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
  
  // Add handler for the new test graphs
  const handleLoadTopoSortTestGraph = () => {
    const { nodes: testNodes, edges: testEdges } = getTopoSortTestGraph();
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

  const handleLoadTopoSortCyclicTestGraph = () => {
    const { nodes: testNodes, edges: testEdges } = getTopoSortCyclicTestGraph();
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

  // Add function to run topological sort
  const runTopoSortFunction = (topoSort) => {
    setTimeout(() => {
      const result = topoSort.topoSortWithVisualization();
      
      setSteps(result.steps);
      setCurrentStepIdx(0);
      setShowChildren(true);
      setIsPaused(false);
      setHasCycle(result.hasCycle);
      setCycles(result.cycles);
      setTopoOrder(result.order);
      setResult({
        order: result.order,
        hasCycle: result.hasCycle,
        cycles: result.cycles
      });
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
    setHasCycle(false);
    setCycles([]);
    setTopoOrder([]);
    
    // Select the appropriate algorithm
    if (selectedFunction === "topoSort") {
      // For topological sort, validate that the graph is directed
      if (!isDirected) {
        alert("Topological sort requires a directed graph. Please switch to directed mode.");
        setIsRunning(false);
        return;
      }
      
      const topoSort = new TopoSort(nodes, edges);
      runTopoSortFunction(topoSort);
    }
    else if (selectedAlgorithm === "bfs") {
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

  // Add this handler function for loading a random graph
  const handleLoadRandomGraph = () => {
    // Get random graph based on current direction type
    const randomGraph = getRandomGraph(directionType);
    
    // Update the graph state
    setNodes(randomGraph.nodes);
    setEdges(randomGraph.edges);
    
    // Set nextId to be one more than the highest node id
    const maxId = Math.max(...randomGraph.nodes.map(node => node.id));
    setNextId(maxId + 1);
  };

  return (
    <div className={`graph-page-container ${deleteMode ? 'delete-mode' : ''}`}>
      {/* Add Graph Info Header */}
      <div className="graph-info-header">
        <div className="graph-title-section">
          <h1 className="graph-title">{name}</h1>
          <span className="graph-type-badge">
            {isWeighted ? "Weighted" : "Unweighted"} {isDirected ? "Directed" : "Undirected"} Graph
          </span>
        </div>
        <div className="graph-actions">
          <Link to="/docs" className="docs-link">Algorithm Docs</Link>
          <div className="graph-stats">
            <div className="stat-item">
              <span className="stat-value">{nodes.length}</span>
              <span className="stat-label">Nodes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{edges.length}</span>
              <span className="stat-label">Edges</span>
            </div>
          </div>
        </div>
      </div>
      
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
            <button onClick={handleLoadTopoSortTestGraph} className="dev-btn load-topo-btn">
              Load DAG
            </button>
            <button onClick={handleLoadTopoSortCyclicTestGraph} className="dev-btn load-topo-cyclic-btn">
              Load Cyclic Graph
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
              let isCycleNode = false;
              let isZeroIndegree = false;
              let isProcessed = false;

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
                else if (selectedFunction === "topoSort") {
                  // Current node being processed in Khan's algorithm
                  isCurrent = step?.current === node.id;
                  
                  // Nodes in the queue are nodes with zero in-degree
                  isZeroIndegree = step?.queue?.includes(node.id);
                  
                  // Nodes already added to the topological order
                  isProcessed = step?.order?.includes(node.id);
                  
                  // Nodes part of a cycle
                  isCycleNode = step?.cycleNodes?.has(node.id);
                  
                  // Nodes whose in-degree is being updated are considered children
                  isChild = showChildren && step?.neighbors?.includes(node.id);
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
              else if (selectedFunction === "topoSort") {
                if (isCurrent) nodeType = "current-node";
                else if (isCycleNode) nodeType = "cycle-node";
                else if (isZeroIndegree) nodeType = "zero-indegree-node";
                else if (isProcessed) nodeType = "processed-node";
                else if (isChild) nodeType = "child-node";
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
                <button onClick={handleLoadRandomGraph} disabled={isRunning} className="control-btn load-random-btn">
                  🎲 Load Random Graph
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
        <div className="trace-header">
          <h3>Shortest Path Analysis</h3>
          {isCompleted && path.length > 0 && (
            <div className="success-badge">Path Found</div>
          )}
        </div>
        
        {isCompleted && path.length > 0 && (
          <div className="trace-path">
            <div className="path-display">
              <span className="path-label">Path:</span>
              <span className="path-nodes">{path.join(" → ")}</span>
            </div>
            <div className="trace-path-length">
              <span className="length-label">Length:</span>
              <span className="length-value">{path.length - 1} edge(s)</span>
            </div>
          </div>
        )}
        
        <div className="trace-details">
          <div className="trace-detail-row">
            <div className="detail-label">Start:</div>
            <div className="detail-value highlight-start">{startNode}</div>
            <div className="detail-label">End:</div>
            <div className="detail-value highlight-end">{endNode}</div>
          </div>
          
          <div className="trace-detail-row">
            <div className="detail-label">Current Node:</div>
            <div className="detail-value highlight-current">
              {current} {isEnd ? <span className="destination-reached">(Destination Reached!)</span> : ""}
            </div>
          </div>
          
          <div className="trace-detail-row">
            <div className="detail-label">Neighbors:</div>
            <div className="detail-value">
              {children?.length > 0 ? children.join(", ") : "None"}
            </div>
          </div>
        </div>
      </div>
    );
  } 
  else if (functionType === "countComponents") {
    const { current, component, componentIndex, type } = currentStep;
    
    return (
      <div className="algorithm-trace">
        <div className="trace-header">
          <h3>Connected Components Analysis</h3>
          {result && (
            <div className="success-badge">{result.count} Components</div>
          )}
        </div>
        
        {result && (
          <div className="trace-result">
            <div className="result-grid">
              {result.nodes.map((componentNodes, idx) => (
                <div key={idx} className={`component-item component-${idx % 5}`}>
                  <div className={`component-badge component-${idx % 5}`}>
                    Component {idx + 1}
                  </div>
                  <div className="component-info">
                    <span className="component-count">{componentNodes.length}</span> node(s)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="trace-details">
          <div className="trace-detail-row">
            <div className="detail-label">Algorithm:</div>
            <div className="detail-value">
              {algorithm === "dfs" ? "Depth-First Search" : "Breadth-First Search"}
            </div>
          </div>
          
          <div className="trace-detail-row">
            <div className="detail-label">Action:</div>
            <div className="detail-value">
              {type === 'start-component' ? 'Starting new component' :
               type === 'visit' ? `Visiting node ${current}` :
               type === 'stack-update' ? 'Adding neighbors to stack' :
               type === 'backtrack' ? 'Backtracking' :
               type === 'complete-component' ? 'Component complete' : 'Initializing'}
            </div>
          </div>
          
          <div className="trace-detail-row">
            <div className="detail-label">Current Node:</div>
            <div className="detail-value highlight-current">{current || 'None'}</div>
          </div>
          
          <div className="trace-detail-row">
            <div className="detail-label">Current Component:</div>
            <div className="detail-value highlight-component-index">{component || 'None'}</div>
          </div>
        </div>
      </div>
    );
  }
  else if (functionType === "topoSort") {
    const { current, order, hasCycle, cycles, cycleNodes, type, isPartial } = currentStep;
    
    return (
      <div className="algorithm-trace">
        <div className="trace-header">
          <h3>Topological Sort Analysis</h3>
          {hasCycle ? (
            <div className="warning-badge">Cycles Detected</div>
          ) : (
            <div className="success-badge">Valid DAG</div>
          )}
        </div>
        
        {hasCycle && (
          <div className="trace-warning">
            <div className="warning-title">
              <span className="warning-icon">⚠️</span>
              Graph contains cycles!
            </div>
            <div className="warning-info">
              Topological sorting requires a Directed Acyclic Graph (DAG).
            </div>
            {cycles && cycles.length > 0 && (
              <div className="cycle-info">
                <div className="cycle-info-title">Cycles detected:</div>
                <div className="cycle-list">
                  {cycles.map((cycle, idx) => (
                    <div key={idx} className="cycle-item">
                      {cycle.join(" → ")}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="trace-details">
          <div className="trace-detail-row">
            <div className="detail-label">Current Action:</div>
            <div className="detail-value">
              {type === 'init' ? 'Initializing topological sort' :
               type === 'process' ? `Processing node ${current} (in-degree = 0)` :
               type === 'update-degrees' ? `Updating in-degrees after processing ${current}` :
               type === 'complete' ? 'Topological sort complete' : 'Processing'}
            </div>
          </div>
          
          <div className="trace-detail-row">
            <div className="detail-label">Current Node:</div>
            <div className="detail-value highlight-current">{current || 'None'}</div>
          </div>
        </div>
        
        {order && order.length > 0 && (
          <div className="topo-order-result">
            <div className="order-title">Topological Order:</div>
            <div className="order-nodes">
              {order.join(" → ")}
            </div>
            {isPartial && (
              <div className="partial-warning">
                (Partial order due to cycles)
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

const QueueDisplay = ({ queue, newAdditions, functionType, currentStep, result, algorithm }) => {
  if (functionType === "shortestPath") {
    return (
      <div className="data-structure-display">
        <div className="display-header">
          <h3>BFS Queue</h3>
          <div className="display-badge">{queue ? queue.length : 0} items</div>
        </div>
        <div className="queue-container">
          {!queue || queue.length === 0 ? (
            <div className="queue-empty">Queue Empty</div>
          ) : (
            <div className="queue-items">
              {queue.map((nodeId, index) => (
                <div
                  key={`queue-${nodeId}-${index}`}
                  className={`queue-item ${
                    newAdditions?.includes(nodeId) ? "newly-added" : ""
                  } ${index === 0 ? "front-of-queue" : ""}`}
                >
                  {nodeId}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } 
  else if (functionType === "countComponents") {
    const { component, visitedInComponent, stack, current, children, queue: currentQueue } = currentStep || {};
    
    return (
      <div className="data-structure-display">
      {/* Stack display for DFS with animations */}
      {algorithm === "dfs" ? (
        <div className="stack-display">
          <div className="display-header">
            <h3>DFS Stack</h3>
            <div className="display-badge">{stack ? stack.length : 0} items</div>
          </div>
          <div className="stack-container">
            {(!stack || stack.length === 0) ? (
              <div className="stack-empty">Stack Empty</div>
            ) : (
              <div className="stack-items">
                {stack.map((nodeId, index) => (
                  <div
                    key={`stack-${nodeId}-${index}`}
                    className={`stack-item ${index === stack.length - 1 ? 'top-of-stack' : ''}`}
                  >
                    {nodeId}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="queue-display">
          <div className="display-header">
            <h3>BFS Queue</h3>
            <div className="display-badge">{currentQueue ? currentQueue.length : 0} items</div>
          </div>
          <div className="queue-container">
            {(!currentQueue || currentQueue.length === 0) ? (
              <div className="queue-empty">Queue Empty</div>
            ) : (
              <div className="queue-items">
                {currentQueue.map((nodeId, index) => {
                  const isFirst = index === 0;
                  const isNewlyAdded = currentStep.newAdditions?.includes(nodeId);
                  
                  return (
                    <div
                      key={`queue-${nodeId}-${index}-${component}`}
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
      
      {/* Horizontal layout for unvisited neighbors */}
      <div className="children-display horizontal">
        <div className="display-header">
          <h3>Unvisited Neighbors</h3>
          <div className="display-badge">{children ? children.length : 0}</div>
        </div>
        <div className="children-container horizontal">
          {!children || children.length === 0 ? (
            <div className="children-empty">No neighbors being added</div>
          ) : (
            <div className="children-flex">
              {children.map((nodeId, index) => {
                const componentForNode = result && result.nodes ? 
                  result.nodes.findIndex(componentNodes => componentNodes.includes(nodeId)) : -1;
                
                return (
                  <div
                    key={`child-${nodeId}-${index}`}
                    className={`child-item animate-fade-in ${componentForNode >= 0 ? `component-${componentForNode % 5}` : ''}`}
                  >
                    {nodeId}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    );
  }
  else if (functionType === "topoSort") {
    const { queue, current, order, cycleNodes, inDegree, neighbors, newQueueAdditions } = currentStep || {};
    
    return (
      <div className="data-structure-display">
        {/* Zero in-degree queue display */}
        <div className="queue-display">
          <div className="display-header">
            <h3>Zero In-degree Queue</h3>
            <div className="display-badge">{queue ? queue.length : 0} nodes</div>
          </div>
          <div className="queue-container">
            {(!queue || queue.length === 0) ? (
              <div className="queue-empty">No nodes with zero in-degree</div>
            ) : (
              <div className="queue-items">
                {queue.map((nodeId, index) => {
                  const isNewlyAdded = newQueueAdditions?.includes(nodeId);
                  
                  return (
                    <div
                      key={`queue-${nodeId}-${index}`}
                      className={`queue-item ${index === 0 ? 'front-of-queue' : ''} 
                                   ${isNewlyAdded ? 'newly-added' : ''}`}
                    >
                      {nodeId}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* In-degree display */}
        <div className="indegree-display">
          <div className="display-header">
            <h3>In-degree Values</h3>
          </div>
          <div className="indegree-container">
            {!inDegree || inDegree.size === 0 ? (
              <div className="indegree-empty">No in-degree information</div>
            ) : (
              <div className="indegree-items">
                {Array.from(inDegree.entries()).map(([nodeId, degree]) => (
                  <div 
                    key={`indegree-${nodeId}`}
                    className={`indegree-item ${degree === 0 ? 'zero-degree' : ''} 
                               ${neighbors?.includes(Number(nodeId)) ? 'updated-degree' : ''}
                               ${cycleNodes?.has(Number(nodeId)) ? 'cycle-node' : ''}`}
                  >
                    <span className="node-id">{nodeId}</span>
                    <span className="degree-value">{degree}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Topological Order Display */}
        <div className="topo-order-display">
          <div className="display-header">
            <h3>Topological Order</h3>
            <div className="display-badge">{order ? order.length : 0}/{inDegree ? inDegree.size : 0}</div>
          </div>
          <div className="topo-container">
            {!order || order.length === 0 ? (
              <div className="topo-empty">No nodes ordered yet</div>
            ) : (
              <div className="topo-items">
                {order.map((nodeId, index) => (
                  <div
                    key={`topo-${nodeId}-${index}`}
                    className={`topo-item ${nodeId === current ? 'just-added' : ''} 
                               ${cycleNodes?.has(nodeId) ? 'cycle-node' : ''}`}
                  >
                    {nodeId}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default GraphCanvas;