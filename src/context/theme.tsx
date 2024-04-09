// themecontext.tsx
import React, { createContext, useState, useEffect } from "react";
interface ThemeContextProps {
  theme: string;
  setTheme: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
});

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const storedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const valueToShare = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={valueToShare}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
