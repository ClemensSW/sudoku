import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/utils/theme/ThemeProvider";
import Header from "@/components/Header/Header";
import StatisticsDisplay from "@/components/StatisticsDisplay/StatisticsDisplay";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import { loadSettings, saveSettings, loadStats } from "@/utils/storage";
import { GameSettings, GameStats } from "@/utils/storage";

import styles from "./SettingsScreen.styles";

interface SettingsScreenProps {
  onBackToGame?: () => void;
  onQuitGame?: () => void;
  onAutoNotes?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBackToGame,
  onQuitGame,
  onAutoNotes,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State for settings and statistics
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings and statistics
  useEffect(() => {
    const loadData = async () => {
      const loadedSettings = await loadSettings();
      const loadedStats = await loadStats();

      setSettings(loadedSettings);
      setStats(loadedStats);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Handle settings changes
  const handleSettingChange = async (
    key: keyof GameSettings,
    value: boolean | string
  ) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Auto-fill all notes
  const handleAutoNotes = () => {
    if (onAutoNotes) {
      onAutoNotes();
      handleBack();

      
    }
  };

  // Back navigation
  const handleBack = () => {
    if (onBackToGame) {
      onBackToGame();
    } else {
      router.back();
    }
  };

  // Quit game
  const handleQuitGame = () => {
    Alert.alert(
      "Spiel beenden?",
      "Bist du sicher, dass du das aktuelle Spiel beenden möchtest? Dein Fortschritt geht verloren.",
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Beenden",
          style: "destructive",
          onPress: () => {
            if (onQuitGame) {
              onQuitGame();
            } else {
              router.navigate("/");
            }
          },
        },
      ]
    );
  };

  // Loading screen
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
        <SafeAreaView edges={["top"]} style={{ width: "100%" }}>
          <Header title="Einstellungen" onBackPress={handleBack} />
        </SafeAreaView>
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

      {/* Header */}
      <SafeAreaView edges={["top"]} style={{ width: "100%" }}>
        <Header title="Einstellungen" onBackPress={handleBack} />
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Statistics Section with Enhanced Display */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(100).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Statistiken
          </Text>
          {stats && <StatisticsDisplay stats={stats} />}
        </Animated.View>

        {/* Game Settings */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(200).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Spieleinstellungen
          </Text>

          {settings && (
            <View
              style={[styles.settingsGroup, { borderColor: colors.border }]}
            >
              {/* Show Errors */}
              <View
                style={[
                  styles.settingRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingTitle, { color: colors.textPrimary }]}
                  >
                    Fehler anzeigen
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Falsche Zahlen hervorheben
                  </Text>
                </View>
                <Switch
                  value={settings.showMistakes}
                  onValueChange={(value) =>
                    handleSettingChange("showMistakes", value)
                  }
                  trackColor={{
                    false: colors.buttonDisabled,
                    true: colors.primary,
                  }}
                  thumbColor={theme.isDark ? colors.background : "#FFFFFF"}
                />
              </View>

              {/* Highlight related cells */}
              <View
                style={[
                  styles.settingRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingTitle, { color: colors.textPrimary }]}
                  >
                    Zellen hervorheben
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Zeile, Spalte und Box hervorheben
                  </Text>
                </View>
                <Switch
                  value={settings.highlightRelatedCells}
                  onValueChange={(value) =>
                    handleSettingChange("highlightRelatedCells", value)
                  }
                  trackColor={{
                    false: colors.buttonDisabled,
                    true: colors.primary,
                  }}
                  thumbColor={theme.isDark ? colors.background : "#FFFFFF"}
                />
              </View>

              {/* Vibration */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingTitle, { color: colors.textPrimary }]}
                  >
                    Vibration
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Haptisches Feedback beim Tippen
                  </Text>
                </View>
                <Switch
                  value={settings.vibration}
                  onValueChange={(value) =>
                    handleSettingChange("vibration", value)
                  }
                  trackColor={{
                    false: colors.buttonDisabled,
                    true: colors.primary,
                  }}
                  thumbColor={theme.isDark ? colors.background : "#FFFFFF"}
                />
              </View>
            </View>
          )}
        </Animated.View>

        {/* Help & Tools Section */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Hilfe und Tools
          </Text>

          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Auto Notes */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAutoNotes}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: `${colors.primary}15` },
                ]}
              >
                <Feather name="edit-3" size={20} color={colors.primary} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text
                  style={[styles.actionTitle, { color: colors.textPrimary }]}
                >
                  Automatische Notizen
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Mögliche Zahlen als Notizen eintragen
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* How to Play */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { borderTopWidth: 1, borderTopColor: colors.border },
              ]}
              onPress={() => setShowHowToPlay(true)}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: `${colors.info}15` },
                ]}
              >
                <Feather name="help-circle" size={20} color={colors.info} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text
                  style={[styles.actionTitle, { color: colors.textPrimary }]}
                >
                  Spielanleitung
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Lerne, wie man Sudoku spielt
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Actions Section */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Aktionen
          </Text>

          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Quit Game */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleQuitGame}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: `${colors.error}20` },
                ]}
              >
                <Feather name="x-circle" size={20} color={colors.error} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={[styles.actionTitle, { color: colors.error }]}>
                  Spiel beenden
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Zurück zum Hauptmenü
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Version Info */}
        <Animated.View
          style={styles.versionContainer}
          entering={FadeIn.delay(500).duration(500)}
        >
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Sudoku v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <View style={StyleSheet.absoluteFill}>
          <HowToPlayModal
            visible={showHowToPlay}
            onClose={() => setShowHowToPlay(false)}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default SettingsScreen;
