import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraphModal from '../components/GraphModal';
import './../styles/pages/Home.css';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartGraph = ({ name, type }) => {
    setModalOpen(false);
    navigate('/canvas', { state: { name, type } });
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Graph Visualizer</h1>
      <button className="create-graph-button" onClick={() => setModalOpen(true)}>
        ➕ Create Graph
      </button>
      <Link to="/docs" className="docs-link-home-page" style={{ marginTop: "1.5rem" }}>
        View Documentation
      </Link>
      {modalOpen && <GraphModal onClose={() => setModalOpen(false)} onStart={handleStartGraph} />}
    </div>
  );
};

export default Home;
