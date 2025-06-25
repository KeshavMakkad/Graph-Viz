import React from "react";
import { Link } from "react-router-dom";

const DocsHeader = ({ title }) => {
  return (
    <header className="docs-header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/docs" className="docs-home-link">Algorithms</Link>
          <span className="header-divider">/</span>
          <h1>{title}</h1>
        </div>
        <Link to="/" className="back-to-app-btn">Back to App</Link>
      </div>
    </header>
  );
};

export default DocsHeader;
