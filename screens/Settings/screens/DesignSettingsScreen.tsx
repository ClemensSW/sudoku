// screens/Settings/screens/DesignSettingsScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/contexts/navigation";
import Header from "@/components/Header/Header";
import DesignGroup from "../components/DesignGroup";
import { GameSettings as GameSettingsType, loadSettings, saveSettings } from "@/utils/storage";

const DesignSettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hideBottomNav } = useNavigation();
  const [settings, setSettings] = useState<GameSettingsType | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
    };
    loadData();
  }, []);

  // Hide bottom navigation when this screen is opened
  useEffect(() => {
    hideBottomNav();
  }, [hideBottomNav]);

  // Add Android back handler to navigate back to settings
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [router]);

  const handleThemeChange = async (value: "light" | "dark") => {
    if (isChanging || !settings || value === settings.darkMode) return;

    setIsChanging(true);
    await theme.updateTheme(value);

    const updatedSettings = { ...settings, darkMode: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);

    setTimeout(() => {
      setIsChanging(false);
    }, 300);
  };

  const handleLanguageChange = async (language: "de" | "en" | "hi") => {
    if (!settings) return;
    await i18n.changeLanguage(language);

    const updatedSettings = { ...settings, language };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
  };

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { backgroundColor: colors.background },
      ]}
      entering={FadeIn.duration(300)}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <Header
        title={t("categories.design")}
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {settings && (
          <DesignGroup
            themeValue={settings.darkMode}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
            isChanging={isChanging}
          />
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default DesignSettingsScreen;
