// screens/Settings/screens/GameSettingsScreen.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useBackgroundMusic } from "@/contexts/BackgroundMusicProvider";
import { useNavigation } from "@/contexts/navigation";
import Header from "@/components/Header/Header";
import GameSettings from "../components/GameSettings/GameSettings";
import { GameSettings as GameSettingsType, loadSettings, saveSettings } from "@/utils/storage";
import { triggerHaptic, setVibrationEnabledCache } from "@/utils/haptics";

const GameSettingsScreen: React.FC = () => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toggleMusic } = useBackgroundMusic();
  const { hideBottomNav } = useNavigation();
  const [settings, setSettings] = useState<GameSettingsType | null>(null);

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

  const handleSettingChange = async (
    key: keyof GameSettingsType,
    value: boolean | string
  ) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);

    if (!(key === "vibration" && value === false)) {
      triggerHaptic("light");
    }

    if (key === "vibration") {
      setVibrationEnabledCache(value as boolean);
    }

    if (key === "backgroundMusic") {
      await toggleMusic(value as boolean);
    }
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
        title={t("categories.game")}
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
          <GameSettings
            settings={settings}
            onSettingChange={handleSettingChange}
            isDuoMode={false}
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

export default GameSettingsScreen;
