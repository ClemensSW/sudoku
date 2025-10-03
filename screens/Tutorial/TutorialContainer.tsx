// components/Tutorial/TutorialContainer.tsx
import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/contexts/navigation";
import { useRouter } from "expo-router";
import TutorialProgress from "./components/TutorialProgress";

// Import individual pages
import BasicRulesPage from "./pages/BasicRulesPage";
import GameplayPage from "./pages/GameplayPage";
import NotesPage from "./pages/NotesPage";

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
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const router = useRouter();

  // Stelle sicher, dass Navigation ausgeblendet ist, wenn TutorialContainer angezeigt wird
  useEffect(() => {
    hideBottomNav();

    return () => {
      resetBottomNav();
    };
  }, [hideBottomNav, resetBottomNav]);

  // Tutorial pages
  const pages = [
    { id: "basics", component: BasicRulesPage },
    { id: "gameplay", component: GameplayPage },
    { id: "notes", component: NotesPage },
  ];

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      resetBottomNav();
      onComplete();
    }
  }, [currentPage, pages.length, onComplete, resetBottomNav]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (onBack) {
      resetBottomNav();
      onBack();
    }
  }, [currentPage, onBack, resetBottomNav]);

  // Handler to exit tutorial and return to start screen directly
  const handleCloseTutorial = useCallback(() => {
    // Reset to automatic route-based navigation
    resetBottomNav();

    try {
      // Use the onComplete prop which should be connected to navigation
      onComplete();
    } catch (error) {
      console.error("Error closing tutorial:", error);
      Alert.alert("Error", "Couldn't close the tutorial properly");
    }
  }, [onComplete, resetBottomNav]);

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

      {/* Main Content - Use React.createElement to pass the correct props */}
      <View style={styles.pageContainer}>
        {React.createElement(pages[currentPage].component, {
          onNext: goToNextPage,
          onBack: goToPreviousPage,
          onClose: handleCloseTutorial,
          isFirstPage: currentPage === 0,
          isLastPage: currentPage === pages.length - 1
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: 1000,
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