import React, { useEffect, useRef } from 'react';

const InteractiveGraph = ({ nodes, edges, currentStep, directed = false }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw edges first
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.a);
      const targetNode = nodes.find(n => n.id === edge.b);
      
      if (sourceNode && targetNode) {
        // Determine edge state
        let edgeColor = '#cbd5e1'; // Default color
        let edgeWidth = 2;
        
        // Check if this edge involves the current node
        if (currentStep && (
            (currentStep.current === sourceNode.id && currentStep.processing === targetNode.id) ||
            (currentStep.current === targetNode.id && currentStep.processing === sourceNode.id)
          )) {
          edgeColor = '#f97316'; // Active edge
          edgeWidth = 3;
        }
        
        // Draw the edge line
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = edgeWidth;
        ctx.stroke();
        
        // If directed, draw an arrow
        if (directed) {
          const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
          const arrowSize = 10;
          
          const arrowX = targetNode.x - 20 * Math.cos(angle);
          const arrowY = targetNode.y - 20 * Math.sin(angle);
          
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - arrowSize * Math.cos(angle - Math.PI/6), 
            arrowY - arrowSize * Math.sin(angle - Math.PI/6)
          );
          ctx.lineTo(
            arrowX - arrowSize * Math.cos(angle + Math.PI/6), 
            arrowY - arrowSize * Math.sin(angle + Math.PI/6)
          );
          ctx.closePath();
          ctx.fillStyle = edgeColor;
          ctx.fill();
        }
      }
    });
    
    // Draw nodes on top of edges
    nodes.forEach(node => {
      // Determine node state
      let nodeColor = '#94a3b8'; // Default color
      let nodeBorder = '#475569';
      let borderWidth = 2;
      
      if (currentStep) {
        if (currentStep.current === node.id) {
          nodeColor = '#3b82f6'; // Current node
          nodeBorder = '#1d4ed8';
          borderWidth = 3;
        } else if (currentStep.processing === node.id) {
          nodeColor = '#f97316'; // Processing node
          nodeBorder = '#ea580c';
          borderWidth = 3;
        } else if (currentStep.visited && currentStep.visited.includes(node.id)) {
          nodeColor = '#8b5cf6'; // Visited node
          nodeBorder = '#7c3aed';
        } else if (currentStep.queue && currentStep.queue.includes(node.id)) {
          nodeColor = '#0ea5e9'; // Queued node
          nodeBorder = '#0284c7';
        } else if (currentStep.stack && currentStep.stack.includes(node.id)) {
          nodeColor = '#ef4444'; // Stack node
          nodeBorder = '#dc2626';
        }
        
        // Newly visited node styling
        if (currentStep.newlyVisited && currentStep.newlyVisited.includes(node.id)) {
          borderWidth = 4;
        }
      }
      
      // Draw the node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 18, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = nodeBorder;
      ctx.stroke();
      
      // Draw the node id
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id.toString(), node.x, node.y);
    });
    
  }, [nodes, edges, currentStep, directed]);
  
  return (
    <div className="interactive-graph-container">
      <canvas 
        ref={canvasRef} 
        className="interactive-graph" 
        width={550} 
        height={300}
      />
      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#3b82f6'}}></div>
          <span>Current Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#8b5cf6'}}></div>
          <span>Visited Node</span>
        </div>
        {currentStep && currentStep.queue && (
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#0ea5e9'}}></div>
            <span>In Queue</span>
          </div>
        )}
        {currentStep && currentStep.stack && (
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#ef4444'}}></div>
            <span>In Stack</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGraph;
