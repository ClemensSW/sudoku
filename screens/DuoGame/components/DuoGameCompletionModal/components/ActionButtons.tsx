// screens/DuoGame/components/DuoGameCompletionModal/components/ActionButtons.tsx
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Button from "@/components/Button/Button";

interface ActionButtonsProps {
  onRematch: () => void;
  onBackToMenu: () => void;
  leaguePrimary: string;
  buttonOpacity: Animated.SharedValue<number>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRematch,
  onBackToMenu,
  leaguePrimary,
  buttonOpacity,
}) => {
  const { t } = useTranslation("duoGame");
  const theme = useTheme();

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark
            ? `${theme.colors.background}F2`
            : `${theme.colors.card}F2`,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.isDark
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.08)",
        },
        buttonsStyle,
      ]}
    >
      {/* Rematch Button */}
      <Button
        title={t("completion.buttons.rematch")}
        onPress={onRematch}
        variant="primary"
        customColor={leaguePrimary}
        icon={<Feather name="refresh-cw" size={22} color={theme.colors.buttonText} />}
        iconPosition="left"
        style={styles.primaryButton}
      />

      {/* Back to Menu Button */}
      <Button
        title={t("completion.buttons.backToMenu")}
        onPress={onBackToMenu}
        variant="outline"
        customColor={leaguePrimary}
        style={styles.secondaryButton}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    zIndex: 5,
  },
  primaryButton: {
    width: "100%",
    marginBottom: 12,
  },
  secondaryButton: {
    width: "100%",
  },
});

export default ActionButtons;
