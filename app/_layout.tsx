import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ThemeProvider } from "../providers/ThemeProvider";
import { ToastProvider } from "../providers/ToastProvider";
import { UserProvider } from "../providers/UserProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      console.log("User token:", userToken ? "exists" : "not found");
      setIsLoggedIn(!!userToken);
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);

      await SplashScreen.hideAsync();
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <>
                <Stack.Screen
                  name="login"
                  options={{
                    title: "Вхід",
                    presentation: "card",
                  }}
                />
                <Stack.Screen
                  name="register"
                  options={{
                    title: "Реєстрація",
                    presentation: "card",
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="exercises"
                  options={{
                    title: "Вправи",
                    presentation: "card",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="achievements"
                  options={{
                    title: "Досягнення",
                    presentation: "card",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="settings"
                  options={{
                    title: "Налаштування",
                    presentation: "card",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="grammar"
                  options={{
                    title: "Граматика",
                    presentation: "card",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{
                    title: "Модальне вікно",
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="phrases"
                  options={{
                    title: "Фрази",
                    presentation: "card",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="vocabulary"
                  options={{
                    title: "Словник",
                    presentation: "card",
                    headerShown: true,
                  }}
                />
              </>
            )}
          </Stack>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
