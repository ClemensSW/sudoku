import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/contexts/navigation";
import { Difficulty } from "@/utils/sudoku";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";
import TutorialContainer from "@/screens/Tutorial/TutorialContainer";
import { triggerHaptic } from "@/utils/haptics";
import { loadPausedGame, PausedGameState } from "@/utils/storage";

import { useBackgroundRotation } from "./hooks/useBackgroundRotation";
import { useButtonAnimation } from "./hooks/useButtonAnimation";
import { useTutorialManager } from "./hooks/useTutorialManager";
import { BackgroundImage } from "./components/BackgroundImage";
import { BottomButtonContainer } from "./components/BottomButtonContainer";
import { styles, getBackgroundHeight } from "./Start.styles";

const Start: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { hideBottomNav } = useNavigation();

  // Custom hooks
  const { backgroundImage, useFullQuality } = useBackgroundRotation();
  const { buttonAnimatedStyle, handleButtonPressIn, handleButtonPressOut } = useButtonAnimation();
  const { showHowToPlay, tutorialChecked, handleTutorialComplete, openTutorial } = useTutorialManager();

  // State for modals and game options
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [pausedGame, setPausedGame] = useState<PausedGameState | null>(null);

  const backgroundHeight = getBackgroundHeight();

  // Check for paused game on mount
  useEffect(() => {
    const checkPausedGame = async () => {
      const paused = await loadPausedGame();
      setPausedGame(paused);
    };
    checkPausedGame();
  }, []);

  // Refresh paused game state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkPausedGame = async () => {
        const paused = await loadPausedGame();
        setPausedGame(paused);
      };
      checkPausedGame();
    }, [])
  );

  // Game action handlers
  const handleStartGame = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(true);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    triggerHaptic("light");
  };

  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
    hideBottomNav();
    router.push({ pathname: "/(game)", params: { difficulty: selectedDifficulty } });
  };

  const handleResumeGame = () => {
    triggerHaptic("medium");
    hideBottomNav();
    // Clear paused game from state after resume
    setPausedGame(null);
    router.push({ pathname: "/(game)", params: { resume: "true" } });
  };

  const handleHowToPlayPress = () => {
    triggerHaptic("light");
    openTutorial();
    // HowToPlayModal handles navigation automatically
  };

  const onTutorialClose = () => {
    handleTutorialComplete();
    // HowToPlayModal resets navigation automatically
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />

      {/* Background Image */}
      <BackgroundImage
        backgroundImage={backgroundImage}
        useFullQuality={useFullQuality}
        backgroundHeight={backgroundHeight}
        insets={insets}
      />

      {/* Bottom Button Container */}
      <BottomButtonContainer
        theme={theme}
        insets={insets}
        buttonAnimatedStyle={buttonAnimatedStyle}
        onHowToPlayPress={handleHowToPlayPress}
        onStartGamePress={handleStartGame}
        onResumeGamePress={pausedGame ? handleResumeGame : undefined}
        pausedGame={pausedGame}
        onButtonPressIn={handleButtonPressIn}
        onButtonPressOut={handleButtonPressOut}
      />

      {/* Modals */}
      <DifficultyModal
        visible={showDifficultyModal}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleDifficultyChange}
        onClose={() => setShowDifficultyModal(false)}
        onConfirm={handleStartWithDifficulty}
      />

      {tutorialChecked && showHowToPlay && (
        <TutorialContainer onComplete={onTutorialClose} onBack={onTutorialClose} />
      )}
    </View>
  );
};

export default Start;