import { registerSchema } from "@/validation/validation";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
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
  goBack: () => void;
  navigate: (screen: string, params?: any) => void;
}

interface RegisterScreenProps {
  navigation: Navigation;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useUser();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const styles = createStyles(theme);

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
      };

      await login(userData, `token-${Date.now()}`);

      showToast({
        type: "success",
        title: "Успіх!",
        message: "Акаунт успішно створено",
        duration: 3000,
      });

      reset();
      navigation.navigate("Home");
    } catch (registrationError) {
      console.log("Registration error:", registrationError);

      showToast({
        type: "error",
        title: "Помилка",
        message: "Не вдалося створити акаунт. Спробуйте ще раз.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    name: keyof FormData,
    placeholder: string,
    icon: keyof typeof Ionicons.glyphMap,
    secureTextEntry: boolean = false,
    showPasswordState?: boolean,
    togglePasswordVisibility?: () => void
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
              secureTextEntry={secureTextEntry && !showPasswordState}
              autoCapitalize={name === "name" ? "words" : "none"}
              autoCorrect={false}
              keyboardType={name === "email" ? "email-address" : "default"}
            />
            {togglePasswordVisibility && (
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPasswordState ? "eye" : "eye-off"}
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Створити акаунт</Text>
          </View>

          <View style={styles.formContainer}>
            {renderInput("name", "Ім'я", "person-outline")}

            {renderInput("email", "Email", "mail-outline")}

            {renderInput(
              "password",
              "Пароль",
              "lock-closed-outline",
              true,
              showPassword,
              () => setShowPassword(!showPassword)
            )}

            {renderInput(
              "confirmPassword",
              "Підтвердити пароль",
              "lock-closed-outline",
              true,
              showConfirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword)
            )}

            <TouchableOpacity
              style={[
                styles.registerButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? "Створюю акаунт..." : "Створити акаунт"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              Створюючи акаунт, ви погоджуєтеся з{" "}
              <Text style={styles.termsLink}>Умовами використання</Text> та{" "}
              <Text style={styles.termsLink}>Політикою конфіденційності</Text>
            </Text>

            <TouchableOpacity
              style={styles.loginContainer}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginText}>
                Вже маєте акаунт? <Text style={styles.loginLink}>Увійти</Text>
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
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 40,
      marginTop: 20,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
    formContainer: {
      flex: 1,
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
      borderColor: theme.border,
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
    registerButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 24,
    },
    disabledButton: {
      opacity: 0.6,
    },
    registerButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    termsText: {
      color: theme.textSecondary,
      fontSize: 12,
      textAlign: "center",
      lineHeight: 18,
      marginBottom: 32,
    },
    termsLink: {
      color: theme.primary,
      fontWeight: "600",
    },
    loginContainer: {
      alignItems: "center",
    },
    loginText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    loginLink: {
      color: theme.primary,
      fontWeight: "600",
    },
  });

export default RegisterScreen;
