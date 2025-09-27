import { loginSchema } from "@/validation/validation";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "./provider/ThemeProvider";
import { useToast } from "./provider/ToastProvider";
import { useUser } from "./provider/UserProvider";

interface Navigation {
  navigate: (screen: string, params?: any) => void;
}

interface LoginScreenProps {
  navigation: Navigation;
}

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useUser();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const styles = createStyles(theme);

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsLoading(true);

    try {
      //  API виклик для авторизації
      //  імітуємо успішний вхід
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = {
        id: "1",
        name: "Користувач",
        email: data.email,
        avatar: null,
      };

      await login(userData, "mock-token-123");

      showToast({
        type: "success",
        title: "Успішний вхід!",
        message: "Ласкаво просимо назад",
        duration: 2500,
      });
    } catch (error) {
      console.log("Login error:", error);
      showToast({
        type: "error",
        title: "Помилка входу",
        message: "Не вдалося увійти. Перевірте дані та спробуйте ще раз.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (): void => {
    showToast({
      type: "info",
      title: "Google вхід",
      message: "Функція буде реалізована пізніше",
      duration: 3000,
    });
  };

  const handleAppleLogin = (): void => {
    showToast({
      type: "info",
      title: "Apple вхід",
      message: "Функція буде реалізована пізніше",
      duration: 3000,
    });
  };

  const handleForgotPassword = (): void => {
    showToast({
      type: "info",
      title: "Відновлення паролю",
      message: "Функція буде реалізована пізніше",
      duration: 3000,
    });
  };

  const renderInput = (
    name: keyof FormData,
    placeholder: string,
    icon: keyof typeof Ionicons.glyphMap,
    secureTextEntry?: boolean,
    keyboardType?: "default" | "email-address",
    showPasswordToggle?: boolean
  ) => (
    <View style={styles.inputGroup}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={[
              styles.inputContainer,
              errors[name] && styles.inputContainerError,
            ]}
          >
            <Ionicons
              name={icon}
              size={20}
              color={errors[name] ? theme.error : theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={secureTextEntry && !showPassword}
              keyboardType={keyboardType || "default"}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {showPasswordToggle && (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {errors[name] && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle"
            size={16}
            color={theme.error}
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{errors[name]?.message}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="school-outline" size={60} color={theme.primary} />
            </View>
            <Text style={styles.appTitle}>Language Learning</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Вхід</Text>

            {renderInput(
              "email",
              "Email",
              "mail-outline",
              false,
              "email-address"
            )}

            {renderInput(
              "password",
              "Пароль",
              "lock-closed-outline",
              true,
              "default",
              true
            )}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Входжу..." : "Увійти"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Забули пароль?</Text>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
              <Text style={styles.orText}>або</Text>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text style={styles.socialButtonText}>Увійти через Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleLogin}
              >
                <Ionicons name="logo-apple" size={24} color="#000000" />
                <Text style={styles.socialButtonText}>Увійти через Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerContainer}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerText}>
                Немає акаунту?{" "}
                <Text style={styles.registerLink}>Створити акаунт</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logoPlaceholder: {
      width: 100,
      height: 100,
      backgroundColor: theme.surface,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    appTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primary,
    },
    formContainer: {
      width: "100%",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 32,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.border || "transparent",
    },
    inputContainerError: {
      borderColor: theme.error,
      backgroundColor: theme.error + "10",
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      paddingVertical: 12,
    },
    eyeIcon: {
      padding: 4,
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      paddingHorizontal: 16,
    },
    errorIcon: {
      marginRight: 6,
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      flex: 1,
    },
    loginButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 16,
    },
    disabledButton: {
      opacity: 0.6,
    },
    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    forgotPassword: {
      color: theme.primary,
      textAlign: "center",
      fontSize: 14,
      marginBottom: 32,
    },
    socialContainer: {
      alignItems: "center",
    },
    orText: {
      color: theme.textSecondary,
      fontSize: 14,
      marginBottom: 16,
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginBottom: 12,
      width: "100%",
      justifyContent: "center",
    },
    socialButtonText: {
      color: theme.text,
      fontSize: 16,
      marginLeft: 12,
    },
    registerContainer: {
      marginTop: 32,
      alignItems: "center",
    },
    registerText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    registerLink: {
      color: theme.primary,
      fontWeight: "600",
    },
  });

export default LoginScreen;
