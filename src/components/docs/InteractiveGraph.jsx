import React from "react";

const InteractiveGraph = ({ nodes, edges, currentStep, directed = false }) => {
  const nodeRadius = 20;

  // Determine node state (for coloring and behavior)
  const getNodeState = (nodeId) => {
    const id = String(nodeId);

    if (!currentStep) return "default";
    if (String(currentStep.current) === id) return "current";
    if (String(currentStep.processing) === id) return "processing";

    if (currentStep.topoOrder?.map(String).includes(id)) return "processed";
    if (currentStep.visited?.map(String).includes(id)) {
      if (currentStep.newlyVisited?.map(String).includes(id)) return "newly-visited";
      return "visited";
    }

    if (currentStep.queue?.map(String).includes(id)) return "in-queue";
    if (currentStep.stack?.map(String).includes(id)) return "in-stack";

    return "default";
  };

  // Determine edge state (for highlighting)
  const getEdgeState = (edge) => {
    if (!currentStep) return "default";

    const edgeA = String(edge.a);
    const edgeB = String(edge.b);

    const isPathEdge = currentStep.path?.some(path => {
      return path.some((_, idx) => {
        const current = String(path[idx]);
        const next = String(path[idx + 1]);
        return (edgeA === current && edgeB === next) ||
               (!directed && edgeA === next && edgeB === current);
      });
    });

    if (isPathEdge) return "path";
    if (String(currentStep.current) === edgeA) return "active";
    if (currentStep.updated?.map(String).includes(edgeB)) return "updated";

    return "default";
  };

  // Set fixed dimensions for the SVG
  const svgWidth = 500;
  const svgHeight = 300;

  return (
    <div className="interactive-graph-container">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="interactive-graph"
      >
        {/* Edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => String(n.id) === String(edge.a));
          const toNode = nodes.find(n => String(n.id) === String(edge.b));
          if (!fromNode || !toNode) return null;

          const edgeState = getEdgeState(edge);
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const length = Math.sqrt(dx * dx + dy * dy);

          const startX = fromNode.x + (nodeRadius * dx / length);
          const startY = fromNode.y + (nodeRadius * dy / length);
          const endX = toNode.x - (nodeRadius * dx / length);
          const endY = toNode.y - (nodeRadius * dy / length);

          const strokeColor =
            edgeState === "path" ? "#22c55e" :
            edgeState === "active" ? "#3b82f6" :
            edgeState === "updated" ? "#f97316" :
            "#9ca3af";

          const strokeWidth = edgeState === "path" ? 3 : 2;

          return (
            <g key={`edge-${index}`} className={`graph-edge edge-state-${edgeState}`}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              {directed && (
                <polygon
                  points="0,-5 10,0 0,5"
                  transform={`translate(${endX}, ${endY}) rotate(${angle})`}
                  fill={strokeColor}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const nodeState = getNodeState(node.id);
          const nodeColor =
            nodeState === "current" ? "#3b82f6" :
            nodeState === "processing" ? "#f97316" :
            nodeState === "processed" ? "#14b8a6" :
            nodeState === "visited" ? "#8b5cf6" :
            nodeState === "newly-visited" ? "#f43f5e" :
            nodeState === "in-queue" ? "#eab308" :
            nodeState === "in-stack" ? "#ef4444" :
            "#6b7280";

          return (
            <g key={`node-${node.id}`} className={`graph-node node-state-${nodeState}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill="white"
                stroke={nodeColor}
                strokeWidth="3"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                dy="0.35em"
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

      {/* Legend */}
      <div className="graph-legend">
        {[
          { color: "#6b7280", label: "Default" },
          { color: "#3b82f6", label: "Current" },
          { color: "#8b5cf6", label: "Visited" },
          { color: "#14b8a6", label: "Processed" }
        ].map((item, i) => (
          <div key={i} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveGraph;
