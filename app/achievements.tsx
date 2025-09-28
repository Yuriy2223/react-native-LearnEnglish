import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/providers/ToastProvider";
import { useUser } from "@/providers/UserProvider";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

type AchievementCategory =
  | "vocabulary"
  | "phrases"
  | "grammar"
  | "exercises"
  | "streak";
type CategoryFilter = "all" | AchievementCategory;

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: AchievementCategory;
  points: number;
}

interface Category {
  key: CategoryFilter;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Navigation {
  dispatch: (action: any) => void;
}

const achievementsData: Achievement[] = [
  {
    id: "1",
    title: "Перші кроки",
    description: "Вивчіть перші 10 слів",
    progress: 24,
    target: 10,
    completed: true,
    icon: "rocket-outline",
    color: "#4ECDC4",
    category: "vocabulary",
    points: 50,
  },
  {
    id: "2",
    title: "Книголюб",
    description: "Вивчіть 100 слів",
    progress: 67,
    target: 100,
    completed: false,
    icon: "library-outline",
    color: "#45B7D1",
    category: "vocabulary",
    points: 200,
  },
  {
    id: "3",
    title: "Граматист",
    description: "Завершіть 5 тем граматики",
    progress: 1,
    target: 5,
    completed: false,
    icon: "create-outline",
    color: "#FECA57",
    category: "grammar",
    points: 150,
  },
  {
    id: "4",
    title: "Розмовник",
    description: "Вивчіть 50 фраз",
    progress: 35,
    target: 50,
    completed: false,
    icon: "chatbubble-outline",
    color: "#96CEB4",
    category: "phrases",
    points: 100,
  },
  {
    id: "5",
    title: "Тижневий воїн",
    description: "Навчайтесь 7 днів підряд",
    progress: 7,
    target: 7,
    completed: true,
    icon: "flame-outline",
    color: "#FF6B6B",
    category: "streak",
    points: 100,
  },
  {
    id: "6",
    title: "Швидкий учень",
    description: "Пройдіть 20 швидких тестів",
    progress: 13,
    target: 20,
    completed: false,
    icon: "flash-outline",
    color: "#FF9FF3",
    category: "exercises",
    points: 120,
  },
];

const AchievementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { studySession } = useUser();
  const navigation = useNavigation<Navigation>();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");

  const styles = createStyles(theme);

  const openDrawer = (): void => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const categories: Category[] = [
    { key: "all", title: "Всі", icon: "grid-outline" },
    { key: "vocabulary", title: "Словник", icon: "book-outline" },
    { key: "phrases", title: "Фрази", icon: "chatbubble-outline" },
    { key: "grammar", title: "Граматика", icon: "create-outline" },
    { key: "exercises", title: "Вправи", icon: "help-circle-outline" },
    { key: "streak", title: "Серії", icon: "flame-outline" },
  ];

  const filteredAchievements: Achievement[] =
    selectedCategory === "all"
      ? achievementsData
      : achievementsData.filter(
          (achievement) => achievement.category === selectedCategory
        );

  const completedAchievements = achievementsData.filter((a) => a.completed);
  const totalPoints = completedAchievements.reduce(
    (sum, a) => sum + a.points,
    0
  );

  const handleShare = async (): Promise<void> => {
    try {
      const message = `🎉 Мої досягнення у вивченні мови!\n\n✅ Завершено: ${
        completedAchievements.length
      }/${achievementsData.length}\n🏆 Очки: ${totalPoints}\n📚 Слів вивчено: ${
        studySession?.wordsLearned || 0
      }\n💬 Фраз вивчено: ${
        studySession?.phrasesLearned || 0
      }\n\nПриєднуйтесь до навчання! 📱`;

      await Share.share({
        message: message,
      });

      showToast({
        type: "success",
        title: "Поділилися успішно!",
        message: "Ваші досягнення надіслано",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      showToast({
        type: "error",
        title: "Помилка ділення",
        message: "Не вдалося поділитися досягненнями",
        duration: 3000,
      });
    }
  };

  const handleAchievementPress = (item: Achievement): void => {
    if (item.completed) {
      showToast({
        type: "success",
        title: "🎉 Досягнення розблоковане!",
        message: `${item.title}\n${item.description}\n\n+${item.points} очок`,
        duration: 4000,
      });
    } else {
      showToast({
        type: "info",
        title: "Досягнення заблоковане",
        message: `${item.title}\nПрогрес: ${item.progress}/${
          item.target
        }\nЗалишилося: ${item.target - item.progress}`,
        duration: 4000,
      });
    }
  };

  const renderAchievementCard: ListRenderItem<Achievement> = ({ item }) => (
    <TouchableOpacity
      style={[styles.achievementCard, item.completed && styles.completedCard]}
      onPress={() => handleAchievementPress(item)}
    >
      <View style={styles.achievementHeader}>
        <View
          style={[
            styles.achievementIcon,
            { backgroundColor: item.completed ? item.color : theme.surface },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={28}
            color={item.completed ? "#FFFFFF" : theme.textSecondary}
          />
          {item.completed && (
            <View style={styles.completedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.success}
              />
            </View>
          )}
        </View>

        <View style={styles.achievementInfo}>
          <Text
            style={[
              styles.achievementTitle,
              !item.completed && styles.lockedTitle,
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>

          <View style={styles.achievementMeta}>
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={14} color={theme.warning} />
              <Text style={styles.pointsText}>+{item.points} очок</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Прогрес: {item.progress}/{item.target}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round((item.progress / item.target) * 100)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min((item.progress / item.target) * 100, 100)}%`,
                backgroundColor: item.completed
                  ? item.color
                  : theme.textSecondary,
              },
            ]}
          />
        </View>

        {!item.completed && (
          <Text style={styles.remainingText}>
            Залишилося: {item.target - item.progress}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategory: ListRenderItem<Category> = ({ item }) => (
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
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Досягнення</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.mainStatCard}>
          <View style={styles.mainStatHeader}>
            <Ionicons name="trophy-outline" size={32} color={theme.warning} />
            <View style={styles.mainStatInfo}>
              <Text style={styles.mainStatNumber}>{totalPoints}</Text>
              <Text style={styles.mainStatLabel}>Очок зароблено</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {completedAchievements.length}
              </Text>
              <Text style={styles.statLabel}>Завершено</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {achievementsData.length - completedAchievements.length}
              </Text>
              <Text style={styles.statLabel}>В процесі</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round(
                  (completedAchievements.length / achievementsData.length) * 100
                )}
                %
              </Text>
              <Text style={styles.statLabel}>Прогрес</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.key}
          renderItem={renderCategory}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.motivationContainer}>
        <Ionicons name="bulb-outline" size={24} color={theme.primary} />
        <Text style={styles.motivationText}>
          Продовжуйте навчання, щоб розблокувати нові досягнення! 🚀
        </Text>
      </View>

      <FlatList
        data={filteredAchievements}
        renderItem={renderAchievementCard}
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
    shareButton: {
      padding: 8,
    },
    statsContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    mainStatCard: {
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
      elevation: 5,
    },
    mainStatHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    mainStatInfo: {
      marginLeft: 16,
    },
    mainStatNumber: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
    },
    mainStatLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statNumber: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "center",
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: theme.border,
      marginHorizontal: 16,
    },
    categoriesContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
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
    motivationContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    motivationText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      marginLeft: 12,
      lineHeight: 20,
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    achievementCard: {
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
      opacity: 0.7,
    },
    completedCard: {
      opacity: 1,
      borderWidth: 2,
      borderColor: theme.success,
    },
    achievementHeader: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "flex-start",
    },
    achievementIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      position: "relative",
    },
    completedBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: theme.card,
      borderRadius: 10,
      padding: 2,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    lockedTitle: {
      color: theme.textSecondary,
    },
    achievementDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
    achievementMeta: {
      flexDirection: "row",
      alignItems: "center",
    },
    pointsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    pointsText: {
      fontSize: 12,
      color: theme.warning,
      fontWeight: "600",
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
      marginBottom: 8,
    },
    progressFill: {
      height: "100%",
      borderRadius: 3,
    },
    remainingText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "center",
    },
  });

export default AchievementsScreen;
