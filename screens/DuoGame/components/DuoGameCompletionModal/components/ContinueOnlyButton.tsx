// screens/DuoGame/components/DuoGameCompletionModal/components/ContinueOnlyButton.tsx
/**
 * Einzelner "Weiter" Button für das DuoGameCompletionModal
 * Wird angezeigt wenn der Owner gewonnen hat und der Progression-Flow folgt
 */
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Button from "@/components/Button/Button";

interface ContinueOnlyButtonProps {
  onContinue: () => void;
  leaguePrimary: string;
  buttonOpacity: SharedValue<number>;
}

const ContinueOnlyButton: React.FC<ContinueOnlyButtonProps> = ({
  onContinue,
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
      <Button
        title={t("completion.buttons.continue")}
        onPress={onContinue}
        variant="primary"
        customColor={leaguePrimary}
        icon={<Feather name="arrow-right" size={22} color={theme.colors.buttonText} />}
        iconPosition="right"
        style={styles.primaryButton}
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
    zIndex: 60,
  },
  primaryButton: {
    width: "100%",
  },
});

export default ContinueOnlyButton;
