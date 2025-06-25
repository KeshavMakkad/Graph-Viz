// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import GraphCanvas from './pages/GraphCanvas';
import DocsHome from './pages/docs/DocsHome';
import BFSPage from './pages/docs/BFSPage';
import DFSPage from './pages/docs/DFSPage';
import KhanPage from './pages/docs/KhanPage';
// Legacy docs page
import DocsPage from './pages/DocsPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GraphCanvas />} />
      
      {/* Documentation routes */}
      <Route path="/docs" element={<DocsHome />} />
      <Route path="/docs/bfs" element={<BFSPage />} />
      <Route path="/docs/dfs" element={<DFSPage />} />
      <Route path="/docs/khan" element={<KhanPage />} />
      
      {/* Redirect legacy docs page */}
      <Route path="/documentation" element={<DocsPage />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
