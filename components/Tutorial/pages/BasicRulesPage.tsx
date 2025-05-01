// components/Tutorial/pages/BasicRulesPage.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
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

const BasicRulesPage: React.FC<BasicRulesPageProps> = ({
  onNext,
  onBack,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  // Empty grid as a base
  const emptyGrid = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  // State for grid that will show numbers only in highlighted cells
  const [displayGrid, setDisplayGrid] = useState(emptyGrid);

  // Animation state for highlighting different parts
  const [highlightState, setHighlightState] = useState<{
    row?: number;
    column?: number;
    block?: [number, number];
  }>({});

  // State to track if we should show the missing number
  const [showMissingNumber, setShowMissingNumber] = useState(false);

  // Arrays with exactly one missing number
  const rowValues = [1, 2, 3, 4, 5, 0, 7, 8, 9]; // Missing 6 at index 5
  const colValues = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // Missing 5 at index 8
  const blockValues = [
    [1, 2, 3],
    [0, 5, 6],
    [7, 8, 9], // Missing 4 at [2, 2]
  ];

  // Complete arrays with all numbers
  const completeRowValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const completeColValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const completeBlockValues = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  // Update display grid based on highlights and animation state
  useEffect(() => {
    // Start with an empty grid
    const newGrid = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    // Add numbers to highlighted row
    if (highlightState.row !== undefined) {
      const row = highlightState.row;
      const valuesToUse = showMissingNumber ? completeRowValues : rowValues;

      for (let col = 0; col < 9; col++) {
        newGrid[row][col] = valuesToUse[col];
      }
    }

    // Add numbers to highlighted column
    else if (highlightState.column !== undefined) {
      const col = highlightState.column;
      const valuesToUse = showMissingNumber ? completeColValues : colValues;

      for (let row = 0; row < 9; row++) {
        newGrid[row][col] = valuesToUse[row];
      }
    }

    // Add numbers to highlighted block
    else if (highlightState.block) {
      const blockRow = Math.floor(highlightState.block[0] / 3) * 3;
      const blockCol = Math.floor(highlightState.block[1] / 3) * 3;
      const valuesToUse = showMissingNumber ? completeBlockValues : blockValues;

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          newGrid[blockRow + r][blockCol + c] = valuesToUse[r][c];
        }
      }
    }

    setDisplayGrid(newGrid);
  }, [highlightState, showMissingNumber]);

  // Cycle through highlighting examples with missing number animation
  useEffect(() => {
    // Demonstrationen der drei grundlegenden Sudoku-Regeln
    const animations = [
      // Highlight a row with row number
      { row: 3, column: undefined, block: undefined },
      // Highlight a column with column number
      { row: undefined, column: 6, block: undefined },
      // Highlight a block with coordinates
      { row: undefined, column: undefined, block: [7, 1] as [number, number] },
      // Clear all highlights
      { row: undefined, column: undefined, block: undefined },
    ];

    let currentAnimation = 0;
    // Store all timeout IDs for proper cleanup
    const timeoutIds: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      // First hide the missing number
      setShowMissingNumber(false);

      // Set the current highlight state
      setHighlightState(animations[currentAnimation]);

      // Only show missing number if we have a highlight
      const hasHighlight =
        animations[currentAnimation].row !== undefined ||
        animations[currentAnimation].column !== undefined ||
        animations[currentAnimation].block !== undefined;

      if (hasHighlight) {
        // Show the missing number after a delay
        const timeout1 = setTimeout(() => {
          setShowMissingNumber(true);
        }, 1500); // Longer delay to better see the missing number
        timeoutIds.push(timeout1);

        // Move to next animation after showing completed set
        const timeout2 = setTimeout(() => {
          currentAnimation = (currentAnimation + 1) % animations.length;
          runAnimation();
        }, 3000); // Total duration for each animation
        timeoutIds.push(timeout2);
      } else {
        // If we're in the empty state, move to next more quickly
        const timeout3 = setTimeout(() => {
          currentAnimation = (currentAnimation + 1) % animations.length;
          runAnimation();
        }, 1000);
        timeoutIds.push(timeout3);
      }
    };

    // Start the animation sequence
    runAnimation();

    // Cleanup function
    return () => {
      // Clear all timeouts
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Definiere die Hervorhebungsfarben basierend auf der Theme-Farbe
  // Wir nutzen jetzt die gleichen Farben, die auch in AnimatedBoard definiert wurden
  // Im Light und Dark Mode gut unterscheidbar
  const rowHighlightColor = theme.isDark 
    ? "rgba(138, 180, 248, 0.35)" // Blau im Dark Mode
    : "rgba(66, 133, 244, 0.35)"; // Blau im Light Mode
    
  const columnHighlightColor = theme.isDark 
    ? "rgba(242, 139, 130, 0.35)" // Rot im Dark Mode
    : "rgba(234, 67, 53, 0.35)"; // Rot im Light Mode
    
  const blockHighlightColor = theme.isDark 
    ? "rgba(129, 201, 149, 0.35)" // Grün im Dark Mode
    : "rgba(52, 168, 83, 0.35)"; // Grün im Light Mode

  return (
    <TutorialPage
      title="Wie man spielt"
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
          grid={displayGrid}
          highlightRow={highlightState.row}
          highlightColumn={highlightState.column}
          highlightBlock={highlightState.block}
          highlightRowColor={rowHighlightColor}
          highlightColumnColor={columnHighlightColor}
          highlightBlockColor={blockHighlightColor}
        />

        <Animated.View
          style={styles.explanationContainer}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Text style={[styles.explanationText, { color: colors.textPrimary }]}>
            Das Ziel eines Sudoku-Puzzles ist es, das 9 x 9 Raster so zu füllen,
            dass jede
          </Text>

          <View style={styles.highlightRow}>
            <Text 
              style={[
                styles.highlightText, 
                // Gleiche Farbe wie die Reihenhervorhebung, aber intensiver
                { color: theme.isDark ? "#8AB4F8" : "#4285F4" }
              ]}
            >
              Reihe
            </Text>
            <Text
              style={[styles.explanationText, { color: colors.textPrimary }]}
            >
              , jede
            </Text>
            <Text 
              style={[
                styles.highlightText, 
                // Gleiche Farbe wie die Spaltenhervorhebung, aber intensiver
                { color: theme.isDark ? "#F28B82" : "#EA4335" }
              ]}
            >
              Spalte
            </Text>
            <Text
              style={[styles.explanationText, { color: colors.textPrimary }]}
            >
              und jeder
            </Text>
            <Text 
              style={[
                styles.highlightText, 
                // Gleiche Farbe wie die Blockhervorhebung, aber intensiver
                { color: theme.isDark ? "#81C995" : "#34A853" }
              ]}
            >
              Block
            </Text>
          </View>

          <Text style={[styles.explanationText, { color: colors.textPrimary }]}>
            alle Zahlen von 1 bis 9 ohne Wiederholung enthält.
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
});

export default BasicRulesPage;