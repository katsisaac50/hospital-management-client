import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
  user: string;
  setUser: (user: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string>('Guest');

  return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
