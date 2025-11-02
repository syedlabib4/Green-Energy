import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // read saved preference (guarded)
  const getInitial = () => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  };

  const [darkMode, setDarkMode] = useState(getInitial);

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (darkMode) root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("darkMode", darkMode ? "true" : "false");
    } catch (err) {
      console.warn("Theme apply failed:", err);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((p) => !p);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
