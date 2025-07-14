// src/context/AppContext.tsx

import { createContext, useContext } from 'react';
import type { AppContextType } from '../models/types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
