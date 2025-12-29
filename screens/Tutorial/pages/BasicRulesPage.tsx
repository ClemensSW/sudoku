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
import { useTranslation } from "react-i18next";
import { getPathColor } from "@/utils/pathColors";

interface BasicRulesPageProps {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void; // Added this prop to interface
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const BasicRulesPage: React.FC<BasicRulesPageProps> = ({
  onNext,
  onBack,
  onClose,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const { t } = useTranslation('tutorial');
  const theme = useTheme();
  const { colors, typography } = theme;

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

  // Definiere die Hervorhebungsfarben mit dynamischen Path-Farben
  // Row = Blau, Column = Grün, Block = Gelb (35% Opacity = 59 in Hex)
  const rowHighlightColor = getPathColor('blue', theme.isDark) + '59';
  const columnHighlightColor = getPathColor('green', theme.isDark) + '59';
  const blockHighlightColor = getPathColor('yellow', theme.isDark) + '59';

  return (
    <TutorialPage
      title={t('pages.basicRules.title')}
      onNext={onNext}
      onBack={onBack}
      onClose={onClose}
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
          <Text style={[styles.explanationText, { color: colors.textPrimary, fontSize: typography.size.md }]}>
            {t('pages.basicRules.explanation.part1')}
          </Text>

          <View style={styles.highlightRow}>
            <Text
              style={[
                styles.highlightText,
                { color: getPathColor('blue', theme.isDark), fontSize: typography.size.lg }
              ]}
            >
              {t('pages.basicRules.explanation.row')}
            </Text>
            <Text
              style={[styles.explanationText, { color: colors.textPrimary, fontSize: typography.size.md }]}
            >
              {t('pages.basicRules.explanation.part2')}
            </Text>
            <Text
              style={[
                styles.highlightText,
                { color: getPathColor('green', theme.isDark), fontSize: typography.size.lg }
              ]}
            >
              {t('pages.basicRules.explanation.column')}
            </Text>
            <Text
              style={[styles.explanationText, { color: colors.textPrimary, fontSize: typography.size.md }]}
            >
              {t('pages.basicRules.explanation.part3')}
            </Text>
            <Text
              style={[
                styles.highlightText,
                { color: getPathColor('yellow', theme.isDark), fontSize: typography.size.lg }
              ]}
            >
              {t('pages.basicRules.explanation.block')}
            </Text>
          </View>

          <Text style={[styles.explanationText, { color: colors.textPrimary, fontSize: typography.size.md }]}>
            {t('pages.basicRules.explanation.part4')}
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
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    marginHorizontal: 4,
  },
});

export default BasicRulesPage;