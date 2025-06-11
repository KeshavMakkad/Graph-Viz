import React, { useState } from "react";
import Node from "./../components/Node";
import { BFS } from "./../algorithms/BFS";
import { DFS } from "./../algorithms/DFS";
import "./../styles/pages/GraphCanvas.css";
import { useLocation } from "react-router-dom";

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
  const [highlighted, setHighlighted] = useState([]);
  const [algorithm, setAlgorithm] = useState("bfs");

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

  const runAlgorithm = () => {
    const bfsRunner = new BFS(nodes, edges, isDirected);
    let result;

    if (algorithm === "bfs") {
      if (selectedNodeId === undefined) {
        alert("Select a starting node.");
        return;
      }
      result = bfsRunner.bfs(selectedNodeId);
    } else if (algorithm === "multiBfs") {
      result = bfsRunner.multiSourceBfs(nodes.map((n) => n.id)); // All as sources
    } else if (algorithm === "zeroOneBfs") {
      if (selectedNodeId === undefined) {
        alert("Select a starting node.");
        return;
      }
      const dist = bfsRunner.zeroOneBfs(selectedNodeId);
      result = Array.from(dist.entries()).map(([nodeId, d]) => `${nodeId}: ${d}`);
      alert("Distance:\n" + result.join("\n"));
      return;
    } else if (algorithm === "dfs") {
        if (selectedNodeId === undefined) {
            alert("Select a starting node.");
            return;
        }
        const dfsRunner = new DFS(nodes, edges, isDirected);
        result = dfsRunner.dfs(selectedNodeId);
    }

    setHighlighted(result);
  };

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px" }}>
        <button onClick={handleAddNode}>➕ Add Node</button>

        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="bfs">BFS</option>
          <option value="multiBfs">Multi-Source BFS</option>
          <option value="zeroOneBfs">0-1 BFS</option>
          <option value="dfs">DFS</option>

        </select>

        <button onClick={runAlgorithm}>▶️ Run</button>
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
                style={{
                  position: "absolute",
                  left: `${x1}px`,
                  top: `${y1}px`,
                  width: `${length}px`,
                  height: "2px",
                  background: "#9ca3af",
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 0",
                  zIndex: 0,
                }}
              />

              {isDirected && (
                <div
                  style={{
                    position: "absolute",
                    left: `${x2 - 25}px`,
                    top: `${y2 + 15}px`,
                    width: "0",
                    height: "0",
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "10px solid #2563eb",
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "center",
                    zIndex: 0,
                  }}
                />
              )}

              {isWeighted && edge.weight !== undefined && (
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

        {nodes.map((node) => (
          <Node
            key={node.id}
            {...node}
            onClick={handleNodeClick}
            onDrag={handleNodeDrag}
            isSelected={node.id === selectedNodeId}
            isHighlighted={highlighted.includes(node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GraphCanvas;
