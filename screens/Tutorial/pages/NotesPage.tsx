// components/Tutorial/pages/NotesPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "../TutorialPage";
import AnimatedBoard from "../components/AnimatedBoard";
import { spacing } from "@/utils/theme";
import { useTranslation } from "react-i18next";
import PencilIcon from "@/assets/svg/pencil.svg";
import { useProgressColor } from "@/hooks/useProgressColor";

interface NotesPageProps {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void; // Added this prop to interface
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const NotesPage: React.FC<NotesPageProps> = ({
  onNext,
  onBack,
  onClose,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const { t } = useTranslation('tutorial');
  const theme = useTheme();
  const { colors, typography } = theme;
  const progressColor = useProgressColor();

  // Example grid
  const exampleGrid = [
    [0, 0, 2, 0, 0, 1, 9, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 5, 0],
    [0, 0, 0, 0, 0, 0, 6, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 6, 0, 2, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 6, 0, 0, 0, 4, 0, 0],
    [0, 0, 0, 0, 8, 0, 0, 0, 0],
  ];

  // Dynamic notes state that will change over time
  const [animatedNotes, setAnimatedNotes] = useState<{ [key: string]: number[] }>({
    "4-4": [], // Start with empty notes
  });

  // Selected cell
  const [selectedCell] = useState<[number, number]>([4, 4]);
  
  // Animation sequence values
  const noteSequence = [1, 3, 5, 7, 9]; // The values we want to show in order
  
  // Animation effect to cycle through notes
  useEffect(() => {
    // Keep track of all timeouts for proper cleanup
    const timeouts: NodeJS.Timeout[] = [];
    
    // Function to run the animation
    const runAnimation = () => {
      // Reset notes at the beginning
      setAnimatedNotes({ "4-4": [] });
      
      // Add each note one by one with increasing delays
      noteSequence.forEach((note, index) => {
        const timeout = setTimeout(() => {
          setAnimatedNotes(prev => ({
            "4-4": [...(prev["4-4"] || []), note]
          }));
        }, 800 * (index + 1)); // 800ms between each note
        
        timeouts.push(timeout);
      });
      
      // After showing all notes, pause briefly with all notes visible
      const pauseTimeout = setTimeout(() => {
        // Then clear all notes
        setAnimatedNotes({ "4-4": [] });
        
        // Wait and restart the animation
        const restartTimeout = setTimeout(() => {
          runAnimation();
        }, 1200); // Wait before restarting
        
        timeouts.push(restartTimeout);
      }, 800 * (noteSequence.length + 1)); // Wait a bit longer after showing all notes
      
      timeouts.push(pauseTimeout);
    };
    
    // Start the initial animation with a slight delay
    const initialDelay = setTimeout(() => {
      runAnimation();
    }, 1000);
    
    timeouts.push(initialDelay);
    
    // Clean up all timeouts when component unmounts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <TutorialPage
      title={t('pages.notes.title')}
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
          <AnimatedBoard
            grid={exampleGrid}
            highlightCell={selectedCell}
            showNotes={true}
            notes={animatedNotes} // Pass our animated notes to the board
          />
        </Animated.View>

        {/* Notes Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.notesButton, { backgroundColor: theme.isDark ? colors.surface : colors.numberPadButton, borderWidth: 2, borderColor: progressColor }]}
            onPress={() => {}}
          >
            <PencilIcon width={32} height={32} color={progressColor} />
          </TouchableOpacity>
          <Text style={[styles.buttonLabel, { color: colors.textPrimary, fontSize: typography.size.md }]}>
            {t('pages.notes.buttonLabel')}
          </Text>
        </View>

        <Animated.View
          style={styles.explanationContainer}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Text style={[styles.explanationText, { color: colors.textPrimary, fontSize: typography.size.md }]}>
            {t('pages.notes.explanation')}
          </Text>
        </Animated.View>
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
  buttonContainer: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  notesButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: spacing.sm,
  },
  buttonLabel: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  explanationContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  explanationText: {
    // fontSize set dynamically via theme.typography
    lineHeight: 24,
    textAlign: "center",
  },
});

export default NotesPage;