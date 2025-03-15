// components/Tutorial/pages/GameplayPage.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
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
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([2, 6]);
  
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
          />
        </Animated.View>
        
        <Animated.View 
          style={styles.instructionContainer}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Text style={[styles.instruction, { color: colors.textPrimary }]}>
            Wähle eine Zelle und tippe auf die gewünschte Zahl, um die Zelle zu füllen.
          </Text>
        </Animated.View>
        
        {/* Number Pad Example */}
        <View style={styles.numberPadExample}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <View
              key={`numpad-${num}`}
              style={[
                styles.numberButton,
                { 
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                }
              ]}
            >
              <Text style={styles.numberButtonText}>{num}</Text>
            </View>
          ))}
        </View>
      </View>
    </TutorialPage>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boardContainer: {
    alignItems: "center",
  },
  instructionContainer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  instruction: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
  numberPadExample: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: spacing.xl,
    width: "80%",
    maxWidth: 360,
  },
  numberButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  numberButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  }
});

export default GameplayPage;