import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../providers/ThemeProvider";
import { useToast } from "../../providers/ToastProvider";

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

interface LearningCategory {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  difficulty: string;
  lessons: number;
  completed: number;
}

interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const ExploreScreen = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const styles = createStyles(theme);

  const learningCategories: LearningCategory[] = [
    {
      id: "1",
      title: "Словниковий запас",
      description: "Вивчайте нові слова кожен день",
      icon: "book",
      color: "#4ECDC4",
      route: "/vocabulary",
      difficulty: "easy",
      lessons: 45,
      completed: 23,
    },
    {
      id: "2",
      title: "Граматика",
      description: "Опануйте правила англійської мови",
      icon: "text",
      color: "#45B7D1",
      route: "/grammar",
      difficulty: "medium",
      lessons: 38,
      completed: 15,
    },
    {
      id: "3",
      title: "Розмовні фрази",
      description: "Корисні вирази для щоденного спілкування",
      icon: "chatbubbles",
      color: "#96CEB4",
      route: "/phrases",
      difficulty: "easy",
      lessons: 28,
      completed: 18,
    },
    {
      id: "4",
      title: "Вправи та тести",
      description: "Перевірте свої знання",
      icon: "fitness",
      color: "#FF6B6B",
      route: "/exercises",
      difficulty: "hard",
      lessons: 52,
      completed: 31,
    },
    {
      id: "5",
      title: "Аудіювання",
      description: "Покращуйте розуміння на слух",
      icon: "headset",
      color: "#FECA57",
      route: "/exercises",
      difficulty: "medium",
      lessons: 34,
      completed: 12,
    },
    {
      id: "6",
      title: "Досягнення",
      description: "Переглядайте свій прогрес",
      icon: "trophy",
      color: "#FF9FF3",
      route: "/achievements",
      difficulty: "easy",
      lessons: 0,
      completed: 0,
    },
  ];

  const featureCards: FeatureCard[] = [
    {
      id: "1",
      title: "Щоденний виклик",
      subtitle: "Новий кожен день",
      description: "Виконайте сьогоднішнє завдання та отримайте бонусні очки!",
      icon: "calendar",
      color: "#FF6B6B",
      route: "/exercises",
    },
    {
      id: "2",
      title: "Персоналізоване навчання",
      subtitle: "Адаптовано для вас",
      description: "ШІ аналізує ваш прогрес і пропонує найкращі завдання",
      icon: "bulb",
      color: "#9B59B6",
      route: "/exercises",
    },
  ];

  const difficultyFilters = [
    {
      key: "all",
      title: "Всі",
      icon: "apps" as keyof typeof Ionicons.glyphMap,
    },
    {
      key: "easy",
      title: "Легкі",
      icon: "leaf" as keyof typeof Ionicons.glyphMap,
    },
    {
      key: "medium",
      title: "Середні",
      icon: "flame" as keyof typeof Ionicons.glyphMap,
    },
    {
      key: "hard",
      title: "Складні",
      icon: "rocket" as keyof typeof Ionicons.glyphMap,
    },
  ];

  const handleCategoryPress = (category: LearningCategory) => {
    showToast({
      type: "info",
      title: category.title,
      message: `${category.description}\nУроків: ${category.lessons}\nВиконано: ${category.completed}`,
      duration: 3000,
    });

    setTimeout(() => {
      router.push(category.route as any);
    }, 1000);
  };

  const handleFeaturePress = (feature: FeatureCard) => {
    showToast({
      type: "info",
      title: feature.title,
      message: feature.description,
      duration: 3000,
    });

    setTimeout(() => {
      router.push(feature.route as any);
    }, 1000);
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#4ECDC4";
      case "medium":
        return "#FECA57";
      case "hard":
        return "#FF6B6B";
      default:
        return theme.textSecondary;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Легко";
      case "medium":
        return "Середньо";
      case "hard":
        return "Складно";
      default:
        return "";
    }
  };

  const filteredCategories =
    selectedDifficulty === "all"
      ? learningCategories
      : learningCategories.filter(
          (cat) => cat.difficulty === selectedDifficulty
        );

  const renderCategoryCard = ({ item }: { item: LearningCategory }) => {
    const progress = getProgressPercentage(item.completed, item.lessons);

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={28} color="#FFFFFF" />
          </View>

          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Text style={styles.categoryDescription}>{item.description}</Text>

            <View style={styles.categoryMeta}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="book-outline"
                  size={14}
                  color={theme.textSecondary}
                />
                <Text style={styles.metaText}>{item.lessons} уроків</Text>
              </View>

              {item.lessons > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={14}
                    color={theme.success}
                  />
                  <Text style={styles.metaText}>{item.completed} виконано</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.difficultyBadge}>
            <View
              style={[
                styles.difficultyIndicator,
                { backgroundColor: getDifficultyColor(item.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>
                {getDifficultyText(item.difficulty)}
              </Text>
            </View>
          </View>
        </View>

        {item.lessons > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Прогрес: {progress}%</Text>
              <Text style={styles.progressSubtext}>
                {item.completed} з {item.lessons}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progress}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFeatureCard = ({ item }: { item: FeatureCard }) => (
    <TouchableOpacity
      style={[styles.featureCard, { backgroundColor: item.color }]}
      onPress={() => handleFeaturePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.featureIcon}>
        <Ionicons name={item.icon} size={32} color="#FFFFFF" />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Навчання 📚</Text>
          <Text style={styles.headerSubtitle}>
            Оберіть розділ для вивчення англійської мови
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Рекомендовано</Text>
          <FlatList
            horizontal
            data={featureCards}
            renderItem={renderFeatureCard}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuresContent}
          />
        </View>

        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Рівень складності</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {difficultyFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedDifficulty === filter.key &&
                    styles.activeFilterButton,
                ]}
                onPress={() => setSelectedDifficulty(filter.key)}
              >
                <Ionicons
                  name={filter.icon}
                  size={18}
                  color={
                    selectedDifficulty === filter.key ? "#FFFFFF" : theme.text
                  }
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedDifficulty === filter.key && { color: "#FFFFFF" },
                  ]}
                >
                  {filter.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>
            Розділи навчання ({filteredCategories.length})
          </Text>
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesContent}
          />
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
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    featuresContainer: {
      paddingVertical: 25,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
      paddingHorizontal: 20,
    },
    featuresContent: {
      paddingLeft: 20,
      paddingRight: 10,
    },
    featureCard: {
      flexDirection: "row",
      alignItems: "center",
      width: width * 0.85,
      borderRadius: 16,
      padding: 20,
      marginRight: 15,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 8,
    },
    featureIcon: {
      marginRight: 15,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    featureSubtitle: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
      marginBottom: 8,
    },
    featureDescription: {
      fontSize: 13,
      color: "rgba(255, 255, 255, 0.9)",
      lineHeight: 18,
    },
    filtersContainer: {
      paddingVertical: 20,
    },
    filtersContent: {
      paddingHorizontal: 20,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 25,
      marginRight: 12,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeFilterButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 8,
      color: theme.text,
    },
    categoriesContainer: {
      paddingBottom: 25,
    },
    categoriesContent: {
      paddingHorizontal: 20,
    },
    categoryCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      marginBottom: 16,
      padding: 20,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    categoryHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 15,
    },
    categoryIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 6,
    },
    categoryDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    categoryMeta: {
      flexDirection: "row",
      gap: 16,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    difficultyBadge: {
      alignItems: "flex-end",
    },
    difficultyIndicator: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 15,
    },
    difficultyText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    progressContainer: {
      marginTop: 10,
    },
    progressInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    progressSubtext: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.surface,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      borderRadius: 4,
    },
    bottomSpacer: {
      height: 20,
    },
  });

export default ExploreScreen;
