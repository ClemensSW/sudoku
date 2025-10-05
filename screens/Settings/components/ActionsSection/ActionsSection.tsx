// screens/SettingsScreen/components/ActionsSection/ActionsSection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import CoffeeBreakIcon from "@/assets/svg/coffeeBreak.svg";
import CloseIcon from "@/assets/svg/close.svg";
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
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;

  // If not in game context, return nothing
  if (!showGameFeatures || !onQuitGame) return null;

  // Use different color for button in Duo mode
  const buttonColor = isDuoMode ? "#4A7D78" : colors.error;
  // Use primary color from theme for pause button
  const pauseColor = colors.primary;

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
            <View style={styles.actionIcon}>
              <CoffeeBreakIcon width={48} height={48} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                {t("actions.pauseGame")}
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
        <View style={styles.actionIcon}>
          <CloseIcon width={48} height={48} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
            {t("actions.quitGame")}
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