import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@unified_toolkit_theme";

export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((v) => {
      if (v === "light" || v === "dark") setThemeState(v);
    });
  }, []);

  async function setTheme(t: Theme) {
    setThemeState(t);
    await AsyncStorage.setItem(THEME_KEY, t);
  }

  const isDark = theme === "dark";

  return {
    theme,
    isDark,
    setTheme,
    colors: {
      bg: isDark ? "#0a0a0a" : "#f5f5f5",
      card: isDark ? "#1a1a1a" : "#ffffff",
      border: isDark ? "#2a2a2a" : "#e0e0e0",
      text: isDark ? "#e0e0e0" : "#1a1a1a",
      textSecondary: isDark ? "#888888" : "#666666",
      accent: "#00ff41",
    },
  };
}
