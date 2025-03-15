// components/Tutorial/pages/GameplayPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";
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

const BUTTON_BLUE = "#4361EE"; // Match the game's blue color
const ANIMATION_DURATION = 800;

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

  // Animation state
  const [selectedCell, setSelectedCell] = useState<
    [number, number] | undefined
  >([4, 2]);
  const [filledValue, setFilledValue] = useState<number | null>(null);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [stepNumber, setStepNumber] = useState(0);

  // Create mutable grid
  const [gridState, setGridState] = useState(
    JSON.parse(JSON.stringify(exampleGrid))
  );

  // Animation values
  const numberScales = Array.from({ length: 9 }, () => useSharedValue(1));
  const activeNumberIndex = useRef(3); // 4 will be highlighted (index 3)

  // Start demo animation on component mount
  useEffect(() => {
    startAnimation();

    // Loop the animation
    const intervalId = setInterval(() => {
      if (!animationRunning) {
        startAnimation();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Start the animation sequence
  const startAnimation = () => {
    if (animationRunning) return;

    setAnimationRunning(true);
    setStepNumber(0);

    // Reset grid to initial state
    setGridState(JSON.parse(JSON.stringify(exampleGrid)));
    setFilledValue(null);

    // Start animation sequence
    setTimeout(() => {
      // Step 1: Select a cell
      setSelectedCell([4, 2]);
      setStepNumber(1);

      // Step 2: Press a number button (after delay)
      setTimeout(() => {
        // Animate the button press
        const index = activeNumberIndex.current;
        numberScales[index].value = withSequence(
          withTiming(0.8, { duration: 150 }),
          withTiming(1.1, { duration: 200 }),
          withTiming(1, { duration: 150 })
        );

        setStepNumber(2);

        // Step 3: Show number in the cell
        setTimeout(() => {
          // Update the grid with the new value
          const newGrid = [...gridState];
          newGrid[4][2] = 4; // Set the cell value to 4
          setGridState(newGrid);
          setFilledValue(4);
          setStepNumber(3);

          // Step 4: Animation complete
          setTimeout(() => {
            setAnimationRunning(false);
            setStepNumber(0);
          }, 3000);
        }, 800);
      }, 1500);
    }, 500);
  };

  // Single instruction text that doesn't change layout
  const getInstructionText = () => {
    return "Wähle eine leere Zelle und tippe dann auf eine passende Zahl";
  };

  // Render function for the number pad buttons - exactly as in the game
  const renderNumberButtons = () => {
    return (
      <View style={styles.numberPadContainer}>
        <View style={styles.numbersRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => {
            const isActive = num === 4; // The number 4 will be active

            // Create animated style for each button
            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: numberScales[index].value }],
                backgroundColor:
                  isActive && stepNumber >= 2
                    ? withDelay(
                        stepNumber === 2 ? 300 : 0,
                        withTiming(BUTTON_BLUE, { duration: 300 })
                      )
                    : BUTTON_BLUE,
              };
            });

            return (
              <View
                key={`num-${num}`}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 2,
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
                      backgroundColor: BUTTON_BLUE,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    },
                    animatedStyle,
                  ]}
                >
                  <Text style={styles.buttonText}>{num}</Text>
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
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
    >
      <View style={styles.contentContainer}>
        <Animated.View
          style={styles.boardContainer}
          entering={FadeIn.duration(500)}
        >
          <AnimatedBoard
            grid={gridState}
            highlightCell={selectedCell}
            showAnimation={true}
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

        {/* Number Pad with game-accurate styling */}
        {renderNumberButtons()}

        {/* Visual indicator: arrow pointing from number pad to board */}
        {stepNumber === 2 && (
          <Animated.View
            style={styles.arrowContainer}
            entering={FadeIn.duration(300)}
          >
            <Feather
              name="arrow-up"
              size={28}
              color={BUTTON_BLUE}
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
    marginTop: 8,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  instruction: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
  },
  // Number pad styling to exactly match the real game
  numberPadContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginTop: 16,
    alignSelf: "center",
  },
  numbersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    height: 60,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Animation helper elements
  arrowContainer: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
  },
  arrow: {
    transform: [{ rotate: "180deg" }],
  },
});

export default GameplayPage;
