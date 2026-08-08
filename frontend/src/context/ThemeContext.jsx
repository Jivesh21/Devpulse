import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

const ACCENTS = {
  violet: {
    primary: "oklch(0.606 0.25 292)",
    ring: "oklch(0.606 0.25 292)",
  },
  blue: {
    primary: "oklch(0.61 0.2 255)",
    ring: "oklch(0.61 0.2 255)",
  },
  emerald: {
    primary: "oklch(0.72 0.21 155)",
    ring: "oklch(0.72 0.21 155)",
  },
  rose: {
    primary: "oklch(0.66 0.23 15)",
    ring: "oklch(0.66 0.23 15)",
  },
  orange: {
    primary: "oklch(0.74 0.18 55)",
    ring: "oklch(0.74 0.18 55)",
  },
};

export const ThemeContextProvider = ({
  children,
}) => {
  const [accent, setAccent] =
    useState(() => {
      return (
        localStorage.getItem(
          "devpulse-accent"
        ) || "violet"
      );
    });

  useEffect(() => {
    localStorage.setItem(
      "devpulse-accent",
      accent
    );

    const colors = ACCENTS[accent];

    document.documentElement.style.setProperty(
      "--primary",
      colors.primary
    );

    document.documentElement.style.setProperty(
      "--ring",
      colors.ring
    );
  }, [accent]);

  return (
    <ThemeContext.Provider
      value={{
        accent,
        setAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAccentTheme = () => {
  return useContext(ThemeContext);
};