import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { darkenColor } from "../utils/colorHelpers";
import { spacing } from "@/utils/theme";

interface GalleryActionProps {
  progressColor: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
}

const GalleryAction: React.FC<GalleryActionProps> = ({
  progressColor,
  onPress,
  variant = 'primary',
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const { colors } = theme;

  const isPrimary = variant === 'primary';

  return (
    <View style={styles.actionSection}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.galleryButton,
          isPrimary ? {
            // Primary variant - filled button
            backgroundColor: pressed
              ? darkenColor(progressColor, 20)
              : progressColor,
            shadowColor: progressColor,
            elevation: 2,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          } : {
            // Outline variant - less prominent
            backgroundColor: pressed
              ? `${progressColor}15`
              : 'transparent',
            borderWidth: 1.5,
            borderColor: progressColor,
            elevation: 0,
            shadowOpacity: 0,
          },
        ]}
      >
        <Feather
          name="image"
          size={18}
          color={isPrimary ? "#FFFFFF" : progressColor}
        />
        <Text style={[
          styles.buttonText,
          { color: isPrimary ? "#FFFFFF" : progressColor }
        ]}>
          {t('buttons.viewGallery')}
        </Text>
        <Feather
          name="arrow-right"
          size={18}
          color={isPrimary ? "#FFFFFF" : progressColor}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  actionSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default React.memo(GalleryAction);
