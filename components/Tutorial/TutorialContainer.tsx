// components/Tutorial/TutorialContainer.tsx
import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "./TutorialPage";
import TutorialProgress from "./components/TutorialProgress";

// Import individual pages - TipsPage is removed
import BasicRulesPage from "./pages/BasicRulesPage";
import GameplayPage from "./pages/GameplayPage";
import NotesPage from "./pages/NotesPage";
// TipsPage import removed

interface TutorialContainerProps {
  onComplete: () => void;
  onBack?: () => void;
}

const TutorialContainer: React.FC<TutorialContainerProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  // Tutorial pages - TipsPage removed
  const pages = [
    { id: "basics", component: BasicRulesPage },
    { id: "gameplay", component: GameplayPage },
    { id: "notes", component: NotesPage },
    // TipsPage entry removed
  ];

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  }, [currentPage, pages.length, onComplete]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (onBack) {
      onBack();
    }
  }, [currentPage, onBack]);

  const CurrentPageComponent = pages[currentPage].component;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Progress Indicator */}
      <View style={[styles.progressContainer, { marginTop: insets.top + 56 }]}>
        <TutorialProgress
          currentStep={currentPage + 1}
          totalSteps={pages.length}
        />
      </View>

      {/* Main Content */}
      <View style={styles.pageContainer}>
        <CurrentPageComponent
          onNext={goToNextPage}
          onBack={goToPreviousPage}
          isFirstPage={currentPage === 0}
          isLastPage={currentPage === pages.length - 1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  progressContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TutorialContainer;

// components/Tutorial/index.ts
// Update the exports to remove TipsPage
export { default as TutorialContainer } from "./TutorialContainer";
export { default as TutorialPage } from "./TutorialPage";
export { default as TutorialProgress } from "./components/TutorialProgress";
export { default as AnimatedBoard } from "./components/AnimatedBoard";

// Export pages
export { default as BasicRulesPage } from "./pages/BasicRulesPage";
export { default as GameplayPage } from "./pages/GameplayPage";
export { default as NotesPage } from "./pages/NotesPage";
