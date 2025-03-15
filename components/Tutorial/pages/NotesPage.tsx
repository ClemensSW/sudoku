// components/Tutorial/pages/NotesPage.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
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

  // Example grid
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

  // Example notes
  const [notes] = useState<{ [key: string]: number[] }>({
    "4-4": [1, 3, 5, 7, 9],
    "2-5": [2, 4, 7],
    "6-3": [1, 8],
  });

  // Selected cell
  const [selectedCell] = useState<[number, number]>([4, 4]);

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
            showNotes={true}
            notes={notes}
          />
        </Animated.View>

        {/* Notes Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.notesButton, { backgroundColor: colors.primary }]}
            onPress={() => {}}
          >
            <Feather name="edit-3" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.buttonLabel, { color: colors.textPrimary }]}>
            Notizen-Modus
          </Text>
        </View>

        <Animated.View
          style={styles.explanationContainer}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Text style={[styles.explanationText, { color: colors.textPrimary }]}>
            Tippen auf den Notizen-Button, um Notizen zu möglichen Ziffern
            hinzuzufügen oder zu entfernen.
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
    fontSize: 16,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  explanationContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});

export default NotesPage;