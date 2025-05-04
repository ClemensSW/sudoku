// screens/DuoGameScreen/components/DuoGameSettingsPanel.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";
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
    <View style={StyleSheet.absoluteFill}>
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
      zIndex: 1000, // Make sure it's above everything else
      backgroundColor: 'rgba(0,0,0,0.9)', // Optional semi-transparent background
      elevation: 10, // For Android
      position: 'absolute', // Make sure it's positioned absolutely
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
  });
  

export default DuoGameSettingsPanel;