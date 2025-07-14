// src/pages/ConfirmationPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { OrderData, ConfirmationData } from '../models/types';
import { mockApi } from '../api/mockApi';
import { useNavigate } from 'react-router-dom';


const ConfirmationPage: React.FC = () => {
  const { setCurrentPage, detectedData, setIsLoading, isLoading, setErrorMessage, errorMessage } = useAppContext();
  const [systemData, setSystemData] = useState<OrderData | null>(null);
  const [comparisonItems, setComparisonItems] = useState<ConfirmationData['comparisonItems']>([]);
  const [editableQuantities, setEditableQuantities] = useState<{ [matCode: string]: number | string }>({});
  const [poNumber] = useState<string>('123456789');

  useEffect(() => {
    const fetchDataAndCompare = async () => {
      if (detectedData.length > 0) {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          const detectedPoNumber = detectedData[0]?.matCode ? '123456789' : poNumber;
          const fetchedSystemData = await mockApi.fetchSystemData(detectedPoNumber);
          setSystemData(fetchedSystemData);

          const newComparisonItems: ConfirmationData['comparisonItems'] = [];
          const initialEditableQuantities: { [matCode: string]: number } = {};

          const systemQuantities = new Map(fetchedSystemData.items.map(item => [item.matCode, item.quantity]));

          // Add items from detectedData
          detectedData.forEach(aiItem => {
            const poQuantity = systemQuantities.get(aiItem.matCode) || 0;
            newComparisonItems.push({
              matCode: aiItem.matCode,
              poQuantity: Number(poQuantity),
              aiQuantity: Number(aiItem.quantity),
            });
            initialEditableQuantities[aiItem.matCode] = Number(aiItem.quantity);
          });

          // Add items from systemData that were not in detectedData
          fetchedSystemData.items.forEach(systemItem => {
            if (!detectedData.some(aiItem => aiItem.matCode === systemItem.matCode)) {
              newComparisonItems.push({
                matCode: systemItem.matCode,
                poQuantity: Number(systemItem.quantity),
                aiQuantity: 0,
              });
              initialEditableQuantities[systemItem.matCode] = 0;
            }
          });

          setComparisonItems(newComparisonItems);
          setEditableQuantities(initialEditableQuantities);

        } catch (error) {
          console.error('Failed to fetch system data or compare:', error);
          setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูลหรือเปรียบเทียบ กรุณาลองใหม่');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDataAndCompare();
  }, [detectedData, poNumber, setIsLoading, setErrorMessage]);

  const handleQuantityChange = (matCode: string, value: string) => {
    if (value === '') {
      setEditableQuantities(prev => ({ ...prev, [matCode]: '' }));
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        setEditableQuantities(prev => ({ ...prev, [matCode]: parsed }));
      }
    }
  };
  const navigate = useNavigate();

  const handleConfirm = () => {
    const confirmedQuantities: { [matCode: string]: number } = {};
    Object.entries(editableQuantities).forEach(([matCode, value]) => {
      confirmedQuantities[matCode] = typeof value === 'number' ? value : 0;
    });
    navigate('/'); // กลับไปหน้า Home Page
  };
  
  

  const handleBack = () => {
    setCurrentPage('detection');
  };

  return (
    <div className="fiori-minimal-container">
      {/* Header */}
      <header className="fiori-minimal-header">
        <button 
          onClick={handleBack} 
          className="fiori-minimal-back"
        >
          <svg viewBox="0 0 24 24" className="fiori-icon">
            <polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="fiori-minimal-title">GR Confirmation</span>
      </header>

      {/* Content */}
      <main className="fiori-minimal-content">
        {isLoading && (
          <div className="fiori-minimal-loading-container">
            <svg className="fiori-minimal-spinner" viewBox="0 0 24 24">
              <circle className="fiori-minimal-spinner-track" cx="12" cy="12" r="10"></circle>
              <path className="fiori-minimal-spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {!isLoading && comparisonItems.length > 0 && (
          <>
            {/* PO Number and User Info */}
            <div className="fiori-minimal-info-card">
              <p className="fiori-minimal-info-title">PO Number: <span>{poNumber}</span></p>
              <div className="fiori-minimal-info-grid">
                <p><span className="fiori-minimal-detail-label">User:</span> ABCDF.E</p>
                <p><span className="fiori-minimal-detail-label">Date:</span> 09/07/2025</p>
                <p><span className="fiori-minimal-detail-label">PO Number:</span> 123456789</p>
                <p><span className="fiori-minimal-detail-label">Invoice Number:</span> 123456789</p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="fiori-minimal-table-container">
              <table className="fiori-minimal-table">
                <thead>
                  <tr>
                    <th className="fiori-minimal-table-header">Matcode</th>
                    <th className="fiori-minimal-table-header">PO</th>
                    <th className="fiori-minimal-table-header">AI</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonItems.map(({ matCode, poQuantity, aiQuantity }) => {
                    const editableQuantity = editableQuantities[matCode] ?? aiQuantity;
                    const displayValue = editableQuantity === '' ? '' : Number(editableQuantity);
                    const isMismatch = displayValue !== '' && Number(displayValue) !== poQuantity;

                    return (
                      <tr key={matCode} className="fiori-minimal-table-row">
                        <td className="fiori-minimal-table-cell">{matCode}</td>
                        <td className="fiori-minimal-table-cell">{poQuantity}</td>
                        <td className="fiori-minimal-table-cell">
                          <input
                            type="number"
                            min={0}
                            className={`fiori-minimal-input ${isMismatch ? 'fiori-minimal-input-error' : 'fiori-minimal-input-success'}`}
                            value={displayValue}
                            onChange={(e) => handleQuantityChange(matCode, e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {errorMessage && <p className="fiori-minimal-error-message">{errorMessage}</p>}
          </>
        )}
      </main>

      {/* Confirmation Button */}
      <footer className="fiori-minimal-footer">
        <button
          onClick={handleConfirm}
          className="fiori-minimal-button fiori-minimal-button--primary"
          disabled={isLoading || comparisonItems.length === 0}
        >
          Confirmation
        </button>
      </footer>
    </div>
  );
};

export default ConfirmationPage;