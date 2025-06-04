import React, { useState } from "react";
import Node from "./../components/Node";
import "./../styles/pages/GraphCanvas.css";
import { useLocation } from "react-router-dom";

const GraphCanvas = () => {
  const location = useLocation();
  const name = location.state?.name || "Untitled";
  const graphType = location.state?.type || "unweighted-undirected";
  const isDirected = graphType.includes("directed");
  const isWeighted = graphType.includes("weighted");

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState(undefined);

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
      prev.map((node) => (node.id === id ? { ...node, x: newX, y: newY } : node))
    );
  };

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  return (
    <div>
      <h2 style={{ margin: '10px' }}>{name}</h2>
      <button
        onClick={handleAddNode}
        style={{
          margin: "10px",
          padding: "10px 20px",
          fontWeight: "bold",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ➕ Add Node
      </button>

      <div
        className="graph-canvas"
        style={{
          width: "100%",
          height: "90vh",
          position: "relative",
          background: "#f1f5f9",
        }}
      >
        {/* Render Edges */}
        {edges.map((edge, i) => {
          const nodeA = getNodeById(edge.a);
          const nodeB = getNodeById(edge.b);
          if (!nodeA || !nodeB) return null;

          const x1 = nodeA.x + 25;
          const y1 = nodeA.y + 25;
          const x2 = nodeB.x + 25;
          const y2 = nodeB.y + 25;

          const length = Math.hypot(x2 - x1, y2 - y1);
          const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: `${x1}px`,
                  top: `${y1}px`,
                  width: `${length}px`,
                  height: "2px",
                  background: "#9ca3af",
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 0",
                  zIndex: 1,
                }}
              />

              {isDirected && (
                <div
                  style={{
                    position: "absolute",
                    left: `${x2 - 5}px`,
                    top: `${y2 - 5}px`,
                    width: "0",
                    height: "0",
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "10px solid #2563eb",
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "center",
                    zIndex: 2,
                  }}
                />
              )}

              {edge.weight !== undefined && (
                <div
                  style={{
                    position: "absolute",
                    left: `${(x1 + x2) / 2}px`,
                    top: `${(y1 + y2) / 2}px`,
                    transform: "translate(-50%, -50%)",
                    background: "#facc15",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    zIndex: 3,
                  }}
                >
                  {edge.weight}
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Render Nodes */}
        {nodes.map((node) => (
          <Node
            key={node.id}
            {...node}
            onClick={handleNodeClick}
            onDrag={handleNodeDrag}
            isSelected={selectedNodeId === node.id}
          />
        ))}
      </div>
    </div>
  );
};

export default GraphCanvas;
