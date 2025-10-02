// screens/DuoGameScreen/components/DuoGameSettingsPanel.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import SettingsScreen from "@/screens/Settings/Settings";
import { GameSettings } from "@/utils/storage";

interface DuoGameSettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  onQuitGame: () => void;
  onSettingsChanged: (key: keyof GameSettings, value: boolean | string) => void;
}

const DuoGameSettingsPanel: React.FC<DuoGameSettingsPanelProps> = ({
  visible,
  onClose,
  onQuitGame,
  onSettingsChanged,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <SettingsScreen
        onBackToGame={onClose}
        onQuitGame={onQuitGame}
        onSettingsChanged={onSettingsChanged}
        fromGame={true}
        isDuoMode={true} // This flag indicates we're in Duo mode
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Equivalent to StyleSheet.absoluteFill
    zIndex: 9999, // Very high zIndex to ensure it's above everything
    elevation: 100, // High elevation for Android
    backgroundColor: 'rgba(0,0,0,0.95)', // Nearly opaque background
    position: 'absolute', // Explizite Position
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default DuoGameSettingsPanel;