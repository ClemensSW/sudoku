// screens/DuoScreen/DuoScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Difficulty } from "@/utils/sudoku";
import { triggerHaptic } from "@/utils/haptics";
import styles from "./DuoScreen.styles";

// Modal für Schwierigkeitsauswahl
interface DifficultyOption {
  id: Difficulty;
  name: string;
  description: string;
}

const DuoScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");

  // Schwierigkeitsgrade mit Beschreibungen
  const difficultyOptions: DifficultyOption[] = [
    {
      id: "easy",
      name: "Leicht",
      description: "Perfekt für Anfänger und lockeres Spielen.",
    },
    {
      id: "medium",
      name: "Mittel",
      description: "Ausgewogene Herausforderung für die meisten Spieler.",
    },
    {
      id: "hard",
      name: "Schwer",
      description: "Forderndes Spiel für erfahrene Sudoku-Fans.",
    },
    {
      id: "expert",
      name: "Experte",
      description: "Die ultimative Herausforderung für Sudoku-Meister.",
    },
  ];

  // Handler für Settings-Button
  const handleSettingsPress = () => {
    router.push("/settings");
  };

  // Handler für Start-Button
  const handleStartGame = () => {
    triggerHaptic("light");
    setShowDifficultyModal(true);
  };

  // Handler für Schwierigkeitsauswahl
  const handleDifficultySelected = (difficulty: Difficulty) => {
    triggerHaptic("light");
    setSelectedDifficulty(difficulty);
  };

  // Handler für Spiel starten
  const handleStartWithDifficulty = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(false);

    console.log(
      "Navigation zu /duo-game mit Schwierigkeit:",
      selectedDifficulty
    );

    // Navigation zum Duo-Spiel mit ausgewähltem Schwierigkeitsgrad
    // Verwende expliziten Pfad und replace statt push
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: selectedDifficulty },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Settings-Icon rechts oben */}
        <View style={[styles.header, { top: insets.top + 16 }]}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: colors.surface,
                borderWidth: 0,
              },
            ]}
            onPress={handleSettingsPress}
          >
            <Feather name="settings" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 56 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Titel-Bereich */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Sudoku Duo-Modus
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Fordere einen Freund heraus oder spielt zusammen auf demselben
                Gerät
              </Text>
            </View>

            {/* Spielvisualisierung */}
            <View style={styles.gameVisualizer}>
              <View
                style={[
                  styles.boardContainer,
                  { backgroundColor: colors.card },
                ]}
              >
                {/* Oberer Spielbereich */}
                <View
                  style={[
                    styles.boardTop,
                    { backgroundColor: `${colors.primary}50` },
                  ]}
                >
                  <View style={styles.playerContainer}>
                    <View style={styles.playerInfo}>
                      <View
                        style={[
                          styles.playerAvatar,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Feather name="user" size={20} color="white" />
                      </View>
                      <Text
                        style={[
                          styles.playerName,
                          { color: colors.textPrimary },
                        ]}
                      >
                        Spieler 1
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Unterer Spielbereich */}
                <View
                  style={[
                    styles.boardBottom,
                    { backgroundColor: `${colors.secondary}30` },
                  ]}
                >
                  <View style={styles.playerContainer}>
                    <View style={styles.playerInfo}>
                      <View
                        style={[
                          styles.playerAvatar,
                          { backgroundColor: colors.secondary },
                        ]}
                      >
                        <Feather name="user" size={20} color="white" />
                      </View>
                      <Text
                        style={[
                          styles.playerName,
                          { color: colors.textPrimary },
                        ]}
                      >
                        Spieler 2
                      </Text>
                    </View>
                  </View>
                </View>

                {/* VS Trennlinie */}
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View
                  style={[
                    styles.versusContainer,
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 2,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.versusText, { color: colors.textPrimary }]}
                  >
                    VS
                  </Text>
                </View>
              </View>
            </View>

            {/* Funktionsliste */}
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: `${colors.warning}20` },
                  ]}
                >
                  <Feather name="zap" size={20} color={colors.warning} />
                </View>
                <View style={styles.featureContent}>
                  <Text
                    style={[styles.featureTitle, { color: colors.textPrimary }]}
                  >
                    Wettkampfmodus
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Einer spielt die obere Hälfte, einer die untere. Wer zuerst
                    fertig ist, gewinnt.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: `${colors.success}20` },
                  ]}
                >
                  <Feather name="users" size={20} color={colors.success} />
                </View>
                <View style={styles.featureContent}>
                  <Text
                    style={[styles.featureTitle, { color: colors.textPrimary }]}
                  >
                    Lokales Multiplayer
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Gemeinsamer Spielspaß auf einem Gerät. Das Sudoku wird in
                    zwei Bereiche geteilt.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Feather name="rotate-ccw" size={20} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text
                    style={[styles.featureTitle, { color: colors.textPrimary }]}
                  >
                    Gedrehte Ansicht
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Spieler 1 sieht die Zahlen um 180° gedreht, um gegenüber von
                    Spieler 2 zu sitzen.
                  </Text>
                </View>
              </View>
            </View>

            {/* Start-Button */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: colors.primary }]}
                onPress={handleStartGame}
              >
                <Feather name="play" size={20} color="white" />
                <Text
                  style={[styles.ctaButtonText, { color: colors.buttonText }]}
                >
                  Duo-Spiel starten
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Schwierigkeitsauswahl-Modal */}
      {showDifficultyModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDifficultyModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Schwierigkeit auswählen
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              Wählt gemeinsam einen passenden Schwierigkeitsgrad
            </Text>

            <View
              style={[
                styles.difficultyButtonsContainer,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                },
              ]}
            >
              {difficultyOptions.map((option, index) => {
                const isSelected = selectedDifficulty === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.difficultyButton,
                      index < difficultyOptions.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                      isSelected && {
                        backgroundColor: `${colors.primary}15`,
                      },
                    ]}
                    onPress={() => handleDifficultySelected(option.id)}
                  >
                    <View style={styles.difficultyButtonContent}>
                      <Text
                        style={[
                          styles.difficultyButtonText,
                          { color: colors.textPrimary },
                          isSelected && {
                            color: colors.primary,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {option.name}
                      </Text>

                      <Text
                        style={[
                          styles.difficultyDescription,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>

                    {isSelected && (
                      <Feather name="check" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.modalCTAButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleStartWithDifficulty}
            >
              <Text style={[styles.modalCTAText, { color: colors.buttonText }]}>
                Zusammen spielen!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowDifficultyModal(false)}
            >
              <Text
                style={[
                  styles.modalCancelText,
                  { color: colors.textSecondary },
                ]}
              >
                Abbrechen
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DuoScreen;
