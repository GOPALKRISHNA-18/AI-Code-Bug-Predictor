import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("aiBugPredictorTheme") || "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("aiBugPredictorTheme", theme);
  }, [theme]);
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  return useContext(ThemeContext);
};