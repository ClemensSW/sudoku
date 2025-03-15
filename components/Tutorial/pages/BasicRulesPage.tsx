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

// Define colors for highlighting
const ROW_COLOR = "#4C63E6"; // Vibrant blue
const COLUMN_COLOR = "#FF4081"; // Vibrant pink
const BLOCK_COLOR = "#4CAF50"; // Vibrant green

// Semi-transparent versions for board highlighting
const ROW_COLOR_BG = "rgba(76, 99, 230, 0.35)";
const COLUMN_COLOR_BG = "rgba(255, 64, 129, 0.35)";
const BLOCK_COLOR_BG = "rgba(76, 175, 80, 0.35)";

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
  const rowValues = [1, 5, 7, 4, 9, 0, 8, 3, 2]; // Missing 6 at index 5
  const colValues = [9, 2, 6, 8, 7, 1, 3, 4, 0]; // Missing 5 at index 8
  const blockValues = [
    [7, 6, 3],
    [9, 2, 8],
    [5, 1, 0], // Missing 4 at [2, 2]
  ];

  // Complete arrays with all numbers
  const completeRowValues = [1, 5, 7, 4, 9, 6, 8, 3, 2];
  const completeColValues = [9, 2, 6, 8, 7, 1, 3, 4, 5];
  const completeBlockValues = [
    [7, 6, 3],
    [9, 2, 8],
    [5, 1, 4],
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
    // Simplify to just three basic animations plus clear
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
          highlightRowColor={ROW_COLOR_BG}
          highlightColumnColor={COLUMN_COLOR_BG}
          highlightBlockColor={BLOCK_COLOR_BG}
          // Remove highlightCell prop completely if it exists
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
