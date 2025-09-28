import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/providers/ToastProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface ExerciseType {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  difficulty: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: string;
}

interface Category {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

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
  shadow: string;
}

const exerciseTypes: ExerciseType[] = [
  {
    id: "1",
    title: "Швидкий тест",
    description: "10 питань за 5 хвилин",
    duration: "5 хв",
    questions: 10,
    difficulty: "Змішано",
    icon: "flash",
    color: "#FF6B6B",
    category: "quick",
  },
  {
    id: "2",
    title: "Переклад слів",
    description: "Перекладіть слова з англійської",
    duration: "15 хв",
    questions: 20,
    difficulty: "Легко",
    icon: "language",
    color: "#4ECDC4",
    category: "vocabulary",
  },
  {
    id: "3",
    title: "Граматичні вправи",
    description: "Оберіть правильну граматичну форму",
    duration: "20 хв",
    questions: 15,
    difficulty: "Середньо",
    icon: "text",
    color: "#45B7D1",
    category: "grammar",
  },
  {
    id: "4",
    title: "Аудіювання",
    description: "Прослухайте та наберіть речення",
    duration: "25 хв",
    questions: 12,
    difficulty: "Складно",
    icon: "headset",
    color: "#96CEB4",
    category: "listening",
  },
  {
    id: "5",
    title: "Складання речень",
    description: "Перетягніть слова у правильному порядку",
    duration: "18 хв",
    questions: 10,
    difficulty: "Середньо",
    icon: "construct",
    color: "#FECA57",
    category: "construction",
  },
  {
    id: "6",
    title: "Повне тренування",
    description: "Комплексна перевірка всіх навичок",
    duration: "45 хв",
    questions: 40,
    difficulty: "Високий",
    icon: "fitness",
    color: "#FF9FF3",
    category: "comprehensive",
  },
];

const ExercisesScreen = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const styles = createStyles(theme);

  const openMenu = () => {
    showToast({
      type: "info",
      title: "Меню",
      message: "Оберіть дію:\n• Налаштування\n• Головна\n• Профіль",
      duration: 3000,
    });

    setTimeout(() => {
      router.push("/settings");
    }, 1000);
  };

  const handleHistoryPress = () => {
    showToast({
      type: "info",
      title: "Історія вправ",
      message: "Функція буде реалізована пізніше",
      duration: 3000,
    });
  };

  const handleExerciseLongPress = (exercise: ExerciseType) => {
    showToast({
      type: "warning",
      title: "Швидкий старт",
      message: `Одразу почати "${exercise.title}" без підтвердження?`,
      duration: 3000,
    });

    setTimeout(() => {
      startExercise(exercise);
    }, 500);
  };

  const handleExercisePress = (exercise: ExerciseType) => {
    showToast({
      type: "info",
      title: exercise.title,
      message: `${exercise.description}\n\nПитань: ${exercise.questions}\nЧас: ${exercise.duration}\nСкладність: ${exercise.difficulty}`,
      duration: 4000,
    });

    setTimeout(() => {
      startExercise(exercise);
    }, 1000);
  };

  const startExercise = (exercise: ExerciseType) => {
    console.log("Starting exercise:", exercise.title);

    showToast({
      type: "success",
      title: "Вправу розпочато!",
      message: `Починаємо "${exercise.title}"`,
      duration: 2000,
    });
  };

  const categories: Category[] = [
    { key: "all", title: "Всі", icon: "apps" },
    { key: "quick", title: "Швидкі", icon: "flash" },
    { key: "vocabulary", title: "Словник", icon: "book" },
    { key: "grammar", title: "Граматика", icon: "text" },
    { key: "listening", title: "Аудіо", icon: "headset" },
  ];

  const filteredExercises =
    selectedCategory === "all"
      ? exerciseTypes
      : exerciseTypes.filter(
          (exercise) => exercise.category === selectedCategory
        );

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Легко":
        return "#4ECDC4";
      case "Середньо":
        return "#FECA57";
      case "Складно":
      case "Високий":
        return "#FF6B6B";
      case "Змішано":
        return "#96CEB4";
      default:
        return theme.textSecondary;
    }
  };

  const renderExerciseCard = ({ item }: { item: ExerciseType }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => handleExercisePress(item)}
      onLongPress={() => handleExerciseLongPress(item)}
    >
      <View style={styles.exerciseHeader}>
        <View style={[styles.exerciseIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={28} color="#FFFFFF" />
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>{item.title}</Text>
          <Text style={styles.exerciseDescription}>{item.description}</Text>

          <View style={styles.exerciseMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color={theme.textSecondary} />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="help-circle"
                size={14}
                color={theme.textSecondary}
              />
              <Text style={styles.metaText}>{item.questions} питань</Text>
            </View>
          </View>
        </View>

        <View style={styles.difficultyContainer}>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(item.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: item.color }]}
        onPress={() => handleExercisePress(item)}
      >
        <Ionicons name="play" size={20} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Почати вправу</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Вправи</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={handleHistoryPress}
        >
          <Ionicons name="time" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color={theme.success} />
          <Text style={styles.statNumber}>87%</Text>
          <Text style={styles.statLabel}>Точність</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="timer" size={24} color={theme.primary} />
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Серія днів</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color={theme.warning} />
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Очки</Text>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Категорії:</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.key}
          renderItem={({ item }: { item: Category }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.key && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={selectedCategory === item.key ? "#FFFFFF" : theme.text}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item.key && { color: "#FFFFFF" },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.recommendedContainer}>
        <View style={styles.recommendedHeader}>
          <Ionicons name="star" size={20} color={theme.warning} />
          <Text style={styles.recommendedTitle}>Рекомендована вправа</Text>
        </View>
        <Text style={styles.recommendedText}>
          Спробуйте «Швидкий тест» для швидкої перевірки знань!
        </Text>
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
    },
    menuButton: {
      padding: 8,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
    },
    historyButton: {
      padding: 8,
    },
    statsContainer: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginBottom: 20,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginVertical: 4,
    },
    statLabel: {
      fontSize: 11,
      color: theme.textSecondary,
      textAlign: "center",
    },
    categoriesContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    categoriesTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 12,
    },
    categoriesList: {
      paddingRight: 20,
    },
    categoryButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeCategoryButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 6,
      color: theme.text,
    },
    recommendedContainer: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.warning,
    },
    recommendedHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    recommendedTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginLeft: 8,
    },
    recommendedText: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    exerciseCard: {
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
    exerciseHeader: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "flex-start",
    },
    exerciseIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    exerciseInfo: {
      flex: 1,
    },
    exerciseTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    exerciseDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    exerciseMeta: {
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
      fontWeight: "600",
    },
    difficultyContainer: {
      justifyContent: "flex-start",
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    difficultyText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    startButton: {
      flexDirection: "row",
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    startButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

export default ExercisesScreen;
