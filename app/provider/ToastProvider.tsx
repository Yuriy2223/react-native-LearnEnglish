import { lightTheme, Theme } from "@/app/provider/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ToastConfig {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  position?: "top" | "bottom";
}

interface ToastContextType {
  showToast: (config: Omit<ToastConfig, "id">) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

const Toast: React.FC<{
  toast: ToastConfig;
  onHide: (id: string) => void;
  theme: Theme;
}> = ({ toast, onHide, theme }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onHide(toast.id));
  }, [fadeAnim, slideAnim, onHide, toast.id]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      hideToast();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim, hideToast, toast.duration]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          backgroundColor: theme.success,
          iconName: "checkmark-circle" as const,
        };
      case "error":
        return {
          backgroundColor: theme.error,
          iconName: "alert-circle" as const,
        };
      case "warning":
        return {
          backgroundColor: theme.warning,
          iconName: "warning" as const,
        };
      case "info":
        return {
          backgroundColor: theme.primary,
          iconName: "information-circle" as const,
        };
    }
  };

  const toastStyles = getToastStyles();

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: toastStyles.backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        toast.position === "bottom" && styles.bottomPosition,
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={hideToast}
        activeOpacity={0.9}
      >
        <Ionicons
          name={toastStyles.iconName}
          size={24}
          color="white"
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message && <Text style={styles.message}>{toast.message}</Text>}
        </View>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastProvider: React.FC<{
  children: ReactNode;
  theme?: Theme;
}> = ({ children, theme = lightTheme }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback((config: Omit<ToastConfig, "id">) => {
    const id = Date.now().toString();
    const newToast: ToastConfig = {
      ...config,
      id,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <View style={styles.toastWrapper}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onHide={hideToast}
            theme={theme}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: "box-none",
  },
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomPosition: {
    top: "auto",
    bottom: 50,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
