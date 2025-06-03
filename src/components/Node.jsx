import React, { useRef } from 'react';
import './../styles/components/Node.css';

const Node = ({ id, x, y, onClick, onDrag, isSelected }) => {
  const nodeRef = useRef(null);
  const isDragging = useRef(false);
  const didMove = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const rect = nodeRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    isDragging.current = true;
    didMove.current = false;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const canvasRect = nodeRef.current?.parentNode?.getBoundingClientRect();
    if (!canvasRect) return;

    const newX = e.clientX - canvasRect.left - offset.current.x;
    const newY = e.clientY - canvasRect.top - offset.current.y;

    onDrag(id, newX, newY);
    didMove.current = true;
  };

  const handleMouseUp = (e) => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (!didMove.current) {
      onClick(id); // Only call click if no drag occurred
    }

    isDragging.current = false;
    didMove.current = false;
  };

  return (
    <div
      ref={nodeRef}
      className={`graph-node ${isSelected ? 'selected' : ''}`}
      style={{ left: `${x}px`, top: `${y}px` }}
      onMouseDown={handleMouseDown}
    >
      {id}
    </div>
  );
};

export default Node;
