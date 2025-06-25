import React from "react";

const InteractiveGraph = ({ nodes, edges, currentStep, directed = false }) => {
  // Helper function to determine node state
  const getNodeState = (nodeId) => {
    if (!currentStep) return "default";
    
    if (currentStep.current === nodeId) return "current";
    if (currentStep.processing === nodeId) return "processing";
    
    if (currentStep.topoOrder?.includes(nodeId)) return "processed";
    if (currentStep.visited?.includes(nodeId)) {
      if (currentStep.newlyVisited?.includes(nodeId)) return "newly-visited";
      return "visited";
    }
    
    if (currentStep.queue?.includes(nodeId)) return "in-queue";
    if (currentStep.stack?.includes(nodeId)) return "in-stack";
    
    return "default";
  };

  // Helper function to determine edge state
  const getEdgeState = (edge) => {
    if (!currentStep) return "default";
    
    // Check if this is a path edge in BFS/DFS
    const isPathEdge = currentStep.path?.some((path, index) => {
      if (index === path.length - 1) return false;
      const currentId = path[index];
      const nextId = path[index + 1];
      return (edge.a === currentId && edge.b === nextId) || 
             (!directed && edge.a === nextId && edge.b === currentId);
    });
    
    if (isPathEdge) return "path";
    
    // Check if this edge is from the current node being processed
    if (currentStep.current === edge.a) return "active";
    if (currentStep.updated?.includes(edge.b)) return "updated";
    
    return "default";
  };

  return (
    <div className="interactive-graph-container">
      <svg width="440" height="320" className="interactive-graph">
        {/* Render edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.a);
          const toNode = nodes.find(n => n.id === edge.b);
          
          if (!fromNode || !toNode) return null;
          
          const edgeState = getEdgeState(edge);
          
          // For directed graphs, add arrow markers
          if (directed) {
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const length = Math.sqrt(dx * dx + dy * dy);
            
            // Adjust end points to account for node radius
            const nodeRadius = 20;
            const startX = fromNode.x + (nodeRadius * dx / length);
            const startY = fromNode.y + (nodeRadius * dy / length);
            const endX = toNode.x - (nodeRadius * dx / length);
            const endY = toNode.y - (nodeRadius * dy / length);
            
            return (
              <g key={`edge-${index}`} className={`graph-edge edge-state-${edgeState}`}>
                <line 
                  x1={startX} 
                  y1={startY} 
                  x2={endX} 
                  y2={endY} 
                  stroke={edgeState === "path" ? "#22c55e" : 
                          edgeState === "active" ? "#3b82f6" : 
                          edgeState === "updated" ? "#f97316" : "#9ca3af"}
                  strokeWidth={edgeState === "path" ? 3 : 2}
                />
                <polygon 
                  points={`0,-5 10,0 0,5`}
                  transform={`translate(${endX}, ${endY}) rotate(${angle})`}
                  fill={edgeState === "path" ? "#22c55e" : 
                        edgeState === "active" ? "#3b82f6" : 
                        edgeState === "updated" ? "#f97316" : "#9ca3af"}
                />
              </g>
            );
          }
          
          return (
            <line
              key={`edge-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={edgeState === "path" ? "#22c55e" : 
                      edgeState === "active" ? "#3b82f6" : 
                      edgeState === "updated" ? "#f97316" : "#9ca3af"}
              strokeWidth={edgeState === "path" ? 3 : 2}
              className={`graph-edge edge-state-${edgeState}`}
            />
          );
        })}
        
        {/* Render nodes */}
        {nodes.map(node => {
          const nodeState = getNodeState(node.id);
          const nodeColor = nodeState === "current" ? "#3b82f6" : 
                           nodeState === "processing" ? "#f97316" :
                           nodeState === "processed" ? "#14b8a6" :
                           nodeState === "visited" ? "#8b5cf6" :
                           nodeState === "newly-visited" ? "#f43f5e" :
                           nodeState === "in-queue" ? "#eab308" :
                           nodeState === "in-stack" ? "#ef4444" : "#6b7280";
          
          return (
            <g key={`node-${node.id}`} className={`graph-node node-state-${nodeState}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill="white"
                stroke={nodeColor}
                strokeWidth="3"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill={nodeColor}
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#6b7280" }}></div>
          <span>Default</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#3b82f6" }}></div>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#8b5cf6" }}></div>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#14b8a6" }}></div>
          <span>Processed</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGraph;
