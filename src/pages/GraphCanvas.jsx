import React, { useState, useEffect } from "react";
import Node from "./../components/Node";
import { BFS } from "../algorithms/BFS";
import { useLocation } from "react-router-dom";
import "./../styles/pages/GraphCanvas.css";

const AlgorithmTrace = ({ currentStep, startNode, endNode, path, isCompleted }) => {
  if (!currentStep) return null;

  const { current, children, queue, isEnd } = currentStep;

  return (
    <div className="algorithm-trace">
      <h3>BFS Algorithm Steps</h3>
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
        {children.length > 0 ? children.join(", ") : "None"}
      </div>
      <div className="trace-step">
        <strong>Queue Status:</strong>{" "}
        {queue.length > 0 ? queue.join(" → ") : "Empty"}
      </div>
    </div>
  );
};

const QueueDisplay = ({ queue, newAdditions }) => {
  return (
    <div className="queue-display">
      <h3>BFS Queue</h3>
      <div className="queue-container">
        {queue.length === 0 ? (
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
};

const GraphCanvas = () => {
  const location = useLocation();
  const name = location.state?.name || "Untitled";
  const graphType = location.state?.type || "unweighted-undirected";
  const [weightType, directionType] = graphType.split("-");
  const isWeighted = weightType === "weighted";
  const isDirected = directionType === "directed";

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

  const runBfs = () => {
    // Prompt for start node
    let startNode = prompt("Enter start node ID:", selectedNodeId || "");
    if (!startNode || isNaN(startNode)) {
      alert("Please enter a valid start node ID.");
      return;
    }
    startNode = Number(startNode);
    
    // Check if the start node exists
    if (!nodes.some(node => node.id === startNode)) {
      alert(`Node ${startNode} does not exist.`);
      return;
    }
    
    // Prompt for end node
    let endNode = prompt("Enter end node ID:", "");
    if (!endNode || isNaN(endNode)) {
      alert("Please enter a valid end node ID.");
      return;
    }
    endNode = Number(endNode);
    
    // Check if the end node exists and is different from the start
    if (!nodes.some(node => node.id === endNode)) {
      alert(`Node ${endNode} does not exist.`);
      return;
    }
    
    if (startNode === endNode) {
      alert("Start and end nodes must be different.");
      return;
    }
    
    // Set start and end nodes
    setStartNodeId(startNode);
    setEndNodeId(endNode);
    
    // Reset visualization state first
    setSteps([]);
    setCurrentStepIdx(0);
    setShowChildren(false);
    setPath([]);
    setIsRunning(true);

    // Small delay before starting to ensure clean slate
    setTimeout(() => {
      const bfs = new BFS(nodes, edges, isDirected);
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "10px",
        }}
      >
        <button onClick={handleAddNode} disabled={isRunning}>
          ➕ Add Node
        </button>
        <button onClick={runBfs} disabled={isRunning || nodes.length < 2}>
          🔍 Find Shortest Path (BFS)
        </button>
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
        {startNodeId && endNodeId && (
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
          />
          <QueueDisplay
            queue={steps[currentStepIdx].queue || []}
            newAdditions={steps[currentStepIdx].newAdditions}
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

          if (steps.length > 0 && currentStepIdx < steps.length) {
            const step = steps[currentStepIdx];
            isCurrent = step?.current === node.id;
            isChild = showChildren && step?.children?.includes?.(node.id);
          }

          // Determine node type
          let nodeType = null;
          if (isStart) nodeType = "start-node";
          else if (isEnd) nodeType = "end-node";
          else if (isCurrent) nodeType = "current-node";
          else if (isChild) nodeType = "child-node";
          else if (isPathNode) nodeType = "path-node";

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
