// src/api/mockApi.ts

import type { OrderData, InvoiceItem } from '../models/types';

export const mockApi = {
  detectOCR: async (): Promise<OrderData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          poNumber: 'PO123456789',
          invoiceNumber: 'INV987654321',
          items: [
            { matCode: '37000000', description: 'ผงบำรุงหัวเข่า', quantity: 50, unit: 'PAC' },
            { matCode: '37000001', description: 'ผงบำรุงท้ายเข่า', quantity: 11, unit: 'PAC' },
            { matCode: '37000006', description: 'ด้านหน้าหัวเข่า', quantity: 20, unit: 'PAC' },
          ],
        });
      }, 1500);
    });
  },

  detectObject: async (): Promise<InvoiceItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { matCode: '37000000', description: 'ผงบำรุงหัวเข่า', quantity: 50, unit: 'PAC' },
          { matCode: '37000001', description: 'ผงบำรุงท้ายเข่า', quantity: 9, unit: 'PAC' },
          { matCode: '37000006', description: 'ด้านหน้าหัวเข่า', quantity: 20, unit: 'PAC' },
        ]);
      }, 1500);
    });
  },

  fetchSystemData: async (poNumber: string): Promise<OrderData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          poNumber,
          invoiceNumber: 'INV987654321',
          items: [
            { matCode: '37000000', description: 'ผงบำรุงหัวเข่า', quantity: 50, unit: 'PAC' },
            { matCode: '37000001', description: 'ผงบำรุงท้ายเข่า', quantity: 11, unit: 'PAC' },
            { matCode: '37000006', description: 'ด้านหน้าหัวเข่า', quantity: 20, unit: 'PAC' },
          ],
        });
      }, 1000);
    });
  },
};
