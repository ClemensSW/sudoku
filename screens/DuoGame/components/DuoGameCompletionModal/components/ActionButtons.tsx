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
  pathColorHex: string;
  buttonOpacity: Animated.SharedValue<number>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRematch,
  onBackToMenu,
  pathColorHex,
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
        style={{
          width: "100%",
          height: 56,
          marginBottom: 16,
          backgroundColor: pathColorHex,
          shadowColor: pathColorHex, // Match shadow color with button color
        }}
        icon={<Feather name="refresh-cw" size={20} color="#FFFFFF" />}
        iconPosition="left"
      />

      {/* Back to Menu Button */}
      <Button
        title={t("completion.buttons.backToMenu")}
        onPress={onBackToMenu}
        variant="outline"
        style={{
          width: "100%",
          height: 56,
          borderColor: pathColorHex,
        }}
        textStyle={{ color: pathColorHex }}
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
