// components/HowToPlayModal/HowToPlayModal.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";
import styles from "./HowToPlayModal.styles";

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const tutorialSteps = [
    {
      title: "Ziel des Spiels",
      description:
        "Ziel des Sudoku ist es, das 9×9-Raster so mit Zahlen zu füllen, dass jede Zeile, jede Spalte und jeder 3×3-Block alle Zahlen von 1 bis 9 enthält.",
      icon: "target",
    },
    {
      title: "Spielbeginn",
      description:
        "Einige Zahlen sind bereits vorgegeben. Diese Startzahlen können nicht geändert werden und geben dir Hinweise, wie das Rätsel zu lösen ist.",
      icon: "play",
    },
    {
      title: "Zelle auswählen",
      description:
        "Tippe auf eine leere Zelle, um sie auszuwählen. Verwandte Zellen (gleiche Zeile, Spalte und Box) werden automatisch hervorgehoben.",
      icon: "edit-2",
    },
    {
      title: "Zahl einsetzen",
      description:
        "Tippe auf eine Zahl im Zahlenpad, um sie in die ausgewählte Zelle einzusetzen. Zahlen, die bereits 9 Mal verwendet wurden, werden ausgegraut.",
      icon: "plus-square",
    },
    {
      title: "Notizen verwenden",
      description:
        "Drücke den Notiz-Button, um in den Notiz-Modus zu wechseln. Tippe auf Zahlen, um sie als Notiz in der Zelle zu speichern. Dies hilft, mögliche Kandidaten zu verfolgen.",
      icon: "edit-3",
    },
    {
      title: "Fehler korrigieren",
      description:
        "Ungültige Zahlen werden rot markiert. Tippe auf den Radiergummi, um eine Zahl zu löschen. Tippe erneut auf eine bereits eingesetzte Zahl, um sie zu entfernen.",
      icon: "x-circle",
    },
    {
      title: "Hilfe nutzen",
      description:
        "Du hast 3 Hinweise pro Spiel. Drücke den Hinweis-Button, um dir bei schwierigen Zellen helfen zu lassen.",
      icon: "help-circle",
    },
    {
      title: "Spielende",
      description:
        "Wenn alle Zellen korrekt ausgefüllt sind, ist das Spiel gewonnen. Versuche, deine Bestzeit zu verbessern und spiele in verschiedenen Schwierigkeitsgraden!",
      icon: "award",
    },
  ];

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.modalContainer,
        { backgroundColor: colors.background },
      ]}
      entering={SlideInUp.duration(300)}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Modal Header */}
        <View
          style={[styles.modalHeader, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            Sudoku Spielanleitung
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Modal Body mit Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View entering={FadeIn.duration(600)}>
            {/* Sudoku Grid Visualisierung */}
            <View
              style={[
                styles.gridVisualContainer,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <View
                style={[
                  styles.sudokuGridVisual,
                  { backgroundColor: colors.primary },
                ]}
              >
                {/* 3x3 visuelles Sudoku-Grid */}
                <View style={styles.gridRow}>
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gridCellText,
                        { color: colors.buttonText },
                      ]}
                    >
                      5
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gridCellText,
                        { color: colors.buttonText },
                      ]}
                    >
                      3
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  />
                </View>
                <View style={styles.gridRow}>
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gridCellText,
                        { color: colors.buttonText },
                      ]}
                    >
                      6
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gridCell,
                      {
                        backgroundColor: `${colors.buttonText}30`,
                        borderColor: colors.buttonText,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gridCellText,
                        { color: colors.buttonText },
                      ]}
                    >
                      9
                    </Text>
                  </View>
                </View>
                <View style={styles.gridRow}>
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  />
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gridCellText,
                        { color: colors.buttonText },
                      ]}
                    >
                      8
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gridCell,
                      { borderColor: colors.buttonText },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gridCellText,
                        { color: colors.buttonText },
                      ]}
                    >
                      7
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={[styles.visualExplanation, { color: colors.textPrimary }]}
              >
                Beispiel eines Sudoku-Puzzles
              </Text>
            </View>

            {/* Tutorialschritte */}
            {tutorialSteps.map((step, index) => (
              <Animated.View
                key={`step-${index}`}
                style={[
                  styles.tutorialStep,
                  { borderBottomColor: colors.border },
                ]}
                entering={FadeIn.delay(100 * index).duration(500)}
              >
                <View
                  style={[
                    styles.stepIconContainer,
                    { backgroundColor: `${colors.primary}15` },
                  ]}
                >
                  <Feather
                    name={step.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[styles.stepTitle, { color: colors.textPrimary }]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
              </Animated.View>
            ))}

            {/* Zusätzliche Tipps */}
            <Animated.View
              style={styles.tipsContainer}
              entering={FadeIn.delay(900).duration(500)}
            >
              <Text style={[styles.tipsTitle, { color: colors.textPrimary }]}>
                Profi-Tipps
              </Text>
              <View
                style={[
                  styles.tipBox,
                  {
                    backgroundColor: `${colors.info}15`,
                    borderColor: colors.info,
                  },
                ]}
              >
                <Text style={[styles.tipText, { color: colors.textPrimary }]}>
                  • Beginne mit Zellen, die wenige Möglichkeiten haben
                </Text>
                <Text style={[styles.tipText, { color: colors.textPrimary }]}>
                  • Verwende Notizen für komplexe Situationen
                </Text>
                <Text style={[styles.tipText, { color: colors.textPrimary }]}>
                  • Suche nach "Singles" - Zellen mit nur einer möglichen Zahl
                </Text>
                <Text style={[styles.tipText, { color: colors.textPrimary }]}>
                  • Achte auf "Paare" - wenn zwei Zellen in einer Einheit
                  dieselben zwei möglichen Zahlen haben
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

export default HowToPlayModal;