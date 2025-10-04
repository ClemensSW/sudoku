// screens/GameScreen/components/GameSettingsPanel/GameSettingsPanel.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import SettingsScreen from "@/screens/Settings/Settings";
import { GameSettings } from "@/utils/storage";

interface GameSettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  onQuitGame: () => void;
  onPauseGame: () => void;
  onAutoNotes: () => void;
  onSettingsChanged: (key: keyof GameSettings, value: boolean | string) => void;
}

const GameSettingsPanel: React.FC<GameSettingsPanelProps> = ({
  visible,
  onClose,
  onQuitGame,
  onPauseGame,
  onAutoNotes,
  onSettingsChanged,
}) => {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <SettingsScreen
        onBackToGame={onClose}
        onQuitGame={onQuitGame}
        onPauseGame={onPauseGame}
        onAutoNotes={onAutoNotes}
        onSettingsChanged={onSettingsChanged}
        fromGame={true}
      />
    </View>
  );
};

export default GameSettingsPanel;