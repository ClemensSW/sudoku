// screens/SettingsScreen/SettingsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Share,
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
import { GameSettings as GameSettingsType } from "@/utils/storage";
import { triggerHaptic, setVibrationEnabledCache } from "@/utils/haptics";

// Import components
import {
  GameSettings,
  HelpSection,
  ActionsSection,
  CommunitySection
} from "./components";

import styles from "./SettingsScreen.styles";

interface SettingsScreenProps {
  onBackToGame?: () => void;
  onQuitGame?: () => void;
  onAutoNotes?: () => void;
  onSettingsChanged?: (
    key: keyof GameSettingsType,
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

  const [settings, setSettings] = useState<GameSettingsType | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSupportShop, setShowSupportShop] = useState(false);
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
    key: keyof GameSettingsType,
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
      await Share.share({
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

          <HelpSection 
            showGameFeatures={showGameFeatures}
            onAutoNotes={showGameFeatures ? handleAutoNotes : undefined}
            onHowToPlay={() => setShowHowToPlay(true)}
          />
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
            <GameSettings 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          )}
        </Animated.View>

        {/* Actions Section - Only show when in a game context */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Aktionen
          </Text>

          <ActionsSection 
            showGameFeatures={showGameFeatures}
            onQuitGame={onQuitGame}
          />
        </Animated.View>

        {/* Community & App Section (formerly Support) */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Community & App
          </Text>
          
          <CommunitySection 
            onSupportPress={() => setShowSupportShop(true)}
            onSharePress={handleShareApp}
            onAboutPress={handleAboutPress}
          />
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