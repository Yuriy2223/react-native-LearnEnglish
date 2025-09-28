import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/providers/ToastProvider";
import { useUser } from "@/providers/UserProvider";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Navigation {
  dispatch: (action: any) => void;
}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
}

interface SectionHeaderProps {
  title: string;
}

const SettingsScreen: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const { showToast } = useToast();
  const navigation = useNavigation<Navigation>();

  const [notifications, setNotifications] = useState<boolean>(true);
  const [dailyReminder, setDailyReminder] = useState<boolean>(true);
  const [offlineContent, setOfflineContent] = useState<boolean>(false);
  const [languageModalVisible, setLanguageModalVisible] =
    useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("uk");

  const styles = createStyles(theme);

  const openDrawer = (): void => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const languages: Language[] = [
    { code: "uk", name: "Українська", flag: "🇺🇦" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
  ];

  const handleLanguageSelect = (langCode: string): void => {
    setSelectedLanguage(langCode);
    setLanguageModalVisible(false);

    showToast({
      type: "success",
      title: "Мову змінено",
      message: "Інтерфейс буде перезавантажено",
      duration: 3000,
    });
  };

  const handleEditProfile = (): void => {
    showToast({
      type: "info",
      title: "Редагування профілю",
      message: "Функція буде реалізована пізніше",
      duration: 3000,
    });
  };

  const handleDownloadContent = (): void => {
    showToast({
      type: "info",
      title: "Завантажити контент",
      message:
        "Завантажити всі уроки для офлайн-режиму? Це займе близько 50MB.",
      duration: 5000,
    });

    setTimeout(() => {
      setOfflineContent(true);
      showToast({
        type: "success",
        title: "Успіх",
        message: "Контент завантажено!",
        duration: 3000,
      });
    }, 2000);
  };

  const handleClearCache = (): void => {
    showToast({
      type: "success",
      title: "Кеш очищено",
      message: "Тимчасові файли та кеш застосунку видалено",
      duration: 3000,
    });
  };

  const handleLogout = (): void => {
    showToast({
      type: "info",
      title: "Підтвердження виходу",
      message: "Ви впевнені, що хочете вийти з акаунту?",
      duration: 4000,
    });

    setTimeout(async () => {
      try {
        await logout();
        showToast({
          type: "success",
          title: "Вихід виконано",
          message: "До побачення!",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error during logout:", error);
        showToast({
          type: "error",
          title: "Помилка виходу",
          message: "Не вдалося вийти з акаунту",
          duration: 3000,
        });
      }
    }, 1000);
  };

  const handleAboutApp = (): void => {
    showToast({
      type: "info",
      title: "Language Learning App",
      message: "Версія 1.0.0 • Розроблено для вивчення мов",
      duration: 4000,
    });
  };

  const handleSupport = (): void => {
    showToast({
      type: "info",
      title: "Підтримка",
      message:
        "Email: support@languageapp.com • Telegram: @languageapp_support",
      duration: 5000,
    });
  };

  const handlePrivacyPolicy = (): void => {
    showToast({
      type: "info",
      title: "Політика конфіденційності",
      message: "Тут буде текст політики конфіденційності",
      duration: 3000,
    });
  };

  const handleTermsOfService = (): void => {
    showToast({
      type: "info",
      title: "Умови використання",
      message: "Тут будуть умови використання",
      duration: 3000,
    });
  };

  const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    rightComponent,
    showChevron = true,
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color={theme.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showChevron && !rightComponent && (
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.textSecondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Налаштування</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="ПРОФІЛЬ" />
        <View style={styles.section}>
          <SettingItem
            icon="person-outline"
            title={user?.name || "Користувач"}
            subtitle={user?.email || ""}
            onPress={handleEditProfile}
          />
        </View>

        <SectionHeader title="НАВЧАННЯ" />
        <View style={styles.section}>
          <SettingItem
            icon="language-outline"
            title="Мова інтерфейсу"
            subtitle={languages.find((l) => l.code === selectedLanguage)?.name}
            onPress={() => setLanguageModalVisible(true)}
          />

          <SettingItem
            icon="notifications-outline"
            title="Push-сповіщення"
            subtitle="Нагадування про навчання"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
            showChevron={false}
          />

          <SettingItem
            icon="time-outline"
            title="Щоденні нагадування"
            subtitle={dailyReminder ? "Увімкнено о 19:00" : "Вимкнено"}
            rightComponent={
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
            showChevron={false}
          />
        </View>

        <SectionHeader title="ЗОВНІШНИЙ ВИГЛЯД" />
        <View style={styles.section}>
          <SettingItem
            icon={isDarkMode ? "moon-outline" : "sunny-outline"}
            title="Тема"
            subtitle={isDarkMode ? "Темна" : "Світла"}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
            showChevron={false}
          />
        </View>

        <SectionHeader title="КОНТЕНТ" />
        <View style={styles.section}>
          <SettingItem
            icon="cloud-download-outline"
            title="Завантажити для офлайн"
            subtitle={offlineContent ? "Завантажено" : "Завантажити контент"}
            onPress={handleDownloadContent}
          />

          <SettingItem
            icon="server-outline"
            title="Очистити кеш"
            subtitle="Звільнити місце на пристрої"
            onPress={handleClearCache}
          />
        </View>

        <SectionHeader title="ІНФОРМАЦІЯ" />
        <View style={styles.section}>
          <SettingItem
            icon="information-circle-outline"
            title="Про застосунок"
            subtitle="Версія 1.0.0"
            onPress={handleAboutApp}
          />

          <SettingItem
            icon="help-circle-outline"
            title="Довідка та підтримка"
            subtitle="FAQ та контакти"
            onPress={handleSupport}
          />

          <SettingItem
            icon="shield-checkmark-outline"
            title="Політика конфіденційності"
            onPress={handlePrivacyPolicy}
          />

          <SettingItem
            icon="document-text-outline"
            title="Умови використання"
            onPress={handleTermsOfService}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={theme.error} />
            <Text style={styles.logoutText}>Вийти з акаунту</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Оберіть мову</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === language.code &&
                    styles.selectedLanguageOption,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text style={styles.languageName}>{language.name}</Text>
                {selectedLanguage === language.code && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    scrollContainer: {
      flex: 1,
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.textSecondary,
      marginTop: 24,
      marginBottom: 8,
      marginHorizontal: 20,
      letterSpacing: 1,
    },
    section: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 8,
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      elevation: 2,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.border,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      width: 40,
      alignItems: "center",
      marginRight: 12,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    settingSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    settingRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      justifyContent: "center",
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.error,
      marginLeft: 8,
    },
    bottomSpacer: {
      height: 100,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      width: "80%",
      maxHeight: "70%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    languageOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      marginBottom: 4,
    },
    selectedLanguageOption: {
      backgroundColor: theme.surface,
    },
    languageFlag: {
      fontSize: 24,
      marginRight: 16,
    },
    languageName: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
    },
  });

export default SettingsScreen;
