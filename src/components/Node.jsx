import React, { useRef } from 'react';
import './../styles/components/Node.css';

const Node = ({ id, x, y, onClick, onDrag, isSelected, isHighlighted }) => {
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;

    const canvas = document.querySelector(".graph-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    offset.current = {
      x: e.clientX - canvasRect.left - x,
      y: e.clientY - canvasRect.top - y,
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const canvas = document.querySelector(".graph-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const newX = e.clientX - canvasRect.left - offset.current.x;
    const newY = e.clientY - canvasRect.top - offset.current.y;

    onDrag(id, newX, newY);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={canvasRef}
      className={`graph-node ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{ left: `${x}px`, top: `${y}px` }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
    >
      {id}
    </div>
  );
};

export default Node;
