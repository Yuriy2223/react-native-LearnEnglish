import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  card: string;
  shadow: string;
}

export const lightTheme: Theme = {
  primary: "#007AFF",
  secondary: "#5856D6",
  background: "#FFFFFF",
  surface: "#F2F2F7",
  text: "#000000",
  textSecondary: "#666666",
  border: "#E5E5EA",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  card: "#FFFFFF",
  shadow: "#000000",
};

export const darkTheme: Theme = {
  primary: "#0A84FF",
  secondary: "#5E5CE6",
  background: "#000000",
  surface: "#1C1C1E",
  text: "#FFFFFF",
  textSecondary: "#99999D",
  border: "#38383A",
  success: "#30D158",
  warning: "#FF9F0A",
  error: "#FF453A",
  card: "#1C1C1E",
  shadow: "#FFFFFF",
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("isDarkMode");
        const darkMode = savedTheme ? JSON.parse(savedTheme) : false;
        setIsDarkMode(darkMode);
        setTheme(darkMode ? darkTheme : lightTheme);
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    setTheme(newThemeValue ? darkTheme : lightTheme);
    try {
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(newThemeValue));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
