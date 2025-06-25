import React from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/docs/DocsHome.css";

const DocsHome = () => {
  return (
    <div className="docs-container">
      <header className="docs-header">
        <div className="header-content">
          <h1>Graph Algorithm Documentation</h1>
          <div className="nav-links">
            <Link to="/" className="header-link">Home</Link>
            <Link to="/" className="back-to-app-btn">Back to App</Link>
          </div>
        </div>
      </header>
      
      <div className="docs-content">

        <div className="algorithm-cards">
          <Link to="/docs/bfs" className="algorithm-card">
            <div className="card-icon">BFS</div>
            <h3>Breadth-First Search</h3>
            <p>A traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level.</p>
            <div className="card-applications">
              <span>Shortest Path</span>
              <span>Level Order Traversal</span>
              <span>Connected Components</span>
            </div>
            <div className="card-cta">Learn More →</div>
          </Link>
          
          <Link to="/docs/dfs" className="algorithm-card">
            <div className="card-icon">DFS</div>
            <h3>Depth-First Search</h3>
            <p>A traversal algorithm that explores as far as possible along each branch before backtracking.</p>
            <div className="card-applications">
              <span>Component Analysis</span>
              <span>Maze Solving</span>
              <span>Cycle Detection</span>
            </div>
            <div className="card-cta">Learn More →</div>
          </Link>
          
          <Link to="/docs/khan" className="algorithm-card">
            <div className="card-icon">Khan</div>
            <h3>Khan's Algorithm</h3>
            <p>An algorithm for topological sorting of a directed acyclic graph (DAG).</p>
            <div className="card-applications">
              <span>Dependency Resolution</span>
              <span>Course Scheduling</span>
              <span>Task Ordering</span>
            </div>
            <div className="card-cta">Learn More →</div>
          </Link>
        </div>
      </div>
      <div className="legacy-docs-link">
          <Link to="/documentation">View Legacy Documentation</Link>
        </div>
    </div>
  );
};

export default DocsHome;
