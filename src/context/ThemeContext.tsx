import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: "glass" | "dark"; // Adjust this based on your actual theme values
  toggleTheme: () => void;
};
  // Create the context with a default value of `undefined`
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook for consuming the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"glass" | "dark">("glass");

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === "glass" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme; // Apply theme to the body
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'glass' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
