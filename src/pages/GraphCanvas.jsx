import React, { useState } from 'react';
import Node from './../components/Node';
import './../styles/pages/GraphCanvas.css';
import { useLocation } from 'react-router-dom';

const GraphCanvas = () => {

  const location = useLocation();
  const { name, type } = location.state || { name: 'Untitled', type: 'unweighted-undirected' };

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
    if (selectedNodeId === undefined) {
      setSelectedNodeId(id); // Select this node
    } else if (selectedNodeId !== id) {
      const exists = edges.some(
        (edge) =>
          (edge.a === selectedNodeId && edge.b === id) ||
          (edge.a === id && edge.b === selectedNodeId)
      );

      if (!exists) {
        setEdges([...edges, { a: selectedNodeId, b: id }]);
      }

      setSelectedNodeId(undefined); // Deselect after edge formed
    } else {
      // Clicked same node again — deselect
      setSelectedNodeId(undefined);
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
      <button
        onClick={handleAddNode}
        style={{
          margin: '10px',
          padding: '10px 20px',
          fontWeight: 'bold',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        ➕ Add Node
      </button>

      <div className="graph-canvas">
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
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x1}px`,
                top: `${y1}px`,
                width: `${length}px`,
                height: '2px',
                background: '#9ca3af',
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 0',
                zIndex: 1,
              }}
            />
          );
        })}

        {nodes.map((node) => (
          <Node
            key={node.id}
            {...node}
            isSelected={node.id === selectedNodeId}
            onClick={handleNodeClick}
            onDrag={handleNodeDrag}
          />
        ))}
      </div>
    </div>
  );
};

export default GraphCanvas;
