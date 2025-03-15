// components/Tutorial/TutorialContainer.tsx
import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialPage from "./TutorialPage";
import TutorialProgress from "./components/TutorialProgress";

// Import individual pages
import BasicRulesPage from "./pages/BasicRulesPage";
import GameplayPage from "./pages/GameplayPage";
import NotesPage from "./pages/NotesPage";
import TipsPage from "./pages/TipsPage";

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

  // Tutorial pages
  const pages = [
    { id: "basics", component: BasicRulesPage },
    { id: "gameplay", component: GameplayPage },
    { id: "notes", component: NotesPage },
    { id: "tips", component: TipsPage },
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

      {/* Main Content */}
      <View style={styles.pageContainer}>
        <CurrentPageComponent
          onNext={goToNextPage}
          onBack={goToPreviousPage}
          isFirstPage={currentPage === 0}
          isLastPage={currentPage === pages.length - 1}
        />
      </View>

      {/* Tutorial Progress */}
      <View style={styles.progressContainer}>
        <TutorialProgress
          currentStep={currentPage + 1}
          totalSteps={pages.length}
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
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default TutorialContainer;
