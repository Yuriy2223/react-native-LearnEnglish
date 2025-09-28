import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../providers/ThemeProvider";
import { useToast } from "../../providers/ToastProvider";
import { useUser } from "../../providers/UserProvider";

const { width } = Dimensions.get("window");

interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  card: string;
  surface: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

interface LearningStats {
  accuracy: number;
  streak: number;
  points: number;
  completedToday: number;
}

const HomeScreen = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { user } = useUser();
  const [stats] = useState<LearningStats>({
    accuracy: 87,
    streak: 24,
    points: 1240,
    completedToday: 3,
  });

  const styles = createStyles(theme);

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Швидкий тест",
      description: "5-хвилинна перевірка",
      icon: "flash",
      color: "#FF6B6B",
      route: "/exercises",
    },
    {
      id: "2",
      title: "Словник",
      description: "Нові слова",
      icon: "book",
      color: "#4ECDC4",
      route: "/vocabulary",
    },
    {
      id: "3",
      title: "Граматика",
      description: "Правила та вправи",
      icon: "text",
      color: "#45B7D1",
      route: "/grammar",
    },
    {
      id: "4",
      title: "Фрази",
      description: "Корисні вирази",
      icon: "chatbubbles",
      color: "#96CEB4",
      route: "/phrases",
    },
  ];

  const handleQuickAction = (action: QuickAction) => {
    showToast({
      type: "info",
      title: action.title,
      message: `Переходимо до ${action.title.toLowerCase()}...`,
      duration: 2000,
    });

    setTimeout(() => {
      router.push(action.route as any);
    }, 500);
  };

  const handleViewProgress = () => {
    showToast({
      type: "info",
      title: "Прогрес",
      message: "Детальна статистика вашого навчання",
      duration: 3000,
    });

    setTimeout(() => {
      router.push("/achievements");
    }, 1000);
  };

  const getDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Доброго ранку";
    if (hour < 17) return "Добрий день";
    return "Доброго вечора";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Продовжуйте вивчати! У вас чудово виходить! 🌟",
      "Кожен день - це новий крок до мети! 💪",
      "Ваш прогрес вражає! Так тримати! 🚀",
      "Знання - це сила! Ви на правильному шляху! 📚",
      "Сьогодні чудовий день для навчання! ✨",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {getDayGreeting()}, {user?.name || "Користувач"}! 👋
            </Text>
            <Text style={styles.motivationalText}>
              {getMotivationalMessage()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="person-circle" size={40} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Ваша статистика сьогодні</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={28} color={theme.success} />
              <Text style={styles.statNumber}>{stats.accuracy}%</Text>
              <Text style={styles.statLabel}>Точність</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="flame" size={28} color={theme.warning} />
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Серія днів</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trophy" size={28} color="#FFD700" />
              <Text style={styles.statNumber}>{stats.points}</Text>
              <Text style={styles.statLabel}>Очки</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={theme.primary}
              />
              <Text style={styles.statNumber}>{stats.completedToday}</Text>
              <Text style={styles.statLabel}>Завершено</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.progressButton}
            onPress={handleViewProgress}
          >
            <Text style={styles.progressButtonText}>
              Переглянути детальний прогрес
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Почати навчання</Text>

          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: action.color }]}
                >
                  <Ionicons name={action.icon} size={32} color="#FFFFFF" />
                </View>

                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>
                    {action.description}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.recommendationContainer}>
          <View style={styles.recommendationHeader}>
            <Ionicons name="bulb" size={24} color={theme.warning} />
            <Text style={styles.recommendationTitle}>Рекомендація дня</Text>
          </View>

          <Text style={styles.recommendationText}>
            Спробуйте вивчити 5 нових слів сьогодні. Дослідження показують, що
            регулярне поповнення словника на 5-10 слів щодня значно покращує
            розуміння мови!
          </Text>

          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => handleQuickAction(quickActions[1])}
          >
            <Text style={styles.recommendationButtonText}>Почати зараз</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    greetingContainer: {
      flex: 1,
      marginRight: 15,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
      lineHeight: 28,
    },
    motivationalText: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    profileButton: {
      padding: 5,
    },
    statsContainer: {
      paddingHorizontal: 20,
      paddingVertical: 25,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      minWidth: (width - 60) / 2,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginVertical: 8,
    },
    statLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    progressButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    progressButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.primary,
      marginRight: 8,
    },
    quickActionsContainer: {
      paddingHorizontal: 20,
      paddingVertical: 25,
    },
    quickActionsGrid: {
      gap: 15,
    },
    actionCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    actionIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    actionInfo: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    actionDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    recommendationContainer: {
      backgroundColor: theme.card,
      borderRadius: 16,
      marginHorizontal: 20,
      padding: 20,
      marginBottom: 25,
      borderLeftWidth: 4,
      borderLeftColor: theme.warning,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    recommendationHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    recommendationTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginLeft: 10,
    },
    recommendationText: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 20,
    },
    recommendationButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    recommendationButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    bottomSpacer: {
      height: 20,
    },
  });

export default HomeScreen;
