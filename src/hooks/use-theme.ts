import { useEffect, useState } from "react";

type Theme = "primary" | "secondary";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("hydra-theme");
    return (stored as Theme) || "primary";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-primary", "theme-secondary");
    
    if (theme === "secondary") {
      root.classList.add("theme-secondary");
    }
    
    localStorage.setItem("hydra-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "primary" ? "secondary" : "primary"));
  };

  return { theme, setTheme, toggleTheme };
}
