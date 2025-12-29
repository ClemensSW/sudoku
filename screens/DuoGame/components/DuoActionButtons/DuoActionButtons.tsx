// screens/DuoGame/components/DuoActionButtons/DuoActionButtons.tsx
/**
 * Action Buttons für Duo Progression-Screens (Landscape, Streak)
 * Zeigt "Revanche" und "Zum Menü" Buttons
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import Button from "@/components/Button/Button";

interface DuoActionButtonsProps {
  onRematch: () => void;
  onBackToMenu: () => void;
  customColor?: string;
}

const DuoActionButtons: React.FC<DuoActionButtonsProps> = ({
  onRematch,
  onBackToMenu,
  customColor,
}) => {
  const { t } = useTranslation("duoGame");
  const theme = useTheme();
  const pathColor = useProgressColor();
  const buttonColor = customColor || pathColor;

  return (
    <View style={styles.container}>
      {/* Revanche Button */}
      <Button
        title={t("completion.buttons.rematch")}
        onPress={onRematch}
        variant="primary"
        customColor={buttonColor}
        icon={<Feather name="refresh-cw" size={22} color={theme.colors.buttonText} />}
        iconPosition="left"
        style={styles.primaryButton}
      />

      {/* Zum Menü Button */}
      <Button
        title={t("completion.buttons.backToMenu")}
        onPress={onBackToMenu}
        variant="outline"
        customColor={buttonColor}
        style={styles.secondaryButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  primaryButton: {
    width: "100%",
    marginBottom: 12,
  },
  secondaryButton: {
    width: "100%",
  },
});

export default DuoActionButtons;
