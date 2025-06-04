import React, { useState } from 'react';
import './../styles/components/GraphModal.css';

const GraphModal = ({ onClose, onStart }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('unweighted-undirected');

  const handleSubmit = () => {
    if (name.trim()) {
      onStart({ name, type });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Graph</h2>
        <input
          type="text"
          placeholder="Graph Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="unweighted-undirected">Unweighted Undirected</option>
          <option value="weighted-undirected">Weighted Undirected</option>
          <option value="unweighted-directed">Unweighted Directed</option>
          <option value="weighted-directed">Weighted Directed</option>
        </select>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Start</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default GraphModal;
