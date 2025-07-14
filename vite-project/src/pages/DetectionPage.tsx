// src/pages/DetectionPage.tsx

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { InvoiceItem } from '../models/types';
import { mockApi } from '../api/mockApi';
import { useNavigate } from 'react-router-dom';

const DetectionPage: React.FC = () => {
  const {
    setCurrentPage,
    setDetectedData,
    setIsLoading,
    isLoading,
    setErrorMessage,
    errorMessage
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'objectDetection' | 'ocr'>('objectDetection');

  // State เก็บผลการตรวจจับ
  const [detectionResults, setDetectionResults] = useState<{
    objectDetection: InvoiceItem[] | null;
    ocr: { items: InvoiceItem[], poNumber: string, invoiceNumber: string } | null;
  }>({
    objectDetection: null,
    ocr: null
  });

  const handleDetect = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (activeTab === 'ocr') {
        const data = await mockApi.detectOCR();
        setDetectionResults(prev => ({
          ...prev,
          ocr: data
        }));
      } else {
        const data = await mockApi.detectObject();
        setDetectionResults(prev => ({
          ...prev,
          objectDetection: data
        }));
      }
    } catch (error) {
      console.error('Detection failed:', error);
      setErrorMessage('เกิดข้อผิดพลาดในการตรวจจับข้อมูล กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleNext = () => {
    const data = activeTab === 'ocr'
      ? (detectionResults.ocr?.items || [])
      : (detectionResults.objectDetection || []);
    setDetectedData(data);

    navigate('/confirmation'); // ใช้ react-router-dom
  };

  // ตรวจว่ามีข้อมูลของ tab ปัจจุบันหรือยัง
  const hasDataForCurrentTab = activeTab === 'ocr'
    ? (detectionResults.ocr !== null)
    : (detectionResults.objectDetection !== null);

  // ตรวจว่ามีข้อมูลครบทั้ง OCR และ Object Detection หรือยัง
  const hasAllData = detectionResults.ocr !== null && detectionResults.objectDetection !== null;

  return (
    <div className="fiori-minimal-container">
      {/* Header */}
      <header className="fiori-minimal-header">
        <button
          onClick={() => setCurrentPage('home')}
          className="fiori-minimal-back"
        >
          <svg viewBox="0 0 24 24" className="fiori-icon">
            <polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="fiori-minimal-title">AI Smart Receiving</span>
      </header>

      {/* Content */}
      <main className="fiori-minimal-content">
        {/* Tabs */}
        <div className="fiori-minimal-tabs">
          <button
            onClick={() => setActiveTab('objectDetection')}
            className={`fiori-minimal-tab ${activeTab === 'objectDetection' ? 'fiori-minimal-tab--active' : ''}`}
          >
            Object Detection
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`fiori-minimal-tab ${activeTab === 'ocr' ? 'fiori-minimal-tab--active' : ''}`}
          >
            OCR
          </button>
        </div>

        {/* Image/Feed */}
        <div className="fiori-minimal-image-container">
          {activeTab === 'objectDetection' && (
            <img
              src="https://placehold.co/400x256/E0E0E0/555555?text=Object+Detection+Feed"
              alt="Object Detection Feed"
              className="fiori-minimal-image"
            />
          )}
          {activeTab === 'ocr' && (
            <img
              src="https://placehold.co/400x256/E0E0E0/555555?text=OCR+Invoice+Feed"
              alt="OCR Invoice Feed"
              className="fiori-minimal-image"
            />
          )}
        </div>

        {/* Detect Button */}
        {!hasDataForCurrentTab && (
          <div className="fiori-minimal-button-container">
            <button
              onClick={handleDetect}
              className="fiori-minimal-button fiori-minimal-button--primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="fiori-minimal-loading">
                  <svg className="fiori-minimal-spinner" viewBox="0 0 24 24">
                    <circle className="fiori-minimal-spinner-track" cx="12" cy="12" r="10"></circle>
                    <path className="fiori-minimal-spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังตรวจจับ...
                </div>
              ) : (
                `เริ่ม ${activeTab === 'ocr' ? 'OCR' : 'Object Detection'}`
              )}
            </button>
            {errorMessage && <p className="fiori-minimal-error-message">{errorMessage}</p>}
          </div>
        )}

        {/* Results */}
        {hasDataForCurrentTab && (
          <div className="fiori-minimal-data-container">
            <h2 className="fiori-minimal-data-title">ข้อมูลที่ตรวจพบ:</h2>

            {activeTab === 'ocr' && detectionResults.ocr && (
              <>
                <div className="fiori-minimal-invoice-details">
                  <p><span className="fiori-minimal-detail-label">Invoice Number:</span> {detectionResults.ocr.invoiceNumber}</p>
                  <p><span className="fiori-minimal-detail-label">PO Number:</span> {detectionResults.ocr.poNumber}</p>
                </div>
                <div className="fiori-minimal-table-container">
                  <table className="fiori-minimal-table">
                    <thead>
                      <tr>
                        <th>Mat Code</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detectionResults.ocr.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.matCode}</td>
                          <td>{item.description}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'objectDetection' && detectionResults.objectDetection && (
              <div className="fiori-minimal-table-container">
                <table className="fiori-minimal-table">
                  <thead>
                    <tr>
                      <th>Mat Code</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detectionResults.objectDetection.map((item, index) => (
                      <tr key={index}>
                        <td>{item.matCode}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="fiori-minimal-button-container mt-4">
              <button
                onClick={handleDetect}
                className="fiori-minimal-button fiori-minimal-button--primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="fiori-minimal-loading">
                    <svg className="fiori-minimal-spinner" viewBox="0 0 24 24">
                      <circle className="fiori-minimal-spinner-track" cx="12" cy="12" r="10"></circle>
                      <path className="fiori-minimal-spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังตรวจจับ...
                  </div>
                ) : (
                  `ตรวจจับ ${activeTab === 'ocr' ? 'OCR' : 'Object Detection'} ใหม่`
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Next Button */}
      <footer className="fiori-minimal-footer">
        <button
          onClick={handleNext}
          className="fiori-minimal-button fiori-minimal-button--primary"
          disabled={!hasAllData || isLoading}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default DetectionPage;
