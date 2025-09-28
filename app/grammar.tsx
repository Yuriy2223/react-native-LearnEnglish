import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/providers/ToastProvider";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

type ProgressStatus = "completed" | "in-progress" | "not-started";
type DifficultyLevel = "Легко" | "Середньо" | "Складно";
type FilterKey = "all" | "easy" | "medium" | "hard";

interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  difficultyColor: string;
  progress: ProgressStatus;
  exercises: number;
  completedExercises: number;
  icon: keyof typeof Ionicons.glyphMap;
}

interface FilterButton {
  key: FilterKey;
  title: string;
  color: string;
}

interface Navigation {
  dispatch: (action: any) => void;
}

const grammarTopics: GrammarTopic[] = [
  {
    id: "1",
    title: "Present Simple",
    description: "Простий теперішній час для регулярних дій",
    difficulty: "Легко",
    difficultyColor: "#4ECDC4",
    progress: "completed",
    exercises: 15,
    completedExercises: 15,
    icon: "time-outline",
  },
  {
    id: "2",
    title: "Past Simple",
    description: "Простий минулий час для завершених дій",
    difficulty: "Легко",
    difficultyColor: "#4ECDC4",
    progress: "in-progress",
    exercises: 20,
    completedExercises: 12,
    icon: "hourglass-outline",
  },
  {
    id: "3",
    title: "Future Simple",
    description: "Простий майбутній час для майбутніх дій",
    difficulty: "Легко",
    difficultyColor: "#4ECDC4",
    progress: "not-started",
    exercises: 18,
    completedExercises: 0,
    icon: "trending-up",
  },
  {
    id: "4",
    title: "Present Continuous",
    description: "Теперішній тривалий час для поточних дій",
    difficulty: "Середньо",
    difficultyColor: "#FECA57",
    progress: "in-progress",
    exercises: 25,
    completedExercises: 8,
    icon: "refresh-outline",
  },
  {
    id: "5",
    title: "Present Perfect",
    description: "Теперішній досконалий час для результату",
    difficulty: "Складно",
    difficultyColor: "#FF6B6B",
    progress: "not-started",
    exercises: 30,
    completedExercises: 0,
    icon: "checkmark-circle-outline",
  },
  {
    id: "6",
    title: "Modal Verbs",
    description: "Модальні дієслова: can, must, should, may",
    difficulty: "Середньо",
    difficultyColor: "#FECA57",
    progress: "not-started",
    exercises: 22,
    completedExercises: 0,
    icon: "help-circle-outline",
  },
];

const GrammarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigation = useNavigation<Navigation>();
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<FilterKey>("all");

  const styles = createStyles(theme);

  const openDrawer = (): void => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleTopicPress = (topic: GrammarTopic): void => {
    showToast({
      type: "info",
      title: topic.title,
      message: `${topic.description}\n\nВправи: ${topic.completedExercises}/${topic.exercises}`,
      duration: 4000,
    });

    setTimeout(() => {
      showToast({
        type: "success",
        title: "Розпочинаємо навчання",
        message: `Відкриваємо урок "${topic.title}"`,
        duration: 3000,
      });
      console.log("Start learning:", topic.title);
    }, 1000);
  };

  const handleTestPress = (topic: GrammarTopic): void => {
    showToast({
      type: "info",
      title: "Тест",
      message: `Пройти тест з теми "${topic.title}"?`,
      duration: 3000,
    });

    setTimeout(() => {
      showToast({
        type: "success",
        title: "Запускаємо тест",
        message: `Готуйтеся до тестування з "${topic.title}"`,
        duration: 3000,
      });
    }, 1000);
  };

  const handleInfoPress = (): void => {
    showToast({
      type: "info",
      title: "Інформація про граматику",
      message: "Тут ви знайдете всі основні граматичні теми англійської мови",
      duration: 4000,
    });
  };

  const getProgressColor = (progress: ProgressStatus): string => {
    switch (progress) {
      case "completed":
        return theme.success;
      case "in-progress":
        return theme.warning;
      case "not-started":
        return theme.textSecondary;
      default:
        return theme.textSecondary;
    }
  };

  const getProgressIcon = (
    progress: ProgressStatus
  ): keyof typeof Ionicons.glyphMap => {
    switch (progress) {
      case "completed":
        return "checkmark-circle";
      case "in-progress":
        return "play-circle";
      case "not-started":
        return "radio-button-off";
      default:
        return "radio-button-off";
    }
  };

  const getProgressText = (progress: ProgressStatus): string => {
    switch (progress) {
      case "completed":
        return "Завершено";
      case "in-progress":
        return "В процесі";
      case "not-started":
        return "Не розпочато";
      default:
        return "Не розпочато";
    }
  };

  const filterButtons: FilterButton[] = [
    { key: "all", title: "Всі", color: theme.text },
    { key: "easy", title: "Легко", color: "#4ECDC4" },
    { key: "medium", title: "Середньо", color: "#FECA57" },
    { key: "hard", title: "Складно", color: "#FF6B6B" },
  ];

  const filteredTopics: GrammarTopic[] =
    selectedDifficulty === "all"
      ? grammarTopics
      : grammarTopics.filter((topic) => {
          if (selectedDifficulty === "easy")
            return topic.difficulty === "Легко";
          if (selectedDifficulty === "medium")
            return topic.difficulty === "Середньо";
          if (selectedDifficulty === "hard")
            return topic.difficulty === "Складно";
          return true;
        });

  const renderTopicCard: ListRenderItem<GrammarTopic> = ({ item }) => (
    <TouchableOpacity
      style={styles.topicCard}
      onPress={() => handleTopicPress(item)}
    >
      <View style={styles.topicHeader}>
        <View style={styles.topicIconContainer}>
          <Ionicons name={item.icon} size={28} color={theme.primary} />
        </View>

        <View style={styles.topicInfo}>
          <Text style={styles.topicTitle}>{item.title}</Text>
          <Text style={styles.topicDescription}>{item.description}</Text>

          <View style={styles.topicMeta}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: item.difficultyColor },
              ]}
            >
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>

            <View style={styles.exercisesInfo}>
              <Ionicons
                name="help-circle-outline"
                size={14}
                color={theme.textSecondary}
              />
              <Text style={styles.exercisesText}>
                {item.completedExercises}/{item.exercises}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressIndicator}>
          <Ionicons
            name={getProgressIcon(item.progress)}
            size={24}
            color={getProgressColor(item.progress)}
          />
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {getProgressText(item.progress)}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round((item.completedExercises / item.exercises) * 100)}%
          </Text>
        </View>

        {item.exercises > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    (item.completedExercises / item.exercises) * 100,
                    100
                  )}%`,
                  backgroundColor: getProgressColor(item.progress),
                },
              ]}
            />
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.studyButton]}
            onPress={() => handleTopicPress(item)}
          >
            <Ionicons name="school-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              {item.progress === "not-started" ? "Почати" : "Продовжити"}
            </Text>
          </TouchableOpacity>

          {item.completedExercises > 0 && (
            <TouchableOpacity
              style={[styles.actionButton, styles.testButton]}
              onPress={() => handleTestPress(item)}
            >
              <Ionicons
                name="help-circle-outline"
                size={16}
                color={theme.primary}
              />
              <Text style={[styles.actionButtonText, { color: theme.primary }]}>
                Тест
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Граматика</Text>
        <TouchableOpacity style={styles.infoButton} onPress={handleInfoPress}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          <Text style={styles.statNumber}>
            {grammarTopics.filter((t) => t.progress === "completed").length}
          </Text>
          <Text style={styles.statLabel}>Завершено</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="play-circle" size={24} color={theme.warning} />
          <Text style={styles.statNumber}>
            {grammarTopics.filter((t) => t.progress === "in-progress").length}
          </Text>
          <Text style={styles.statLabel}>В процесі</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons
            name="help-circle-outline"
            size={24}
            color={theme.primary}
          />
          <Text style={styles.statNumber}>
            {grammarTopics.reduce(
              (sum, topic) => sum + topic.completedExercises,
              0
            )}
          </Text>
          <Text style={styles.statLabel}>Вправ зроблено</Text>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Рівень складності:</Text>
        <View style={styles.filtersRow}>
          {filterButtons.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedDifficulty === filter.key && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedDifficulty(filter.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === filter.key && { color: "#FFFFFF" },
                  selectedDifficulty !== filter.key && { color: filter.color },
                ]}
              >
                {filter.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTopics}
        renderItem={renderTopicCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
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
    infoButton: {
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
    filtersContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    filtersTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 12,
    },
    filtersRow: {
      flexDirection: "row",
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    activeFilterButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    topicCard: {
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
    topicHeader: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "flex-start",
    },
    topicIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    topicInfo: {
      flex: 1,
    },
    topicTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    topicDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    topicMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    exercisesInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    exercisesText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "600",
    },
    progressIndicator: {
      marginLeft: 8,
    },
    progressSection: {
      marginTop: 8,
    },
    progressInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: "600",
    },
    progressPercent: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.surface,
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 16,
    },
    progressFill: {
      height: "100%",
      borderRadius: 3,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    studyButton: {
      backgroundColor: theme.primary,
    },
    testButton: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 4,
      color: "#FFFFFF",
    },
  });

export default GrammarScreen;
