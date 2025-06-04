// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GraphCanvas from './pages/GraphCanvas';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/canvas" element={<GraphCanvas />} />
    </Routes>
  );
};

export default App;
