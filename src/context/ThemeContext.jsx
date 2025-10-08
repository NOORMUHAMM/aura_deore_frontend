import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // ✅ Load theme early (from localStorage or system preference)
    let saved = localStorage.getItem("theme");
    if (!saved) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      saved = prefersDark ? "dark" : "light";
      localStorage.setItem("theme", saved);
    }
    return saved;
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (t) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(t);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
