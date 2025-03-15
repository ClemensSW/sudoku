// components/Tutorial/pages/BasicRulesPage.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "../TutorialPage";
import AnimatedBoard from "../components/AnimatedBoard";
import { spacing } from "@/utils/theme";

interface BasicRulesPageProps {
  onNext: () => void;
  onBack: () => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

// Define colors for highlighting
const ROW_COLOR = "#FF9800"; // Orange
const COLUMN_COLOR = "#E91E63"; // Pink
const BLOCK_COLOR = "#4CAF50"; // Green

// Semi-transparent versions for board highlighting
const ROW_COLOR_BG = "rgba(255, 152, 0, 0.3)";
const COLUMN_COLOR_BG = "rgba(233, 30, 99, 0.3)";
const BLOCK_COLOR_BG = "rgba(76, 175, 80, 0.3)";

const BasicRulesPage: React.FC<BasicRulesPageProps> = ({
  onNext,
  onBack,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  // Example completed grid for demonstration
  const exampleGrid = [
    [6, 7, 2, 5, 3, 1, 9, 8, 4],
    [8, 3, 1, 6, 4, 9, 2, 5, 7],
    [5, 4, 9, 8, 2, 7, 6, 1, 3],
    [1, 5, 7, 4, 9, 6, 8, 3, 2],
    [3, 9, 6, 2, 1, 8, 7, 4, 5],
    [2, 8, 4, 7, 5, 3, 1, 9, 6],
    [4, 1, 5, 9, 6, 2, 3, 7, 8],
    [7, 6, 3, 1, 8, 5, 4, 2, 9],
    [9, 2, 8, 3, 7, 4, 5, 6, 1],
  ];

  // Animation state for highlighting different parts
  const [highlightState, setHighlightState] = useState<{
    row?: number;
    column?: number;
    block?: [number, number];
  }>({});

  // Cycle through highlighting examples
  useEffect(() => {
    const animations = [
      // Highlight a row
      { row: 3 },
      // Highlight a column
      { column: 6 },
      // Highlight a 3x3 block
      { block: [7, 1] as [number, number] },
      // Clear highlights
      {},
    ];

    let currentAnimation = 0;

    const animationInterval = setInterval(() => {
      setHighlightState(animations[currentAnimation]);
      currentAnimation = (currentAnimation + 1) % animations.length;
    }, 2000);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <TutorialPage
      title="Wie gespielt wird"
      onNext={onNext}
      onBack={onBack}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
    >
      <Animated.View
        style={styles.contentContainer}
        entering={FadeIn.duration(500)}
      >
        <AnimatedBoard
          grid={exampleGrid}
          highlightRow={highlightState.row}
          highlightColumn={highlightState.column}
          highlightBlock={highlightState.block}
          highlightRowColor={ROW_COLOR_BG}
          highlightColumnColor={COLUMN_COLOR_BG}
          highlightBlockColor={BLOCK_COLOR_BG}
        />

        <Animated.View
          style={styles.explanationContainer}
          entering={FadeInRight.delay(300).duration(500)}
        >
          <Text style={[styles.explanationText, { color: colors.textPrimary }]}>
            Das Ziel eines Sudoku-Puzzles ist es, das 9 x 9 Raster so zu füllen,
            dass jede
          </Text>

          <View style={styles.highlightRow}>
            <Text style={[styles.highlightText, { color: ROW_COLOR }]}>
              Reihe
            </Text>
            <Text
              style={[styles.explanationText, { color: colors.textPrimary }]}
            >
              , jede
            </Text>
            <Text style={[styles.highlightText, { color: COLUMN_COLOR }]}>
              Spalte
            </Text>
            <Text
              style={[styles.explanationText, { color: colors.textPrimary }]}
            >
              und jeder
            </Text>
            <Text style={[styles.highlightText, { color: BLOCK_COLOR }]}>
              Block
            </Text>
          </View>

          <Text style={[styles.explanationText, { color: colors.textPrimary }]}>
            alle Zahlen von 1 bis 9 ohne Wiederholung enthält.
          </Text>

          <Text
            style={[styles.explanationNotes, { color: colors.textSecondary }]}
          >
            Beginne mit den Zahlen, die bereits als Hinweis enthalten sind, und
            finde die richtige Lösung für jede Zelle.
          </Text>
        </Animated.View>
      </Animated.View>
    </TutorialPage>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  explanationContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  highlightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.xs,
  },
  highlightText: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 4,
  },
  explanationNotes: {
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.md,
    fontStyle: "italic",
  },
});

export default BasicRulesPage;
