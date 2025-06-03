import React, { useRef } from 'react';
import './../styles/components/Node.css';

const Node = ({ id, x, y, onClick, onDrag }) => {
  const nodeRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    const rect = nodeRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    onDrag(id, e.clientX - offset.current.x, e.clientY - offset.current.y);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={nodeRef}
      className="graph-node"
      style={{ left: `${x}px`, top: `${y}px` }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering canvas click
        onClick(id);
      }}
    >
      {id}
    </div>
  );
};

export default Node;
