// screens/SettingsScreen/SettingsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Share,
  Linking,
  Alert,
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

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";
import Header from "@/components/Header/Header";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import SupportShop from "@/components/SupportShop/SupportShop";
import { loadSettings, saveSettings } from "@/utils/storage";
import { GameSettings } from "@/utils/storage";
import { triggerHaptic, setVibrationEnabledCache } from "@/utils/haptics";

import styles from "./SettingsScreen.styles";

interface SettingsScreenProps {
  onBackToGame?: () => void;
  onQuitGame?: () => void;
  onAutoNotes?: () => void;
  onSettingsChanged?: (
    key: keyof GameSettings,
    value: boolean | string
  ) => void;
  fromGame?: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBackToGame,
  onQuitGame,
  onAutoNotes,
  onSettingsChanged,
  fromGame = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSupportShop, setShowSupportShop] = useState(false);
  const [showAboutInfo, setShowAboutInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if we should show game-specific features
  // We show them when opened from a game (both properties must exist)
  const showGameFeatures = fromGame && !!onAutoNotes && !!onQuitGame;

  useEffect(() => {
    const loadData = async () => {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Füge den BackHandler hinzu, um den Android-Zurück-Button abzufangen
  useEffect(() => {
    // Nur für Android und wenn wir vom Spiel kommen
    if (fromGame && onBackToGame) {
      // BackHandler-Listener hinzufügen
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // Zurück zum Spiel, statt der Standard-Navigation zu folgen
          onBackToGame();
          // true zurückgeben, um zu signalisieren, dass wir den Zurück-Button behandelt haben
          return true;
        }
      );

      // Listener entfernen beim Aufräumen
      return () => backHandler.remove();
    }
  }, [fromGame, onBackToGame]);

  const handleSettingChange = async (
    key: keyof GameSettings,
    value: boolean | string
  ) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);

    // Haptic feedback mit neuer Utility - aber nur wenn Vibration nicht gerade deaktiviert wird
    if (!(key === "vibration" && value === false)) {
      triggerHaptic("light");
    }

    // Wenn die Vibrations-Einstellung geändert wird, aktualisiere auch den Cache
    if (key === "vibration") {
      setVibrationEnabledCache(value as boolean);
    }

    // Benachrichtige GameScreen über die Änderung
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
      const result = await Share.share({
        message: 'Spiele mit mir Sudoku Duo! Eine tolle Sudoku-App mit einem einzigartigen 2-Spieler-Modus. Fordere mich heraus! https://play.google.com/store/apps/details?id=com.clemenssw.sudoku',
        // Hier würde normalerweise der echte App-Store-Link stehen
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAboutPress = () => {
    triggerHaptic("light");
    showAlert({
      title: "Über Sudoku",
      message: "Version 1.0.0\n\nEntwickelt mit ♥ und Freude am Denksport.\n\nDanke, dass du Sudoku spielst!",
      type: "info",
      buttons: [{ text: "OK", style: "primary" }]
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
        {/* Help & Tools Section - MOVED TO TOP */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(100).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {showGameFeatures ? "Hilfe und Tools" : "Hilfe"}
          </Text>

          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Auto Notes - Only show when in a game context */}
            {showGameFeatures && (
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
            )}

            {/* How to Play */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                showGameFeatures && {
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                },
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
                  Wie man spielt
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

        {/* Game Settings */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Spieleinstellungen
          </Text>

          {settings && (
            <View
              style={[styles.settingsGroup, { borderColor: colors.border }]}
            >
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
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Highlight same values */}
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
                    Gleiche Zahlen hervorheben
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Alle Zellen mit gleichen Werten markieren
                  </Text>
                </View>
                <Switch
                  value={settings.highlightSameValues}
                  onValueChange={(value) =>
                    handleSettingChange("highlightSameValues", value)
                  }
                  trackColor={{
                    false: colors.buttonDisabled,
                    true: colors.primary,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>

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
                  thumbColor="#FFFFFF"
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
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          )}
        </Animated.View>

        {/* Actions Section - Only show when in a game context */}
        {showGameFeatures && (
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
        )}

        {/* Community & App Section (formerly Support) */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Community & App
          </Text>
          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Original Support button - Keep exact text as specified */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowSupportShop(true)}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: "#FFDD00" },
                ]}
              >
                <Text style={{ fontSize: 24 }}>☕</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text
                  style={[styles.actionTitle, { color: colors.textPrimary }]}
                >
                  Kostenlos spielen
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Entwicklung freiwillig unterstützen
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Share button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { borderTopWidth: 1, borderTopColor: colors.border }
              ]}
              onPress={handleShareApp}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: `${colors.success}20` },
                ]}
              >
                <Feather name="share-2" size={20} color={colors.success} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text
                  style={[styles.actionTitle, { color: colors.textPrimary }]}
                >
                  Mit Freunden teilen
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Fordere sie zum Sudoku-Duell heraus
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* About button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { borderTopWidth: 1, borderTopColor: colors.border }
              ]}
              onPress={handleAboutPress}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: `${colors.info}20` },
                ]}
              >
                <Feather name="info" size={20} color={colors.info} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text
                  style={[styles.actionTitle, { color: colors.textPrimary }]}
                >
                  Über Sudoku Duo
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

      {/* Support Shop Modal */}
      {showSupportShop && (
        <SupportShop onClose={() => setShowSupportShop(false)} />
      )}
    </Animated.View>
  );
};

export default SettingsScreen;