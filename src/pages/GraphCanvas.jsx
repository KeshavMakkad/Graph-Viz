import React, { useState } from "react";
import Node from "./../components/Node";
import { BFS } from "../algorithms/BFS";
import { useLocation } from "react-router-dom";
import "./../styles/pages/GraphCanvas.css";

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
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddNode = () => {
    const x = 100 + Math.random() * 400;
    const y = 100 + Math.random() * 400;
    setNodes([...nodes, { id: nextId, x, y }]);
    setNextId(nextId + 1);
  };

  const handleNodeClick = (id) => {
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
    if (selectedNodeId === undefined) {
      alert("Select a starting node.");
      return;
    }
    const bfs = new BFS(nodes, edges, isDirected);
    const s = bfs.bfsWithSteps(selectedNodeId);
    setSteps(s);
    setCurrentStepIdx(0);
  };

  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handlePlayAll = () => {
    if (steps.length <= 0) return;

    setIsPlaying(true);
    let idx = currentStepIdx;

    const interval = setInterval(() => {
      if (idx >= steps.length - 1) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        idx++;
        setCurrentStepIdx(idx);
      }
    }, 500);
  };

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px" }}>
        <button onClick={handleAddNode}>
          ➕ Add Node
        </button>
        <button onClick={runBfs}>
          ▶ Run BFS
        </button>
        <button onClick={handlePreviousStep}>
          Prev
        </button>
        <button onClick={handleNextStep}>
          Next
        </button>
        <button onClick={handlePlayAll}>
          Play All
        </button>
      </div>

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

          return (
            <React.Fragment key={i}>
              <div
                style={{ position:'absolute',
                   left: `${x1}px`,
                   top: `${y1}px`,
                   width: `${length}px`,
                   height:'2px',
                   background:'#9ca3af',
                   transform: `rotate(${angle}deg)`,
                   transformOrigin:'0 0',
                   zIndex:'0'
                 }}
               />
            </React.Fragment>
          )
        })}

        {nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            onClick={handleNodeClick}
            onDrag={handleNodeDrag}
            isSelected={node.id === selectedNodeId}
            isHighlighted={
              steps.length > 0 &&
              steps[currentStepIdx]?.current === node.id
            }
          />
        ))}
      </div>

      {steps.length > 0 && (
        <div style={{ margin: "10px" }}>
          <div>Current BFS queue: {steps[currentStepIdx]?.queue?.join(", ")}</div>
        </div>
      )}

    </div>
  )
};

export default GraphCanvas;
