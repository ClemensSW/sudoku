import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/utils/NavigationContext";
import { Difficulty } from "@/utils/sudoku";
import DifficultyModal from "@/components/DifficultyModal/DifficultyModal";
import HowToPlayModal from "@/components/HowToPlayModal/HowToPlayModal";
import { triggerHaptic } from "@/utils/haptics";

import { useBackgroundRotation } from "./hooks/useBackgroundRotation";
import { useButtonAnimation } from "./hooks/useButtonAnimation";
import { useTutorialManager } from "./hooks/useTutorialManager";
import { BackgroundImage } from "./components/BackgroundImage";
import { BottomButtonContainer } from "./components/BottomButtonContainer";
import { styles, getBackgroundHeight } from "./StartScreen.styles";

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { setShowNavigation } = useNavigation();

  // Custom hooks
  const { backgroundImage, useFullQuality } = useBackgroundRotation();
  const { buttonAnimatedStyle, handleButtonPressIn, handleButtonPressOut } = useButtonAnimation();
  const { showHowToPlay, tutorialChecked, handleTutorialComplete, openTutorial } = useTutorialManager();

  // State for modals and game options
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const backgroundHeight = getBackgroundHeight();

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
    router.push({ pathname: "/game", params: { difficulty: selectedDifficulty } });
  };

  const handleHowToPlayPress = () => {
    triggerHaptic("light");
    openTutorial();
    setShowNavigation(false);
  };

  const onTutorialClose = () => {
    handleTutorialComplete();
    setShowNavigation(true);
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

      {tutorialChecked && (
        <HowToPlayModal visible={showHowToPlay} onClose={onTutorialClose} />
      )}
    </View>
  );
};

export default StartScreen;