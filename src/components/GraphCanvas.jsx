import React, { useState } from 'react';
import Node from './Node';
import './../styles/components/GraphCanvas.css';

const GraphCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleNodeDrag = (id, newX, newY) => {
    setNodes((prevNodes) =>
        prevNodes.map((node) =>
        node.id === id ? { ...node, x: newX, y: newY } : node
        )
    );
    };


  const handleCanvasClick = (e) => {
    // Avoid creating node if clicking on an existing node
    if (e.target.classList.contains('graph-node')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes([...nodes, { id: nextId, x, y }]);
    setNextId(nextId + 1);
  };

  const handleNodeClick = (id) => {
    if (selectedNodes.includes(id)) return;

    const newSelection = [...selectedNodes, id];
    setSelectedNodes(newSelection);

    if (newSelection.length === 2) {
      const [a, b] = newSelection;
      // Prevent duplicate edges (simple check)
      if (!edges.some(edge => (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a))) {
        setEdges([...edges, { a, b }]);
      }
      setSelectedNodes([]);
    }
  };

  const getNodeById = (id) => nodes.find(node => node.id === id);

  return (
    <div
      className="graph-canvas"
      onClick={handleCanvasClick}
      style={{ width: '100vw', height: '100vh', position: 'relative', background: '#f9fafb' }}
    >
      {edges.map((edge, i) => {
        const nodeA = getNodeById(edge.a);
        const nodeB = getNodeById(edge.b);
        if (!nodeA || !nodeB) return null;

        const x1 = nodeA.x + 20;
        const y1 = nodeA.y + 20;
        const x2 = nodeB.x + 20;
        const y2 = nodeB.y + 20;

        const length = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

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
            }}
          />
        );
      })}

      {nodes.map(node => (
        <Node key={node.id} {...node} onClick={handleNodeClick} onDrag={handleNodeDrag} />
      ))}
    </div>
  );
};

export default GraphCanvas;
