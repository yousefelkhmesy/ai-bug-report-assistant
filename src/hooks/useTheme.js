import { useEffect, useState } from "react";

const storageKey = "bug-report-theme";

const getInitialTheme = () => {
  const stored = window.localStorage.getItem(storageKey);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
