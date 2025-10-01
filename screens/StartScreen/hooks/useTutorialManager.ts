import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TUTORIAL_SHOWN_KEY = "@sudoku/tutorial_shown";

export const useTutorialManager = () => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [tutorialChecked, setTutorialChecked] = useState(false);

  useEffect(() => {
    const checkIfTutorialShown = async () => {
      try {
        const tutorialShown = await AsyncStorage.getItem(TUTORIAL_SHOWN_KEY);
        if (!tutorialShown) {
          setShowHowToPlay(true);
        }
        setTutorialChecked(true);
      } catch (error) {
        console.error("Error checking tutorial status:", error);
        setTutorialChecked(true);
      }
    };

    checkIfTutorialShown();
  }, []);

  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_SHOWN_KEY, "true");
    } catch (error) {
      console.error("Error saving tutorial status:", error);
    }
    setShowHowToPlay(false);
  };

  const openTutorial = () => {
    setShowHowToPlay(true);
  };

  return {
    showHowToPlay,
    tutorialChecked,
    handleTutorialComplete,
    openTutorial,
  };
};
