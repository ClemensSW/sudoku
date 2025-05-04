// screens/SettingsScreen/components/ActionsSection/ActionsSection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./ActionsSection.styles";

interface ActionsSectionProps {
  showGameFeatures: boolean;
  onQuitGame?: () => void;
  isDuoMode?: boolean; // New prop to indicate Duo mode
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  showGameFeatures,
  onQuitGame,
  isDuoMode = false, // Default to false
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // If not in game context, return nothing
  if (!showGameFeatures || !onQuitGame) return null;

  // Use different color for button in Duo mode
  const buttonColor = isDuoMode ? "#4A7D78" : colors.error;

  return (
    <View
      style={[
        styles.settingsGroup,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Quit Game */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onQuitGame}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: `${buttonColor}20` },
          ]}
        >
          <Feather name="x-circle" size={20} color={buttonColor} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={[styles.actionTitle, { color: buttonColor }]}>
            Spiel beenden
          </Text>
          <Text
            style={[
              styles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Zurück zum {isDuoMode ? "Duo-Menü" : "Hauptmenü"}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ActionsSection;