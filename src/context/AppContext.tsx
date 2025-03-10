import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ProductsProvider } from "./ProductsContext";

interface User {
  _id: string;
  username: string;
  role: "admin" | "doctor" | "labTechnician" | "guest";
}

interface AppContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      
    }
    }
    return null;
    
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <ProductsProvider>{children}</ProductsProvider>
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