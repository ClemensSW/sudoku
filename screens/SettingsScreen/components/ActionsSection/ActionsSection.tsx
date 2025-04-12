// screens/SettingsScreen/components/ActionsSection/ActionsSection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./ActionsSection.styles";

interface ActionsSectionProps {
  showGameFeatures: boolean;
  onQuitGame?: () => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  showGameFeatures,
  onQuitGame,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Wenn nicht im Spielkontext, geben wir nichts zurück
  if (!showGameFeatures || !onQuitGame) return null;

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
            { backgroundColor: `${colors.error}20` },
          ]}
        >
          <Feather name="x-circle" size={20} color={colors.error} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={[styles.actionTitle, { color: colors.error }]}>
            Spiel beenden
          </Text>
          <Text
            style={[
              styles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Zurück zum Hauptmenü
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