// screens/DuoGame/components/DuoGameCompletionModal/components/ActionButtons.tsx
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";

interface ActionButtonsProps {
  onRematch: () => void;
  onBackToMenu: () => void;
  progressColor: string;
  buttonOpacity: Animated.SharedValue<number>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRematch,
  onBackToMenu,
  progressColor,
  buttonOpacity,
}) => {
  const { t } = useTranslation("duoGame");

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
      {/* Rematch Button */}
      <Button
        title={t("completion.buttons.rematch")}
        onPress={onRematch}
        variant="primary"
        customColor={progressColor}
        iconLeft={<Feather name="refresh-cw" size={20} />}
        style={{
          width: "100%",
          paddingVertical: 16,
          marginBottom: 16,
        }}
      />

      {/* Back to Menu Button */}
      <Button
        title={t("completion.buttons.backToMenu")}
        onPress={onBackToMenu}
        variant="outline"
        customColor={progressColor}
        style={{
          width: "100%",
          paddingVertical: 16,
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    position: "absolute",
    bottom: 48,
    left: 24,
    right: 24,
    zIndex: 5,
  },
});

export default ActionButtons;
