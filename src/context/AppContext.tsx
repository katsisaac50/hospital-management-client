import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductsProvider } from "./ProductsContext";

interface User {
  username: string;
  role: "admin" | "doctor" | "labTechnician" | "guest";
}

interface AppContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <ProductsProvider> {/* ✅ Wraps everything */}
        {children}
      </ProductsProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};