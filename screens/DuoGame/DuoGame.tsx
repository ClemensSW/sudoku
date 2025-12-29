// screens/DuoGameScreen/DuoGameScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, ImageSourcePropType } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { duoQuitGameAlert } from "@/components/CustomAlert/AlertHelpers";
import { useTranslation } from "react-i18next";
import { Difficulty } from "@/utils/sudoku";
import { GameSettings } from "@/utils/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Game Components
import DuoGameBoard from "./components/DuoGameBoard";
import DuoGameControls from "./components/DuoGameControls";
import DuoGameCompletionModal from "./components/DuoGameCompletionModal";
import Timer from "@/components/Timer/Timer";
import DuoGameSettingsPanel from "./components/DuoGameSettingsPanel";

// NEU: Progression-Screens
import LevelPathScreen from "@/screens/GameCompletion/screens/LevelPathScreen";
import LandscapeScreen from "@/screens/GameCompletion/screens/LandscapeScreen";
import StreakScreen from "@/screens/GameCompletion/screens/StreakScreen";
import DuoActionButtons from "./components/DuoActionButtons";

// Game Logic Hooks
import { useDuoGameState } from "./hooks/useDuoGameState";
import { useDuoCompletionFlow } from "./hooks/useDuoCompletionFlow";
import { useGameSettings } from "../Game/hooks/useGameSettings";

// Landscape Integration
import { useLandscapes } from "@/screens/Gallery/hooks/useLandscapes";

// Profile und Gegner-Daten
import { loadUserProfile, UserProfile } from "@/utils/profileStorage";
import { generateOpponentData } from "./utils/opponentNames";
import { getAvatarSourceFromUri, DEFAULT_AVATAR } from "@/screens/Leistung/utils/defaultAvatars";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";

// Constants
const MAX_HINTS = 3;

interface DuoGameScreenProps {
  initialDifficulty?: Difficulty;
}

const DuoGame: React.FC<DuoGameScreenProps> = ({
  initialDifficulty = "medium",
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { t, i18n } = useTranslation('duoGame');

  // States for game initialization
  const [isLoading, setIsLoading] = useState(true);
  const [gameInitialized, setGameInitialized] = useState(false);

  // States for the Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({
    winner: 0 as 0 | 1 | 2,
    reason: "completion" as "completion" | "errors",
  });

  // Add this state for settings panel
  const [showSettings, setShowSettings] = useState(false);

  // Spieler-Profil und Gegner-Daten
  const [ownerProfile, setOwnerProfile] = useState<UserProfile | null>(null);

  // Gegner-Daten werden einmal pro Spiel generiert (useMemo mit gameInitialized)
  const [opponentData, setOpponentData] = useState<{
    name: string;
    avatarSource: ImageSourcePropType;
    title: string;
  } | null>(null);

  // Add game settings hook
  const gameSettings = useGameSettings();

  // NEU: Landscape Integration für Completion Flow
  const { currentLandscape } = useLandscapes();

  // Initialize game state with simplified game complete callback
  const [gameState, gameActions] = useDuoGameState(
    initialDifficulty,
    () => router.replace("/duo"),
    (winner, reason) => {
      setWinnerInfo({ winner, reason });
      setShowCompletionModal(true);
    },
    gameSettings.showMistakes // Pass the showMistakes setting to useDuoGameState
  );

  // NEU: Berechne ob Owner (Player 1) gewonnen hat
  const isOwnerWin = useMemo(() => {
    // Player 1 = Owner (unten), winner === 1 oder Tie (0) = Owner bekommt Rewards
    return winnerInfo.winner === 1 || winnerInfo.winner === 0;
  }, [winnerInfo.winner]);

  // NEU: Completion Flow Hook für Multi-Screen Navigation
  const {
    screens,
    currentStep,
    currentScreen,
    handleContinue: handleFlowContinue,
    isLastScreen,
    showProgressionScreens,
    isOnFinalButtons,
  } = useDuoCompletionFlow({
    isOwnerWin,
    streakInfo: gameState.streakInfo,
    visible: showCompletionModal,
    hasLandscape: !!currentLandscape,
  });

  // Lade Spieler-Profil beim Mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await loadUserProfile();
        setOwnerProfile(profile);
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };
    loadProfile();
  }, []);

  // In DuoGameScreen.tsx, update this useEffect
  useEffect(() => {
    if (!gameInitialized) {
      console.log("Starting game initialization (once)");
      // Delay game initialization
      const timer = setTimeout(() => {
        try {
          gameActions.startNewGame();
          // Generiere zufällige Gegner-Daten für dieses Spiel
          setOpponentData(generateOpponentData(i18n.language));
          setGameInitialized(true);
          // Add extra delay before showing content
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error("Error starting new game:", error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameInitialized, i18n.language]); // Only depend on gameInitialized

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (gameState.isGameRunning && !gameState.isGameComplete) {
        handleBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [gameState.isGameRunning, gameState.isGameComplete]);

  // Simple back button handler with confirmation
  const handleBack = () => {
    if (gameState.isGameRunning && !gameState.isGameComplete) {
      showAlert(
        duoQuitGameAlert(() => {
          router.replace("/duo");
        })
      );
    } else {
      router.replace("/duo");
    }
  };

  // Add settings button handler
  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  // Add settings close handler
  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  // Add quit from settings handler
  const handleQuitFromSettings = () => {
    showAlert(
      duoQuitGameAlert(() => {
        setShowSettings(false);
        router.replace("/duo");
      })
    );
  };

  // Handle settings changes
  const handleSettingsChanged = (
    key: keyof GameSettings,
    value: boolean | string
  ) => {
    gameSettings.updateSetting(key, value);
  };

  // Simple handlers for modal
  const handleCloseModal = () => {
    setShowCompletionModal(false);
    router.replace("/duo");
  };

  const handleNewGame = () => {
    setShowCompletionModal(false);
    setIsLoading(true);
    setTimeout(() => {
      gameActions.startNewGame();
      setIsLoading(false);
    }, 500);
  };

  const handleRematch = () => {
    setShowCompletionModal(false);
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: initialDifficulty },
    });
  };

  // NEU: Handler für Gallery-Navigation
  const handleViewGallery = () => {
    setShowCompletionModal(false);
    setTimeout(() => {
      router.push('/gallery');
    }, 300);
  };

  // NEU: Render Completion Flow basierend auf currentScreen
  const renderCompletionFlow = () => {
    if (!showCompletionModal) return null;

    switch (currentScreen) {
      case 'modal':
        return (
          <DuoGameCompletionModal
            visible={showCompletionModal}
            onClose={handleCloseModal}
            onNewGame={handleNewGame}
            onRevanche={handleRematch}
            winner={winnerInfo.winner}
            winReason={winnerInfo.reason}
            gameTime={gameState.gameTime}
            player1Complete={gameState.player1Complete}
            player2Complete={gameState.player2Complete}
            player1Errors={gameState.player1Errors}
            player2Errors={gameState.player2Errors}
            player1Hints={MAX_HINTS - gameState.player1Hints}
            player2Hints={MAX_HINTS - gameState.player2Hints}
            maxHints={MAX_HINTS}
            maxErrors={gameState.maxErrors}
            currentDifficulty={initialDifficulty}
            player1InitialEmptyCells={gameState.player1InitialEmptyCells}
            player1SolvedCells={gameState.player1SolvedCells}
            player2InitialEmptyCells={gameState.player2InitialEmptyCells}
            player2SolvedCells={gameState.player2SolvedCells}
            ownerName={ownerProfile?.name || "User"}
            ownerAvatarSource={getAvatarSourceFromUri(ownerProfile?.avatarUri, DEFAULT_AVATAR)}
            ownerTitle={
              ownerProfile?.titleLevelIndex != null
                ? getLevels()[ownerProfile.titleLevelIndex]?.name
                : null
            }
            opponentName={opponentData?.name || "Gegner"}
            opponentAvatarSource={opponentData?.avatarSource || DEFAULT_AVATAR}
            opponentTitle={opponentData?.title}
            // NEU: Conditional Buttons
            showContinueOnly={isOwnerWin && showProgressionScreens}
            onContinue={handleFlowContinue}
          />
        );

      case 'level-path':
        return (
          <View style={styles.progressionOverlay}>
            <Animated.View
              key="level-path"
              entering={SlideInRight.duration(300)}
              exiting={SlideOutLeft.duration(300)}
              style={[styles.progressionScreen, { backgroundColor: colors.background }]}
            >
              <LevelPathScreen
                stats={gameState.gameStats}
                difficulty={initialDifficulty}
                timeElapsed={gameState.gameTime}
                autoNotesUsed={false}
                onContinue={handleFlowContinue}
              />
            </Animated.View>
          </View>
        );

      case 'landscape':
        return (
          <View style={styles.progressionOverlay}>
            <Animated.View
              key="landscape"
              entering={SlideInRight.duration(300)}
              exiting={SlideOutLeft.duration(300)}
              style={[styles.progressionScreen, { backgroundColor: colors.background }]}
            >
              <LandscapeScreen
                stats={gameState.gameStats}
                onContinue={handleFlowContinue}
                onViewGallery={handleViewGallery}
                isLastScreen={isLastScreen && !gameState.streakInfo?.changed}
                customActionButtons={
                  isOnFinalButtons ? (
                    <DuoActionButtons
                      onRematch={handleRematch}
                      onBackToMenu={handleCloseModal}
                    />
                  ) : undefined
                }
              />
            </Animated.View>
          </View>
        );

      case 'streak':
        return (
          <View style={styles.progressionOverlay}>
            <Animated.View
              key="streak"
              entering={SlideInRight.duration(300)}
              exiting={SlideOutLeft.duration(300)}
              style={[styles.progressionScreen, { backgroundColor: colors.background }]}
            >
              <StreakScreen
                stats={gameState.gameStats}
                streakInfo={gameState.streakInfo}
                onNewGame={handleRematch}
                onContinue={handleCloseModal}
                customActionButtons={
                  <DuoActionButtons
                    onRematch={handleRematch}
                    onBackToMenu={handleCloseModal}
                  />
                }
              />
            </Animated.View>
          </View>
        );

      default:
        return null;
    }
  };

  // Loading screen
  if (isLoading || gameState.board.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom, // NEU HINZUFÜGEN
          },
        ]}
      >
        <StatusBar hidden={true} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            {t('loading')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom, // NEU HINZUFÜGEN
        },
      ]}
    >
      <StatusBar hidden={true} />

      {/* Back button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={handleBack}
        >
          <Feather name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Settings button */}
      <View style={styles.settingsButtonContainer}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={handleSettingsPress}
        >
          <Feather name="settings" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Hidden timer */}
      <View style={styles.hiddenTimer}>
        <Timer
          isRunning={gameState.isGameRunning && !showSettings}
          initialTime={gameState.gameTime}
          onTimeUpdate={gameActions.handleTimeUpdate}
        />
      </View>

      {/* Main game content */}
      <View style={styles.content}>
        {/* Player 2 Controls (Top) */}
        <DuoGameControls
          position="top"
          onNumberPress={gameActions.handleNumberPress}
          onNoteToggle={gameActions.handleNoteToggle}
          onHint={gameActions.handleHint}
          onClear={gameActions.handleClear} // Löschen-Funktion hinzugefügt
          noteMode={gameState.player2NoteMode}
          disabled={
            gameState.player2Complete ||
            gameState.player2Errors >= gameState.maxErrors
          }
          hintsRemaining={gameState.player2Hints}
          errorsCount={gameState.player2Errors}
          maxErrors={gameState.maxErrors}
          showErrors={gameSettings.showMistakes}
        />

        {/* Game Board */}
        <DuoGameBoard
          board={gameState.board}
          player1Cell={gameState.player1Cell}
          player2Cell={gameState.player2Cell}
          getCellOwner={gameActions.getCellOwner}
          onCellPress={gameActions.handleCellPress}
          isLoading={false}
          showErrors={gameSettings.showMistakes}
        />

        {/* Player 1 Controls (Bottom) */}
        <DuoGameControls
          position="bottom"
          onNumberPress={gameActions.handleNumberPress}
          onNoteToggle={gameActions.handleNoteToggle}
          onHint={gameActions.handleHint}
          onClear={gameActions.handleClear} // Löschen-Funktion hinzugefügt
          noteMode={gameState.player1NoteMode}
          disabled={
            gameState.player1Complete ||
            gameState.player1Errors >= gameState.maxErrors
          }
          hintsRemaining={gameState.player1Hints}
          errorsCount={gameState.player1Errors}
          maxErrors={gameState.maxErrors}
          showErrors={gameSettings.showMistakes}
        />
      </View>

      {/* Game Completion Flow - Modal + Progression Screens */}
      {renderCompletionFlow()}

      {/* Settings Panel */}
      <DuoGameSettingsPanel
        visible={showSettings}
        onClose={handleSettingsClose}
        onQuitGame={handleQuitFromSettings}
        onSettingsChanged={handleSettingsChanged}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  // Fixed back button positioning
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
  },
  // Settings button positioning
  settingsButtonContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  hiddenTimer: {
    position: "absolute",
    top: -1000,
    opacity: 0,
    height: 1,
    width: 1,
  },
  // NEU: Styles für Progression-Screens
  progressionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  progressionScreen: {
    flex: 1,
  },
});

export default DuoGame;
