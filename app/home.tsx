import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/providers/ToastProvider";
import { useUser } from "@/providers/UserProvider";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Navigation {
  navigate: (screen: string, params?: any) => void;
  dispatch: (action: any) => void;
}

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, studySession } = useUser();
  const { showToast } = useToast();
  const navigation = useNavigation<Navigation>();

  const styles = createStyles(theme);

  const handleGetStarted = (): void => {
    navigation.navigate("Vocabulary");
  };

  const openDrawer = (): void => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const formatStudyTime = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} хв`;
    }
    return `${hours.toFixed(1)} год`;
  };

  const handleQuickAccess = (screen: string, title: string): void => {
    showToast({
      type: "info",
      title: `Перехід до ${title}`,
      message: `Відкриваємо розділ ${title}`,
      duration: 2000,
    });
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.greeting}>Привіт!</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons
                name="person-outline"
                size={60}
                color={theme.textSecondary}
              />
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || "Користувач"}</Text>
        </View>

        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <Ionicons name="time-outline" size={24} color={theme.primary} />
            <Text style={styles.sessionTitle}>Поточна сесія</Text>
          </View>

          <View style={styles.sessionStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatStudyTime(studySession?.totalHours || 0)}
              </Text>
              <Text style={styles.statLabel}>Навчання</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {studySession?.wordsLearned || 0}
              </Text>
              <Text style={styles.statLabel}>Слів вивчено</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {studySession?.phrasesLearned || 0}
              </Text>
              <Text style={styles.statLabel}>Фраз вивчено</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Швидкий доступ</Text>

          <View style={styles.quickAccessGrid}>
            <TouchableOpacity
              style={styles.quickAccessItem}
              onPress={() => handleQuickAccess("Vocabulary", "Словник")}
            >
              <Ionicons name="book-outline" size={28} color={theme.primary} />
              <Text style={styles.quickAccessText}>Словник</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessItem}
              onPress={() => handleQuickAccess("Phrases", "Фрази")}
            >
              <Ionicons
                name="chatbubble-outline"
                size={28}
                color={theme.secondary}
              />
              <Text style={styles.quickAccessText}>Фрази</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessItem}
              onPress={() => handleQuickAccess("Grammar", "Граматика")}
            >
              <Ionicons
                name="library-outline"
                size={28}
                color={theme.success}
              />
              <Text style={styles.quickAccessText}>Граматика</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessItem}
              onPress={() => handleQuickAccess("Exercises", "Вправи")}
            >
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={theme.warning}
              />
              <Text style={styles.quickAccessText}>Вправи</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Ваш прогрес</Text>

          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Граматика</Text>
                <Text style={styles.progressPercent}>
                  {Math.round(
                    ((studySession?.grammarTopicsCompleted || 0) / 20) * 100
                  )}
                  %
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        ((studySession?.grammarTopicsCompleted || 0) / 20) *
                          100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Вправи</Text>
                <Text style={styles.progressPercent}>
                  {Math.round(
                    ((studySession?.exercisesCompleted || 0) / 50) * 100
                  )}
                  %
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        ((studySession?.exercisesCompleted || 0) / 50) * 100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 20,
    },
    menuButton: {
      padding: 8,
    },
    greeting: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      textAlign: "center",
    },
    headerSpacer: {
      width: 40,
    },
    profileSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    avatarContainer: {
      marginBottom: 12,
    },
    avatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
    sessionCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sessionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    sessionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginLeft: 8,
    },
    sessionStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: theme.border,
      marginHorizontal: 16,
    },
    quickAccessSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    quickAccessGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    quickAccessItem: {
      width: "48%",
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 20,
      alignItems: "center",
      marginBottom: 12,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    quickAccessText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginTop: 8,
    },
    progressSection: {
      marginBottom: 32,
    },
    progressCard: {
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
    progressItem: {
      marginBottom: 20,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressLabel: {
      fontSize: 16,
      fontWeight: "600",
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
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    getStartedButton: {
      flexDirection: "row",
      backgroundColor: theme.primary,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 32,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    getStartedText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginRight: 8,
    },
  });

export default HomeScreen;
