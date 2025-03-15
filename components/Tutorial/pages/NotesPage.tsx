// components/Tutorial/pages/NotesPage.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "../TutorialPage";
import AnimatedBoard from "../components/AnimatedBoard";
import { spacing } from "@/utils/theme";

interface NotesPageProps {
  onNext: () => void;
  onBack: () => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const NotesPage: React.FC<NotesPageProps> = ({
  onNext,
  onBack,
  isFirstPage = false,
  isLastPage = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  
  // Example grid for notes demonstration
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
  const [selectedCell, setSelectedCell] = useState<[number, number]>([4, 4]);
  const [showNotes, setShowNotes] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  
  // Example notes
  const [notesExample, setNotesExample] = useState<{[key: string]: number[]}>({
    "4-4": [1, 3, 5, 7, 9],
  });
  
  // Simulate notes interaction
  useEffect(() => {
    const steps = [
      // Show cell selected
      () => {
        setSelectedCell([4, 4]);
        setShowNotes(false);
      },
      // Show notes mode
      () => {
        setShowNotes(true);
      },
      // Add more notes in different cells
      () => {
        setNotesExample({
          ...notesExample,
          "4-4": [1, 3, 5, 7, 9],
          "2-5": [2, 4, 7],
          "6-3": [1, 8],
        });
        setSelectedCell([2, 5]);
      },
      // Change selected cell
      () => {
        setSelectedCell([6, 3]);
      },
      // Reset animation
      () => {
        setSelectedCell([4, 4]);
        setShowNotes(false);
        setNotesExample({
          "4-4": [1, 3, 5, 7, 9],
        });
      },
    ];
    
    const stepInterval = setInterval(() => {
      steps[animationStep]();
      setAnimationStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    
    return () => clearInterval(stepInterval);
  }, [animationStep]);

  // Render notes toggle button
  const renderNotesButton = () => {
    return (
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <View 
            style={[
              styles.notesButton, 
              { 
                backgroundColor: showNotes ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }
            ]}
          >
            <Feather 
              name="edit-3" 
              size={20} 
              color={showNotes ? colors.buttonText : colors.textPrimary} 
            />
          </View>
          <View style={styles.controlLabel}>
            <Text style={[styles.controlText, { color: colors.textPrimary }]}>
              Notizen-Modus
            </Text>
            <Text style={[styles.controlSubtext, { color: colors.textSecondary }]}>
              {showNotes ? "Aktiviert" : "Deaktiviert"}
            </Text>
          </View>
        </View>
        
        <Animated.View 
          style={styles.infoContainer}
          entering={FadeInRight.delay(500).duration(500)}
        >
          <Feather name="info" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Im Notizen-Modus werden mögliche Zahlen für eine Zelle gespeichert
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <TutorialPage
      title="Notizen verwenden"
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
            showNotes={showNotes}
            notes={notesExample}
          />
        </Animated.View>
        
        {renderNotesButton()}
        
        <Animated.View
          style={styles.explanationContainer}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Text style={[styles.explanationTitle, { color: colors.textPrimary }]}>
            Warum Notizen verwenden?
          </Text>
          
          <View style={styles.benefitRow}>
            <View 
              style={[
                styles.benefitIcon, 
                { backgroundColor: `${colors.primary}20` }
              ]}
            >
              <Feather name="check-circle" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
              Mögliche Kandidaten für jede Zelle verfolgen
            </Text>
          </View>
          
          <View style={styles.benefitRow}>
            <View 
              style={[
                styles.benefitIcon, 
                { backgroundColor: `${colors.primary}20` }
              ]}
            >
              <Feather name="check-circle" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
              Komplexe Sudoku-Rätsel leichter lösen
            </Text>
          </View>
          
          <View style={styles.benefitRow}>
            <View 
              style={[
                styles.benefitIcon, 
                { backgroundColor: `${colors.primary}20` }
              ]}
            >
              <Feather name="check-circle" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
              Überblick über mögliche Lösungswege behalten
            </Text>
          </View>
        </Animated.View>
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
  controlsContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  notesButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  controlLabel: {
    flex: 1,
  },
  controlText: {
    fontSize: 16,
    fontWeight: "600",
  },
  controlSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: `rgba(0, 0, 0, 0.03)`,
  },
  infoText: {
    fontSize: 14,
    marginLeft: spacing.xs,
    flex: 1,
  },
  explanationContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  benefitText: {
    fontSize: 16,
    flex: 1,
  },
});

export default NotesPage;