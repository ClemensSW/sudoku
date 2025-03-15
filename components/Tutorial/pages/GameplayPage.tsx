// components/Tutorial/pages/GameplayPage.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "../TutorialPage";
import AnimatedBoard from "../components/AnimatedBoard";
import { spacing } from "@/utils/theme";

interface GameplayPageProps {
  onNext: () => void;
  onBack: () => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const GameplayPage: React.FC<GameplayPageProps> = ({
  onNext,
  onBack,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  
  // Example grid with some initial numbers
  const exampleGrid = [
    [6, 0, 2, 0, 0, 1, 9, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 5, 0],
    [0, 0, 0, 0, 0, 0, 6, 0, 3],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 6, 3, 0, 0, 0, 4, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
  ];
  
  // Demo animation state
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  
  // Simulate gameplay interaction
  useEffect(() => {
    const animationSteps = [
      () => setSelectedCell(null),
      () => setSelectedCell([2, 6]), // Select a cell
      () => setSelectedCell([4, 4]), // Select another cell
      () => setSelectedCell([7, 4]), // Select a third cell
      () => setSelectedCell(null),   // Reset
    ];
    
    const stepInterval = setInterval(() => {
      animationSteps[animationStep]();
      setAnimationStep((prev) => (prev + 1) % animationSteps.length);
    }, 2500);
    
    return () => clearInterval(stepInterval);
  }, [animationStep]);
  
  // Render number pad mockup
  const renderNumberPad = () => {
    return (
      <View style={styles.numberPadContainer}>
        <View style={styles.numberRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <View
              key={`num-${num}`}
              style={[
                styles.numberButton,
                { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[styles.numberText, { color: colors.buttonText }]}>
                {num}
              </Text>
            </View>
          ))}
        </View>
        <Animated.View 
          style={styles.gestureHint}
          entering={FadeInUp.delay(500).duration(500)}
        >
          <Feather name="arrow-up" size={18} color={colors.textSecondary} />
          <Text style={[styles.gestureText, { color: colors.textSecondary }]}>
            Tippe auf eine Zahl
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <TutorialPage
      title="Spielablauf"
      onNext={onNext}
      onBack={onBack}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
    >
      <View style={styles.contentContainer}>
        <Animated.View 
          style={styles.boardContainer}
          entering={FadeIn.duration(500)}
        >
          <AnimatedBoard 
            grid={exampleGrid}
            highlightCell={selectedCell}
            highlightRow={selectedCell?.[0]}
            highlightColumn={selectedCell?.[1]}
          />
          
          {selectedCell && (
            <Animated.View 
              style={styles.cellHint}
              entering={FadeIn.duration(300)}
            >
              <Feather name="arrow-down" size={18} color={colors.textSecondary} />
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                Ausgewählte Zelle
              </Text>
            </Animated.View>
          )}
        </Animated.View>
        
        <Animated.View 
          style={styles.instructionsContainer}
          entering={FadeInUp.delay(300).duration(500)}
        >
          <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>
            So spielst du:
          </Text>
          
          <View style={styles.instructionStep}>
            <View 
              style={[
                styles.stepNumber, 
                { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[styles.stepNumberText, { color: colors.buttonText }]}>
                1
              </Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
              Wähle eine Zelle durch Antippen
            </Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View 
              style={[
                styles.stepNumber, 
                { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[styles.stepNumberText, { color: colors.buttonText }]}>
                2
              </Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
              Tippe auf eine Zahl im Ziffernblock
            </Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View 
              style={[
                styles.stepNumber, 
                { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[styles.stepNumberText, { color: colors.buttonText }]}>
                3
              </Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
              Verwandte Zellen werden automatisch hervorgehoben
            </Text>
          </View>
        </Animated.View>
        
        {renderNumberPad()}
      </View>
    </TutorialPage>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  boardContainer: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  cellHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  hintText: {
    fontSize: 14,
    marginLeft: spacing.xs,
    fontWeight: "500",
  },
  instructionsContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  instructionStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "700",
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
  },
  numberPadContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  numberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "700",
  },
  gestureHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  gestureText: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
});

export default GameplayPage;