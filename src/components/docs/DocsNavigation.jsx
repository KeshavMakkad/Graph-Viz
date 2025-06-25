import React from "react";
import { Link, useLocation } from "react-router-dom";

const DocsNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="docs-sidebar">
      <div className="sidebar-header">Algorithms</div>
      <ul>
        <li>
          <Link 
            to="/docs/bfs" 
            className={currentPath === "/docs/bfs" ? "active" : ""}
          >
            Breadth-First Search (BFS)
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/dfs" 
            className={currentPath === "/docs/dfs" ? "active" : ""}
          >
            Depth-First Search (DFS)
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/khan" 
            className={currentPath === "/docs/khan" ? "active" : ""}
          >
            Khan's Algorithm
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DocsNavigation;
