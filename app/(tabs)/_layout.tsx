import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useTheme } from "../../providers/ThemeProvider";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === "ios" ? 90 : 70,
          elevation: 10,

          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },

        headerShown: false,

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Головна",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="exercises-tab"
        options={{
          title: "Вправи",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "fitness" : "fitness-outline"}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Прогрес",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "analytics" : "analytics-outline"}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Профіль",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
