// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import type { AppContextType, InvoiceItem } from './models/types';
import type { ConfirmationData } from './models/types';

import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import ConfirmationPage from './pages/ConfirmationPage';

const App: React.FC = () => {
  const [orderType, setOrderType] = React.useState<'purchase' | 'production' | null>(null);
  const [detectedData, setDetectedData] = React.useState<InvoiceItem[]>([]);
  const [confirmationData, setConfirmationData] = React.useState<ConfirmationData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const appContextValue: AppContextType = {
    currentPage: '', // ไม่ต้องใช้แล้ว
    setCurrentPage: () => {}, // dummy เฉย ๆ
    orderType, setOrderType,
    detectedData, setDetectedData,
    confirmationData, setConfirmationData,
    isLoading, setIsLoading,
    errorMessage, setErrorMessage
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/detection" element={<DetectionPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
