// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GraphCanvas from './pages/GraphCanvas';
import DocsPage from './pages/DocsPage'; // Import the new DocsPage

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/canvas" element={<GraphCanvas />} />
      <Route path="/docs" element={<DocsPage />} /> {/* Add the new route */}
    </Routes>
  );
};

export default App;
