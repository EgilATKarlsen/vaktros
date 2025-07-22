"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardHeaderContextType {
  title: string;
  subheading: string;
  setHeader: (title: string, subheading: string) => void;
}

const DashboardHeaderContext = createContext<DashboardHeaderContextType | undefined>(undefined);

export function DashboardHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('Dashboard');
  const [subheading, setSubheading] = useState('');

  const setHeader = (newTitle: string, newSubheading: string) => {
    setTitle(newTitle);
    setSubheading(newSubheading);
  };

  return (
    <DashboardHeaderContext.Provider value={{ title, subheading, setHeader }}>
      {children}
    </DashboardHeaderContext.Provider>
  );
}

export function useDashboardHeader() {
  const context = useContext(DashboardHeaderContext);
  if (context === undefined) {
    throw new Error('useDashboardHeader must be used within a DashboardHeaderProvider');
  }
  return context;
} 