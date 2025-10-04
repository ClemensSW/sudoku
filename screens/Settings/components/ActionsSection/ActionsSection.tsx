// screens/SettingsScreen/components/ActionsSection/ActionsSection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./ActionsSection.styles";

interface ActionsSectionProps {
  showGameFeatures: boolean;
  onQuitGame?: () => void;
  onPauseGame?: () => void;
  isDuoMode?: boolean; // New prop to indicate Duo mode
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  showGameFeatures,
  onQuitGame,
  onPauseGame,
  isDuoMode = false, // Default to false
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // If not in game context, return nothing
  if (!showGameFeatures || !onQuitGame) return null;

  // Use different color for button in Duo mode
  const buttonColor = isDuoMode ? "#4A7D78" : colors.error;
  // Use blue color for pause button - different for light and dark mode
  const pauseColor = theme.isDark ? "#5B9FED" : "#2563EB";

  return (
    <View
      style={[
        styles.settingsGroup,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Pause Game - nur im Einzelspieler-Modus */}
      {!isDuoMode && onPauseGame && (
        <>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onPauseGame}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: `${pauseColor}20` },
              ]}
            >
              <Feather name="pause-circle" size={20} color={pauseColor} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: pauseColor }]}>
                Spiel pausieren
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Separator between buttons */}
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        </>
      )}

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