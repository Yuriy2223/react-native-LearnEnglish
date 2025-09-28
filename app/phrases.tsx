import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PhrasesTopic {
  id: string;
  title: string;
  description: string;
  phrasesCount: number;
  progress: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Navigation {
  dispatch: (action: any) => void;
}

const phrasesTopics: PhrasesTopic[] = [
  {
    id: "1",
    title: "Привітання та знайомство",
    description: "Базові фрази для знайомства",
    phrasesCount: 25,
    progress: 15,
    color: "#FF6B6B",
    icon: "hand-left-outline",
  },
  {
    id: "2",
    title: "В ресторані",
    description: "Замовлення їжі та спілкування з офіціантом",
    phrasesCount: 35,
    progress: 8,
    color: "#4ECDC4",
    icon: "restaurant-outline",
  },
  {
    id: "3",
    title: "Покупки",
    description: "Корисні фрази для шопінгу",
    phrasesCount: 30,
    progress: 20,
    color: "#45B7D1",
    icon: "bag-outline",
  },
  {
    id: "4",
    title: "На роботі",
    description: "Ділове спілкування та презентації",
    phrasesCount: 40,
    progress: 0,
    color: "#96CEB4",
    icon: "briefcase-outline",
  },
  {
    id: "5",
    title: "Емоції та почуття",
    description: "Вираження емоційних станів",
    phrasesCount: 28,
    progress: 12,
    color: "#FECA57",
    icon: "happy-outline",
  },
  {
    id: "6",
    title: "Екстрена ситуація",
    description: "Фрази для надзвичайних ситуацій",
    phrasesCount: 20,
    progress: 0,
    color: "#FF9FF3",
    icon: "warning-outline",
  },
];

const PhrasesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTopics, setFilteredTopics] =
    useState<PhrasesTopic[]>(phrasesTopics);

  const styles = createStyles(theme);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTopics(phrasesTopics);
    } else {
      const filtered = phrasesTopics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query.toLowerCase()) ||
          topic.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTopics(filtered);
    }
  };

  const openDrawer = (): void => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleTopicPress = (topic: PhrasesTopic): void => {
    // навігація до карток фраз
    console.log("Opening phrases topic:", topic.title);
  };

  const renderTopicCard: ListRenderItem<PhrasesTopic> = ({ item }) => (
    <TouchableOpacity
      style={styles.topicCard}
      onPress={() => handleTopicPress(item)}
    >
      <View style={styles.topicHeader}>
        <View style={[styles.topicIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={28} color="#FFFFFF" />
        </View>

        <View style={styles.topicInfo}>
          <Text style={styles.topicTitle}>{item.title}</Text>
          <Text style={styles.topicDescription}>{item.description}</Text>
          <Text style={styles.phrasesCount}>{item.phrasesCount} фраз</Text>
        </View>

        <View style={styles.statusContainer}>
          {item.progress === item.phrasesCount && (
            <View style={styles.completedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.success}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Вивчено: {item.progress}/{item.phrasesCount}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round((item.progress / item.phrasesCount) * 100)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  (item.progress / item.phrasesCount) * 100,
                  100
                )}%`,
                backgroundColor: item.color,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: item.color }]}
        >
          <Ionicons
            name={item.progress > 0 ? "play" : "play-circle"}
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.startButtonText}>
            {item.progress === item.phrasesCount
              ? "Повторити"
              : item.progress > 0
              ? "Продовжити"
              : "Почати"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Фрази</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук фраз або тем..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch("")}
            style={styles.clearButton}
          >
            <Ionicons name="close" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="chatbubble-outline" size={24} color={theme.primary} />
          <Text style={styles.statNumber}>
            {phrasesTopics.reduce((sum, topic) => sum + topic.progress, 0)}
          </Text>
          <Text style={styles.statLabel}>Фраз вивчено</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="library-outline" size={24} color={theme.secondary} />
          <Text style={styles.statNumber}>
            {phrasesTopics.filter((topic) => topic.progress > 0).length}
          </Text>
          <Text style={styles.statLabel}>Тем активних</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color={theme.warning} />
          <Text style={styles.statNumber}>
            {
              phrasesTopics.filter(
                (topic) => topic.progress === topic.phrasesCount
              ).length
            }
          </Text>
          <Text style={styles.statLabel}>Тем завершено</Text>
        </View>
      </View>

      <View style={styles.dailyRecommendation}>
        <View style={styles.recommendationHeader}>
          <Ionicons name="bulb-outline" size={24} color={theme.warning} />
          <Text style={styles.recommendationTitle}>Рекомендація дня</Text>
        </View>
        <Text style={styles.recommendationText}>
          Спробуйте тему &quot;Привітання та знайомство&quot; - ідеально для
          початківців!
        </Text>
        <TouchableOpacity style={styles.recommendationButton}>
          <Text style={styles.recommendationButtonText}>Спробувати зараз</Text>
        </TouchableOpacity>
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
    filterButton: {
      padding: 8,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      paddingVertical: 12,
    },
    clearButton: {
      padding: 4,
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
    dailyRecommendation: {
      backgroundColor: theme.card,
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      borderLeftWidth: 4,
      borderLeftColor: theme.warning,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    recommendationHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    recommendationTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginLeft: 8,
    },
    recommendationText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    recommendationButton: {
      backgroundColor: theme.warning,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignSelf: "flex-start",
    },
    recommendationButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
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
    },
    topicIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    topicInfo: {
      flex: 1,
      justifyContent: "center",
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
      marginBottom: 4,
    },
    phrasesCount: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "600",
    },
    statusContainer: {
      justifyContent: "flex-start",
    },
    completedBadge: {
      padding: 4,
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
    },
    progressPercent: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.surface,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 12,
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    startButton: {
      flexDirection: "row",
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    startButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 4,
    },
  });

export default PhrasesScreen;
