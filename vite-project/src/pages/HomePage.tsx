// src/pages/HomePage.tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


const HomePage: React.FC = () => {
  const { setCurrentPage, setOrderType } = useAppContext();
  const navigate = useNavigate();

  const handleOrderTypeSelect = (type: 'purchase' | 'production') => {
    setOrderType(type);
    navigate('/detection'); // ไป path จริง
  };



  return (
    <div className="fiori-minimal-container">
      {/* Header */}
      <header className="fiori-minimal-header">
        <span className="fiori-minimal-title">Select Order Type</span>
      </header>

      {/* Content - Centered Buttons */}
      <main className="fiori-minimal-content-2">
        <div className="fiori-minimal-buttons">
          <button
            className="fiori-minimal-button fiori-minimal-button--primary"
            onClick={() => handleOrderTypeSelect('purchase')}
          >
            Purchase Order
          </button>
          <button
            className="fiori-minimal-button fiori-minimal-button--primary"
            onClick={() => handleOrderTypeSelect('production')}
          >
            Production Order
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="fiori-minimal-footer">
        <span>SAP Fiori</span>
      </footer>
    </div>
  );
};

export default HomePage;