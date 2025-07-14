// src/models/types.ts

export interface InvoiceItem {
    matCode: string;
    description: string;
    quantity: number;
    unit: string;
  }
  
  export interface OrderData {
    poNumber: string;
    invoiceNumber: string;
    items: InvoiceItem[];
  }
  
  export interface ConfirmationData {
    poNumber: string;
    user: string;
    date: string;
    invoiceNumber: string;
    comparisonItems: {
      matCode: string;
      poQuantity: number;
      aiQuantity: number;
    }[];
  }
  
  export interface AppContextType {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    orderType: 'purchase' | 'production' | null;
    setOrderType: (type: 'purchase' | 'production' | null) => void;
    detectedData: InvoiceItem[];
    setDetectedData: (data: InvoiceItem[]) => void;
    confirmationData: ConfirmationData | null;
    setConfirmationData: (data: ConfirmationData | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
  }
  