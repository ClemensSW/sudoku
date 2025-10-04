// screens/SettingsScreen/SettingsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text as RNText,
  ScrollView,
  StyleSheet,
  BackHandler,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";
import Header from "@/components/Header/Header";
import TutorialContainer from "@/screens/Tutorial/TutorialContainer";
import SupportShopScreen from "@/screens/SupportShop";
import { loadSettings, saveSettings } from "@/utils/storage";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import { triggerHaptic, setVibrationEnabledCache } from "@/utils/haptics";

// Import components
import {
  GameSettings,
  HelpSection,
  ActionsSection,
  CommunitySection,
  AppearanceSettings,
} from "./components";

import styles from "./Settings.styles";

interface SettingsScreenProps {
  onBackToGame?: () => void;
  onQuitGame?: () => void;
  onPauseGame?: () => void;
  onAutoNotes?: () => void;
  onSettingsChanged?: (
    key: keyof GameSettingsType,
    value: boolean | string
  ) => void;
  fromGame?: boolean;
  isDuoMode?: boolean; // New prop to indicate Duo mode
}

const Settings: React.FC<SettingsScreenProps> = ({
  onBackToGame,
  onQuitGame,
  onPauseGame,
  onAutoNotes,
  onSettingsChanged,
  fromGame = false,
  isDuoMode = false, // Default to false
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [settings, setSettings] = useState<GameSettingsType | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSupportShop, setShowSupportShop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if we should show game-specific features
  const showGameFeatures = fromGame && !!onQuitGame;

  useEffect(() => {
    const loadData = async () => {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Add the BackHandler to capture the Android back button
  useEffect(() => {
    // Only for Android and when we come from the game
    if (fromGame && onBackToGame) {
      // Add BackHandler listener
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // Back to the game, instead of following the standard navigation
          onBackToGame();
          // Return true to indicate that we have handled the back button
          return true;
        }
      );

      // Remove listener during cleanup
      return () => backHandler.remove();
    }
  }, [fromGame, onBackToGame]);

  const handleSettingChange = async (
    key: keyof GameSettingsType,
    value: boolean | string
  ) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);

    // Haptic feedback with new utility - but only if vibration is not being deactivated
    if (!(key === "vibration" && value === false)) {
      triggerHaptic("light");
    }

    // If the vibration setting is changed, also update the cache
    if (key === "vibration") {
      setVibrationEnabledCache(value as boolean);
    }

    // Notify GameScreen about the change
    if (onSettingsChanged) {
      onSettingsChanged(key, value);
    }
  };

  const handleAutoNotes = () => {
    if (onAutoNotes) {
      onAutoNotes();
      handleBack();
    }
  };

  const handleBack = () => {
    if (onBackToGame) {
      onBackToGame();
    } else {
      router.back();
    }
  };

  const handleQuitGame = () => {
    showAlert(
      quitGameAlert(() => {
        if (onQuitGame) {
          onQuitGame();
        } else {
          router.replace("/");
        }
      })
    );
  };

  const handleShareApp = async () => {
    triggerHaptic("light");
    try {
      await Share.share({
        message:
          "Spiele mit mir Sudoku Duo! Eine tolle Sudoku-App mit einem einzigartigen 2-Spieler-Modus. Fordere mich heraus! https://play.google.com/store/apps/details?id=de.playfusiongate.sudokuduo",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleAboutPress = () => {
    triggerHaptic("light");
    showAlert({
      title: "Über Sudoku Duo",
      message:
        "Version 1.0.0\n\nHi! Ich bin Clemens – und Sudoku Duo ist meine erste selbst entwickelte App.\n\nIch liebe Denksport und wollte eine Sudoku-App erschaffen, die nicht nur entspannt und fordert, sondern auch verbindet: Mit dem einzigartigen 2-Spieler-Modus wird Sudoku zum gemeinsamen Erlebnis – ideal für Freunde, Paare oder kleine Wettkämpfe.\n\nWenn dir die App gefällt, würde ich mich riesig über deine Unterstützung freuen. Deine Bewertung im Play Store hilft mir, Sudoku Duo und neue Projekte weiterzuentwickeln.\n\nDanke, dass du dabei bist.\nHappy Puzzling! 🧩",
      type: "info", // Behalte "info"
      buttons: [{ text: "OK", style: "primary" }],
    });
  };

  if (isLoading) {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.container,
          { backgroundColor: colors.background },
        ]}
        entering={SlideInUp.duration(300)}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header title="Einstellungen" onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <Feather name="loader" size={24} color={colors.primary} />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { backgroundColor: colors.background },
      ]}
      entering={SlideInUp.duration(300)}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <Header title="Einstellungen" onBackPress={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Help & Tools Section */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(100).duration(500)}
        >
          <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {showGameFeatures ? "Hilfe und Tools" : "Hilfe"}
          </RNText>

          <HelpSection
            showGameFeatures={showGameFeatures && !isDuoMode} // Only show game-specific features in single-player mode
            onAutoNotes={
              showGameFeatures && !isDuoMode ? handleAutoNotes : undefined
            }
            onHowToPlay={() => setShowHowToPlay(true)}
          />
        </Animated.View>

        {/* Appearance Settings - Neue Sektion */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(200).duration(500)}
        >
          <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Design
          </RNText>

          {settings && (
            <AppearanceSettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          )}
        </Animated.View>

        {/* Game Settings */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Spiel
          </RNText>

          {settings && (
            <GameSettings
              settings={settings}
              onSettingChange={handleSettingChange}
              isDuoMode={isDuoMode} // Pass isDuoMode flag to GameSettings
            />
          )}
        </Animated.View>

        {/* Actions Section - Only show when in a game context */}
        {showGameFeatures && (
          <Animated.View
            style={styles.section}
            entering={FadeInDown.delay(400).duration(500)}
          >
            <RNText
              style={[styles.sectionTitle, { color: colors.textPrimary }]}
            >
              Aktionen
            </RNText>

            <ActionsSection
              showGameFeatures={showGameFeatures}
              onQuitGame={onQuitGame}
              onPauseGame={onPauseGame}
              isDuoMode={isDuoMode} // Pass isDuoMode flag to ActionsSection
            />
          </Animated.View>
        )}

        {/* Community & App Section (formerly Support) */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Community
          </RNText>

          <CommunitySection
            onSupportPress={() => setShowSupportShop(true)}
            onSharePress={handleShareApp}
            onAboutPress={handleAboutPress}
          />
        </Animated.View>
      </ScrollView>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <TutorialContainer
          onComplete={() => setShowHowToPlay(false)}
          onBack={() => setShowHowToPlay(false)}
        />
      )}

      {/* Support Shop Modal */}
      {showSupportShop && (
        <SupportShopScreen
          onClose={() => setShowSupportShop(false)}
          hideNavOnClose={true} // ← Navigation bleibt versteckt
        />
      )}
    </Animated.View>
  );
};

export default Settings;
