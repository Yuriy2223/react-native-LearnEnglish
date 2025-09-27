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
import { useTheme } from "./provider/ThemeProvider";

interface VocabularyTopic {
  id: string;
  title: string;
  description: string;
  wordsCount: number;
  progress: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Navigation {
  dispatch: (action: any) => void;
}

const vocabularyTopics: VocabularyTopic[] = [
  {
    id: "1",
    title: "Базова лексика",
    description: "Найважливіші слова для початківців",
    wordsCount: 50,
    progress: 24,
    color: "#FF6B6B",
    icon: "school-outline",
  },
  {
    id: "2",
    title: "Їжа та напої",
    description: "Назви продуктів і страв",
    wordsCount: 75,
    progress: 12,
    color: "#4ECDC4",
    icon: "restaurant-outline",
  },
  {
    id: "3",
    title: "Родина",
    description: "Члени родини та родинні зв'язки",
    wordsCount: 30,
    progress: 30,
    color: "#45B7D1",
    icon: "people-outline",
  },
  {
    id: "4",
    title: "Професії",
    description: "Назви різних професій",
    wordsCount: 40,
    progress: 0,
    color: "#96CEB4",
    icon: "briefcase-outline",
  },
  {
    id: "5",
    title: "Подорожі",
    description: "Корисна лексика для подорожей",
    wordsCount: 60,
    progress: 5,
    color: "#FECA57",
    icon: "airplane-outline",
  },
  {
    id: "6",
    title: "Дім та меблі",
    description: "Предмети домашнього вжитку",
    wordsCount: 55,
    progress: 0,
    color: "#FF9FF3",
    icon: "home-outline",
  },
];

const VocabularyScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTopics, setFilteredTopics] =
    useState<VocabularyTopic[]>(vocabularyTopics);

  const styles = createStyles(theme);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTopics(vocabularyTopics);
    } else {
      const filtered = vocabularyTopics.filter(
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

  const handleTopicPress = (topic: VocabularyTopic): void => {
    //  навігація до карток слів
    console.log("Opening topic:", topic.title);
  };

  const renderTopicCard: ListRenderItem<VocabularyTopic> = ({ item }) => (
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
          <Text style={styles.wordsCount}>{item.wordsCount} слів</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Прогрес: {item.progress}/{item.wordsCount}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round((item.progress / item.wordsCount) * 100)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  (item.progress / item.wordsCount) * 100,
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
          <Text style={styles.startButtonText}>
            {item.progress > 0 ? "Продовжити" : "Почати"}
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
        <Text style={styles.headerTitle}>Словник</Text>
        <View style={styles.headerSpacer} />
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
          placeholder="Пошук тем або слів..."
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
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {vocabularyTopics.reduce((sum, topic) => sum + topic.progress, 0)}
          </Text>
          <Text style={styles.statLabel}>Слів вивчено</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {vocabularyTopics.filter((topic) => topic.progress > 0).length}
          </Text>
          <Text style={styles.statLabel}>Тем розпочато</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {vocabularyTopics.reduce((sum, topic) => sum + topic.wordsCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Всього слів</Text>
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
    headerSpacer: {
      width: 40,
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
      backgroundColor: theme.card,
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      paddingVertical: 20,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "center",
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
    wordsCount: {
      fontSize: 12,
      color: theme.textSecondary,
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
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    startButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
  });

export default VocabularyScreen;
