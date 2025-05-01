// components/Tutorial/pages/GameplayPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "../TutorialPage";
import { spacing } from "@/utils/theme";

// Manuell implementiertes SudokuBoard für die Tutorial-Animation
import SudokuBoardDemo from "./SudokuBoardDemo";

interface GameplayPageProps {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void; // Added this prop to interface
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const GameplayPage: React.FC<GameplayPageProps> = ({
  onNext,
  onBack,
  onClose,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  // Ein gültiges Sudoku mit eindeutiger Lösung in der Mitte (nur 5 passt)
  const exampleGrid = [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 1, 7, 3, 0, 0, 0],
    [1, 2, 3, 4, 0, 6, 7, 8, 9],
    [0, 0, 0, 2, 9, 8, 0, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 0, 0, 0, 0],
    [0, 0, 0, 0, 8, 0, 0, 0, 0],
  ];

  // Animation state
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [animationRunning, setAnimationRunning] = useState(false);
  const [stepNumber, setStepNumber] = useState(0);

  // Create mutable grid
  const [gridState, setGridState] = useState([
    ...exampleGrid.map((row) => [...row]),
  ]);

  // Target cell and value
  const targetRow = 4;
  const targetCol = 4;
  const targetValue = 5;
  const targetIndex = targetValue - 1; // Array index for button 5 is 4

  // Animation values
  const numberScales = Array.from({ length: 9 }, () => useSharedValue(1));
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Start demo animation on component mount with delay
  useEffect(() => {
    startAnimation();

    return () => {
      // Cleanup any running timers
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Start the animation sequence
  const startAnimation = () => {
    if (animationRunning) return;

    setAnimationRunning(true);
    setStepNumber(0);

    // Reset grid to initial state
    setGridState([...exampleGrid.map((row) => [...row])]);
    setSelectedCell(null);

    // Animation mit kürzeren Pausen zwischen den Schritten
    setTimeout(() => {
      // Step 1: Zelle auswählen
      setSelectedCell([targetRow, targetCol]);
      setStepNumber(1);

      // Pause vor dem nächsten Schritt
      setTimeout(() => {
        // Step 2: Nummer auswählen
        numberScales[targetIndex].value = withSequence(
          withTiming(0.9, { duration: 100 }),
          withTiming(1.1, { duration: 150 }),
          withTiming(1, { duration: 150 })
        );

        setStepNumber(2);

        // Pause vor dem Platzieren der Zahl
        setTimeout(() => {
          // Step 3: Zahl in der Zelle anzeigen
          const newGrid = [...gridState];
          newGrid[targetRow][targetCol] = targetValue;
          setGridState(newGrid);
          setStepNumber(3);

          // Pause am Ende, dann Animation zurücksetzen und neu starten
          animationRef.current = setTimeout(() => {
            setAnimationRunning(false);

            // Warten und dann Animation neu starten
            animationRef.current = setTimeout(() => {
              startAnimation();
            }, 1500);
          }, 2500);
        }, 2500);
      }, 2000);
    }, 500);
  };

  // Get instruction text based on current step
  const getInstructionText = () => {
    switch (stepNumber) {
      case 1:
        return "Du wählst eine leere Zelle aus";
      case 2:
        return "Welche Zahl passt in die Zelle?";
      case 3:
        return "Die Zahl 5 passt perfekt in die Zelle";
      default:
        return "";
    }
  };

  // Render function for the number pad buttons - EXAKT wie im Spiel
  const renderNumberButtons = () => {
    return (
      <View style={styles.numberPadContainer}>
        <View style={styles.numbersRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => {
            // Animierter Stil für jeden Button
            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: numberScales[index].value }],
              };
            });

            // Die folgenden Stile entsprechen genau dem, was in NumberPad.tsx verwendet wird
            return (
              <View
                key={`num-${num}`}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 1, // Exakt wie in NumberPad.styles.ts
                }}
              >
                <Animated.View
                  style={[
                    {
                      width: "100%",
                      height: 60,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.primary, // Theme-Farbe statt fester Farbe
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    },
                    animatedStyle,
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "600",
                      color: colors.buttonText, // Theme-Farbe für den Text
                    }}
                  >
                    {num}
                  </Text>
                </Animated.View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <TutorialPage
      title="Spielablauf"
      onNext={onNext}
      onBack={onBack}
      onClose={onClose}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
    >
      <View style={styles.contentContainer}>
        <Animated.View
          style={styles.boardContainer}
          entering={FadeIn.duration(500)}
        >
          <SudokuBoardDemo
            puzzle={gridState}
            initialPuzzle={exampleGrid}
            selectedCell={selectedCell}
            onCellPress={() => {}} // Dummy function, keine Interaktion nötig
          />
        </Animated.View>

        <Animated.View
          style={styles.instructionContainer}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Text style={[styles.instruction, { color: colors.textPrimary }]}>
            {getInstructionText()}
          </Text>
        </Animated.View>

        {/* Number Pad mit exakt dem gleichen Styling wie im Spiel */}
        {renderNumberButtons()}

        {/* Pfeil zur Visualisierung der Auswahl */}
        {stepNumber === 2 && (
          <Animated.View
            style={styles.arrowContainer}
            entering={FadeIn.duration(300)}
          >
            <Feather
              name="arrow-up"
              size={28}
              color={colors.primary} // Auch hier Theme-Farbe
              style={styles.arrow}
            />
          </Animated.View>
        )}
      </View>
    </TutorialPage>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  boardContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  instructionContainer: {
    width: "100%",
    height: 60,
    marginTop: 8,
    marginBottom: 28,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  instruction: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },
  
  // Number pad styling - EXAKT wie im echten Spiel
  numberPadContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginTop: 16,
  },
  numbersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
  },
  
  // Animation helper elements
  arrowContainer: {
    position: "absolute",
    bottom: 170,
    alignSelf: "center",
    zIndex: 10,
  },
  arrow: {
    transform: [{ rotate: "180deg" }],
  },
});

export default GameplayPage;